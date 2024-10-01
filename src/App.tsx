import { ChangeEvent, useState } from "react";
import Button from "./components/Button";

function App() {
  const [file, setFile] = useState<File>();

  const handleButtonClick = () => {
    console.log("Print file content");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".txt" />
      {file && <p>Selected File: {file.name}</p>}
      <Button color="primary" onClick={handleButtonClick}>
        Submit file
      </Button>
    </div>
  );
}

export default App;
