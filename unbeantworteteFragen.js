// unbeantworteteFragen.js
const mongoose = require('mongoose');

// Definiere das Schema für die unbeantworteten Fragen
const unbeantworteteFragenSchema = new mongoose.Schema({
    frage: { type: String, required: true },
    antworten: { type: [String], required: true },
    richtigeAntwort: { type: String, required: true },
});

// Erstelle ein Modell basierend auf dem Schema
const UnbeantworteteFrage = mongoose.model('UnbeantworteteFrage', unbeantworteteFragenSchema);

// Exportiere das Modell, damit es in anderen Dateien verwendet werden kann
module.exports = UnbeantworteteFrage;