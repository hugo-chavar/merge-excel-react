import { ChangeEvent, useEffect, useState } from "react";
import { BsFiletypeXlsx } from "react-icons/bs";
import Button from "./components/Button";
import Toggle from "./components/Toggle";
import CasesToExcel from "./models/CasesToExcel";
import ExcelToCases from "./models/ExcelToCases";
import Logger from "./utils/logger";
import useDebugMode from "./utils/hooks";

function App() {
  const { debugMode, toggleDebugMode } = useDebugMode();
  const [error, setError] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [cases, setCases] = useState<any[]>([]);

  const [processedCases, setProcessedCases] = useState(-1);
  const [firstExcelFile, setFirstExcelFile] = useState<File>();
  const [secondExcelFile, setSecondExcelFile] = useState<File>();

  const logger = new Logger({
    updateDebugMode: (callback) => {
      callback(debugMode);
    },
  });

  useEffect(() => {
    // console.log("debugMode updated:", debugMode);
    logger.update();
  }, [debugMode]);

  const getSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.files.length > 0) {
      setError(false);
      setSuccess(false);
      setErrorMessage("");
      setStatusMessage("Waiting for file to be submitted");
      setExtracting(false);

      return event.target.files[0];
    }
    return null;
  };

  const handleFirstExcelFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = getSelectedFile(event);
    if (selectedFile) {
      logger.log(selectedFile);
      setFirstExcelFile(selectedFile);
    }
  };

  const handleSecondExcelFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = getSelectedFile(event);
    if (selectedFile) {
      logger.log(selectedFile);
      setSecondExcelFile(selectedFile);
    }
  };

  const handleSubmitExcelFilesButtonClick = () => {
    if (firstExcelFile && secondExcelFile) {
      setExtracting(true);
      setSuccess(false);
      setStatusMessage("Loading data from first excel file");
      // console.log(file);
      const firstExcelPromise: Promise<any[]> =
        ExcelToCases.readExcelFile(firstExcelFile);
      const secondExcelPromise: Promise<any[]> =
        ExcelToCases.readExcelFile(secondExcelFile);
      Promise.all([firstExcelPromise, secondExcelPromise])
        .then((extractedCases) => {
          console.log(extractedCases);
          setExtracting(false);
          setSuccess(true);
          const allCases = extractedCases[0].concat(extractedCases[1]);
          setCases(allCases);
          setProcessedCases(allCases.length);

          setStatusMessage("First excel file loaded successfully");
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
    return "result.xlsx";
  };

  const handleDownloadExcelButtonClick = () => {
    setStatusMessage("Generating Excel file");
    console.log("Generating Excel file");
    console.log(cases);
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
      <h1 className="display-2">Merge Excel files</h1>
      <hr className="border border-primary border-3 opacity-75"></hr>
      <div className="grid gap-2 row-gap-5">
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
        </div>

        <div className="row text-center p-2">
          <label htmlFor="formFile" className="form-label">
            Please choose the first excel file
          </label>
          <input
            className="form-control"
            type="file"
            onChange={handleFirstExcelFileChange}
            accept=".xlsx"
            id="formFile"
            disabled={extracting}
          />
        </div>

        <div className="row text-center p-2">
          <label htmlFor="formFile" className="form-label">
            Please choose the second excel file
          </label>
          <input
            className="form-control"
            type="file"
            onChange={handleSecondExcelFileChange}
            accept=".xlsx"
            id="formFile"
            disabled={extracting}
          />
        </div>

        <div className="row text-center p-2">
          <div className="col-5">
            <Button
              color="primary"
              onClick={handleSubmitExcelFilesButtonClick}
              icon={<BsFiletypeXlsx />}
              disabled={
                firstExcelFile == null ||
                secondExcelFile == null ||
                extracting ||
                error ||
                success
              }
            >
              Submit Excel files
            </Button>
          </div>
          <div className="col-5">
            <Button
              color="primary"
              onClick={handleDownloadExcelButtonClick}
              disabled={!success}
              icon={<BsFiletypeXlsx />}
            >
              {`Download Excel file ${
                success ? "(" + processedCases + " rows)" : ""
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
