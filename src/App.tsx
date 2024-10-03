import { ChangeEvent, useEffect, useState } from "react";
import Button from "./components/Button";
import DebugModeToggle from "./components/DebugModeToggle";
import CasesExtractor from "./models/CasesExtractor";
import Logger from "./utils/logger";
import useDebugMode from "./utils/hooks";

function App() {
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>("");
  const { debugMode, toggleDebugMode } = useDebugMode();

  const logger = new Logger({
    updateDebugMode: (callback) => {
      callback(debugMode);
    },
  });

  useEffect(() => {
    console.log("debugMode updated:", debugMode);
    logger.update();
  }, [debugMode]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
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
      const casesExtractor = new CasesExtractor(logger);
      const result = casesExtractor.extractCasesFromText(fileContent, -1);
      logger.log(result);
    } else {
      logger.log("No file selected");
    }
  };

  return (
    <div className="mx-auto">
      <div className="centered-content">
        <input type="file" onChange={handleFileChange} accept=".txt" />
        {file && <p>Selected File: {file.name}</p>}
        <Button color="primary" onClick={handleButtonClick}>
          Submit file
        </Button>
        <DebugModeToggle
          debugMode={debugMode}
          toggleDebugMode={toggleDebugMode}
        />
      </div>
    </div>
  );
}

export default App;
