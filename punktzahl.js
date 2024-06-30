const mongoose = require('mongoose');

// Definiere das Schema für eine Punktzahl
const punktzahlSchema = new mongoose.Schema({
    name: { type: String, required: true },
    punktzahl: { type: Number, required: true }
});

// Erstelle ein Modell basierend auf dem Schema
const Punktzahl = mongoose.model('Punktzahl', punktzahlSchema);

// Exportiere das Modell, damit es in anderen Dateien verwendet werden kann
module.exports = Punktzahl;