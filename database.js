const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/Fussballquiz'; // Verwende den Namen deiner Datenbank

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Entferne die veralteten Optionen
  useFindAndModify: false,
  useCreateIndex: true
});

mongoose.connection.on('connected', () => {
  console.log('Verbindung zur MongoDB hergestellt');
});

mongoose.connection.on('error', (err) => {
  console.error(`Fehler bei der Verbindung zur MongoDB: ${err.message}`);
});

module.exports = mongoose;