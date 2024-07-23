const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

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
    time: Date,
});


const Speed = mongoose.model('Speed', speedSchema);

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para actualizar los datos
app.post('/update', (req, res) => {
    const newData = new Speed({
        x: req.body.x,
        y: req.body.y,
        z: req.body.z,
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


app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    res.send("Hola desde el servidor");
});

const port = 8000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
