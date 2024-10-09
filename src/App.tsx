import { ChangeEvent, useEffect, useState } from "react";
import { BsFiletypeXlsx, BsFiletypeTxt } from "react-icons/bs";
import Button from "./components/Button";
import Toggle from "./components/Toggle";
import CasesExtractor from "./models/CasesExtractor";
import CasesToExcel from "./models/CasesToExcel";
import Logger from "./utils/logger";
import useDebugMode from "./utils/hooks";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [file, setFile] = useState<File>();
  const [extractedFile, setExtractedFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>("");
  const { debugMode, toggleDebugMode } = useDebugMode();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [cases, setCases] = useState<any[]>([]);
  const [limitCases, setLimitCases] = useState(false);
  const [casesToProcess, setCasesToProcess] = useState(100);
  const [processedCases, setProcessedCases] = useState(-1);
  const [parameterCasesToProcess, setParameterCasesToProcess] = useState(-1);

  const handleOnLimitChange = () => {
    setLimitCases(!limitCases);
  };

  const logger = new Logger({
    updateDebugMode: (callback) => {
      callback(debugMode);
    },
  });

  useEffect(() => {
    console.log("debugMode updated:", debugMode);
    logger.update();
  }, [debugMode]);

  const casesExtractor = new CasesExtractor(logger);

  const handleSetProgress = (progressValue: number) => {
    setProgress(progressValue);
    // console.log(`Progress SET: ${progressValue.toFixed(2)}%`);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.files.length > 0) {
      setError(false);
      setSuccess(false);
      setErrorMessage("");
      setStatusMessage("Waiting for file to be submitted");
      setExtractedFile(undefined);
      setProgress(0);
      const selectedFile = event.target.files[0];
      setExtracting(false);
      logger.log(selectedFile);
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target != null) setFileContent(e.target.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  const getCasesToProcess = () => {
    return limitCases ? casesToProcess : -1;
  };

  const handleSubmitFileButtonClick = () => {
    if (fileContent) {
      setExtracting(true);
      setSuccess(false);
      setStatusMessage("Extracting cases from file");
      // console.log(file);
      casesExtractor
        .extractCasesFromText(
          fileContent,
          getCasesToProcess(),
          handleSetProgress
        )
        .then((extractedCases) => {
          // console.log(extractedCases);
          setExtracting(false);
          setSuccess(true);
          setCases(extractedCases);
          setExtractedFile(file);
          setStatusMessage("Cases extracted successfully");
          setProcessedCases(extractedCases.length);
          setParameterCasesToProcess(getCasesToProcess());
        })
        .catch((reason) => {
          setError(true);
          setExtracting(false);
          setSuccess(false);
          setErrorMessage(reason.message);
          setProcessedCases(-2);
          setStatusMessage("Cases extraction stopped due to an error");
          logger.log(reason.message);
        });
    } else {
      setError(true);
      setExtracting(false);
      let message = "No file selected";
      setErrorMessage(message);
      logger.log(message);
    }
  };

  const getExcelFileName = () => {
    if (!file) return "result.xlsx";

    const filenameParts = file.name.split(".");

    const filenameWithoutExtension = filenameParts.slice(0, -1).join(".");

    return `${filenameWithoutExtension}.xlsx`;
  };

  const handleDownloadExcelButtonClick = () => {
    setStatusMessage("Generating Excel file");
    const casesToExcel = new CasesToExcel(cases);
    const excelFilename = getExcelFileName();
    setStatusMessage("Downloading Excel File: " + excelFilename);

    casesToExcel.writeExcelFileToFileSystem(excelFilename).then(() => {
      let message = "Excel file was saved";
      logger.log(message);
      setStatusMessage(message);
    });
  };

  return (
    <div className="container-sm">
      <h1 className="display-2">Cases to Excel</h1>
      <hr className="border border-primary border-3 opacity-75"></hr>
      <div className="grid gap-2 row-gap-5">
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Please choose the text input file
          </label>
          <input
            className="form-control"
            type="file"
            onChange={handleFileChange}
            accept=".txt"
            id="formFile"
            disabled={extracting}
          />
        </div>
        <div className="row text-center p-2">
          <div className="col-4">
            <Toggle
              checked={debugMode}
              disabled={extracting}
              onChange={toggleDebugMode}
              name={"debug"}
            >
              Enable Debug Mode
            </Toggle>
          </div>
          <div className="col-4">
            <Toggle
              checked={limitCases}
              disabled={extracting}
              onChange={handleOnLimitChange}
              name={"limit"}
            >
              Process only the first:
            </Toggle>
          </div>
          <div className="col-2">
            <input
              type="number"
              className="form-control"
              aria-label="Number input"
              min={0}
              max={99999}
              onChange={(e) => {
                setCasesToProcess(+e.target.value);
              }}
              defaultValue={limitCases ? 100 : ""}
              disabled={!limitCases}
            />
          </div>
          <div className="col-1">cases</div>
        </div>
        <div className="row text-center p-2">
          <div className="col-3">
            <Button
              color="primary"
              onClick={handleSubmitFileButtonClick}
              icon={<BsFiletypeTxt />}
              disabled={
                file == null ||
                extracting ||
                error ||
                (extractedFile &&
                  file.name == extractedFile.name &&
                  parameterCasesToProcess == getCasesToProcess())
              }
            >
              Submit file
            </Button>
          </div>
          <div className="col-9">
            <ProgressBar
              progress={progress}
              statusMessage={statusMessage}
              error={error}
              success={success}
            />
          </div>
        </div>

        <div className="row text-center p-2">
          <div className="col">
            <Button
              color="primary"
              onClick={handleDownloadExcelButtonClick}
              disabled={!success}
              icon={<BsFiletypeXlsx />}
            >
              {`Download Excel file ${
                success ? "(" + processedCases + " cases)" : ""
              }`}
            </Button>
          </div>
        </div>

        <div className="row text-center p-2">
          {error && (
            <div className="text-bg-danger p-3">
              The input file has some problems. ERROR: {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
