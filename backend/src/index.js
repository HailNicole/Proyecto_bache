const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/proyecto_integrador');

mongoose.connection.on('connected', () => {
    console.log('Conectado a la base de datos MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error al conectar a la base de datos MongoDB:', err);
});

const speedSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    z: Number,
    lat: Number,  // Agregar latitud
    lng: Number,  // Agregar longitud
    time: Date,
});


const Speed = mongoose.model('Speed', speedSchema);

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configura la ruta para servir archivos estáticos desde frontend/src
app.use(express.static(path.join(__dirname, '../../frontend/src')));

// Ruta para actualizar los datos
app.get('/update', (req, res) => {
    const newData = new Speed({
        x: parseFloat(req.query.x),
        y: parseFloat(req.query.y),
        z: parseFloat(req.query.z),
        lat: parseFloat(req.query.lat),  // Leer latitud
        lng: parseFloat(req.query.lng),  // Leer longitud
        time: new Date(),
    });

    newData.save()
        .then(() => {
            console.log(newData);
            res.status(200).send('Data received and stored');
        })
        .catch(err => {
            res.status(500).send('Error saving data');
            console.error(err);
        });
});


// Ruta para obtener todos los datos
app.get('/get', (req, res) => {
    Speed.find({})
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send('Error retrieving data');
            console.error(err);
        });
});

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/index.html'));
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
