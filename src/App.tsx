import { ChangeEvent, useState } from "react";
import ListGroup from "./components/ListGroup";
import Button from "./components/Button";

function App() {
  let items = ["Posadas", "Puerto Rico", "Jardín América", "Iguazú"];

  const handleSelectItem = (item: string) => {
    console.log(
      "%cItem selected: %s",
      "background: red; color: yellow; font-size: x-large",
      item
    );
    // console.log(item);
  };

  const [file, setFile] = useState<File>();
  const [openDialog, setOpenDialog] = useState(false);

  const handleButtonClick = () => {
    setOpenDialog(true);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const selectedFile = event.target.files[0];
      if (selectedFile.name.endsWith(".txt")) {
        setFile(selectedFile);
        setOpenDialog(false);
      } else {
        alert("Only .txt files are allowed");
        setOpenDialog(true);
      }
    }
  };

  // const handleCloseDialog = () => {
  //   setOpenDialog(false);
  // };

  return (
    <div>
      <Button color="secondary" onClick={handleButtonClick}>
        Mi boton
      </Button>
      <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      />
      {openDialog && (
        <input type="file" onChange={handleFileChange} accept=".txt" />
      )}
      {file && <p>Selected File: {file.name}</p>}
    </div>
  );
}

export default App;
