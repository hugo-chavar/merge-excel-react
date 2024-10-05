import { ChangeEvent, useEffect, useState } from "react";
import { BsFiletypeXlsx, BsFiletypeTxt } from "react-icons/bs";
import Button from "./components/Button";
import DebugModeToggle from "./components/DebugModeToggle";
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
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [cases, setCases] = useState<any[]>([]);

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
    if (event.target.files != null) {
      setError(false);
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

  const handleSubmitFileButtonClick = () => {
    if (fileContent) {
      setError(false);
      setErrorMessage("");
      setExtracting(true);
      setStatusMessage("Extracting cases from file");
      console.log(file);
      casesExtractor
        .extractCasesFromText(fileContent, 150, handleSetProgress)
        .then((extractedCases) => {
          console.log(extractedCases);
          setExtracting(false);
          setCases(extractedCases);
          setExtractedFile(file);
          setStatusMessage("Cases extracted successfully");
        })
        .catch((reason) => {
          setError(true);
          setExtracting(false);
          setErrorMessage(reason.message);
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

  const handleDownloadExcelButtonClick = () => {
    setStatusMessage("Generating Excel file");
    const casesToExcel = new CasesToExcel(cases);
    setStatusMessage("Downloading Excel File");
    casesToExcel.writeExcelFileToFileSystem("test.xlsx").then(() => {
      let message = "Excel file was saved";
      logger.log(message);
      setStatusMessage(message);
    });
  };

  return (
    <div className="mx-auto">
      <div className="centered-content">
        <ProgressBar progress={progress} statusMessage={statusMessage} />
        <input type="file" onChange={handleFileChange} accept=".txt" />
        {file && <p>Selected File: {file.name}</p>}
        <Button
          color="primary"
          onClick={handleSubmitFileButtonClick}
          icon={<BsFiletypeTxt />}
          disabled={
            file == null ||
            extracting ||
            (extractedFile && file.name == extractedFile.name)
          }
        >
          Submit file
        </Button>
        {error && <p>ERROR: {errorMessage}</p>}
        <DebugModeToggle
          debugMode={debugMode}
          toggleDebugMode={toggleDebugMode}
        />
        <Button
          color="primary"
          onClick={handleDownloadExcelButtonClick}
          disabled={extractedFile == null}
          icon={<BsFiletypeXlsx />}
        >
          Download Excel file
        </Button>
      </div>
    </div>
  );
}

export default App;
