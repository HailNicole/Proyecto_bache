const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const db = require("./firebase"); // Importa la configuración de Firebase

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../../frontend/src")));

app.get("/update", (req, res) => {
  const newData = {
    x: parseFloat(req.query.x),
    y: parseFloat(req.query.y),
    z: parseFloat(req.query.z),
    lat: parseFloat(req.query.lat),
    lng: parseFloat(req.query.lng),
    time: new Date().toISOString(),
  };

  // Guarda los datos en Firebase
  const ref = db.ref("baches"); // Cambia 'speed_data' por el nombre que desees para la colección
  ref
    .push(newData)
    .then(() => {
      console.log(newData);
      res.status(200).send("Data received and stored");
    })
    .catch((err) => {
      res.status(500).send("Error saving data");
      console.error(err);
    });
});

app.get("/get", (req, res) => {
  const bachesRef = db.ref("baches");

  // Obtén los datos una sola vez
  bachesRef
    .once("value")
    .then((snapshot) => {
      const bachesData = snapshot.val();
      res.status(200).json(bachesData);
      //console.log("Datos obtenidos:", bachesData);
    })
    .catch((err) => {
      res.status(500).send("Error retrieving data");
      console.error("Error al obtener datos:", err);
    });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/index.html"));
});

app.get("/mapa", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/src/mapa_index.html"));
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
