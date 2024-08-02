const admin = require('firebase-admin');
// Carga tu archivo de claves privadas JSON desde Firebase
const serviceAccount = require('./secret.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gps-acc-default-rtdb.firebaseio.com/'
});
const db = admin.database();
module.exports = db;
