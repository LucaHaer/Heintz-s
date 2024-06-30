const mongoose = require('mongoose');

// Definiere das Schema für die Top 3 Liste
const top3Schema = new mongoose.Schema({
    name: { type: [String], required: true },
    punktzahl: { type: [Number], required: true }
});

// Erstelle ein Modell basierend auf dem Schema
const Top3 = mongoose.model('Top3', top3Schema);

// Exportiere das Modell, damit es in anderen Dateien verwendet werden kann
module.exports = Top3;