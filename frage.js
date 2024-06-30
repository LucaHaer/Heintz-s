const mongoose = require('mongoose');

// Definiere das Schema für eine Frage
const frageSchema = new mongoose.Schema({
    frage: { type: String, required: true },
    antworten: { type: [String], required: true },
    richtigeAntwort: { type: String, required: true }
});

// Erstelle ein Modell basierend auf dem Schema
const Frage = mongoose.model('Frage', frageSchema);

// Exportiere das Modell, damit es in anderen Dateien verwendet werden kann
module.exports = Frage;