import { ChangeEvent, useState } from "react";
import Button from "./components/Button";
import CasesExtractor from "./models/CasesExtractor";

function App() {
  const [file, setFile] = useState<File>();
  const [fileContent, setFileContent] = useState<string>("");

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
      const casesExtractor = new CasesExtractor();
      const result = casesExtractor.extractCasesFromText(fileContent, -1);
      console.log(result);
    } else {
      console.log("No file selected");
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
      </div>
    </div>
  );
}

export default App;
