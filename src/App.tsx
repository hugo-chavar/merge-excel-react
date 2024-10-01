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

  return (
    <div>
      <Button
        color="secondary"
        onClick={() => console.log("Mi boton clickeado")}
      >
        Mi boton
      </Button>
      <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}

export default App;
