import { ChangeEvent, useEffect, useState } from "react";
import { BsFiletypeXlsx, BsFiletypeTxt } from "react-icons/bs";
import Button from "./components/Button";
import DebugModeToggle from "./components/DebugModeToggle";
import CasesExtractor from "./models/CasesExtractor";
import Logger from "./utils/logger";
import useDebugMode from "./utils/hooks";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>("");
  const { debugMode, toggleDebugMode } = useDebugMode();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target != null) setFileContent(e.target.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileContent) {
      setError(false);
      casesExtractor
        .extractCasesFromText(fileContent, -1, handleSetProgress)
        .then((cases) => {
          console.log(cases);
        })
        .catch((reason) => {
          setError(true);
          setErrorMessage(reason.message);
          logger.log(reason.message);
        });
    } else {
      setError(true);
      let message = "No file selected";
      setErrorMessage(message);
      logger.log(message);
    }
  };

  return (
    <div className="mx-auto">
      <div className="centered-content">
        <ProgressBar progress={progress} />
        <input type="file" onChange={handleFileChange} accept=".txt" />
        {file && <p>Selected File: {file.name}</p>}
        <Button
          color="primary"
          onClick={handleButtonClick}
          icon={<BsFiletypeTxt />}
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
          onClick={handleButtonClick}
          disabled={true}
          icon={<BsFiletypeXlsx />}
        >
          Download Excel file
        </Button>
      </div>
    </div>
  );
}

export default App;
