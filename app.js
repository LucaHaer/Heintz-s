const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const UnbeantworteteFrage = require('./unbeantworteteFragen'); // Dein Modell importieren
const Top3 = require('./top3');
const Punktzahl = require('./punktzahl'); // Importiere das Punktzahl-Modell

const app = express();
app.use(bodyParser.json());

// MongoDB-Verbindung herstellen
mongoose.connect('mongodb://localhost:27017/Fussballquiz', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB verbunden");
}).catch(err => {
    console.error("MongoDB-Verbindungsfehler:", err);
});

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, '../frontend')));

// Für den Zugriff auf Bilder
app.use('/images', express.static(path.join(__dirname, 'frontend/images')));

// Index-Route hinzufügen
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});


// API-Endpunkte
app.post('/api/unbeantwortete-fragen', async (req, res) => {
    try {
        const neueFragen = req.body;
        const erstellteFragen = await UnbeantworteteFrage.insertMany(neueFragen);
        res.status(201).json(erstellteFragen);
    } catch (error) {
        console.error("Fehler beim Hinzufügen der Fragen:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/unbeantwortete-fragen', async (req, res) => {
    try {
        const fragen = await UnbeantworteteFrage.find();
        res.json(fragen);
    } catch (error) {
        console.error("Fehler beim Laden der Fragen:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route für das Speichern der Top 3 Liste
app.post('/api/speichere-top3', async (req, res) => {
    const { name, punktzahl } = req.body;

    try {
        // Lösche alle existierenden Einträge in der Top 3 Liste
        await Top3.deleteMany({});

        // Erstelle ein Objekt basierend auf dem Schema
        const top3 = new Top3({
            name: name,
            punktzahl: punktzahl
        });

        // Speichere die neuen Einträge in der Top 3 Liste
        await top3.save();

        res.json({ message: 'Top 3 Liste erfolgreich aktualisiert', top3 });
    } catch (error) {
        console.error('Fehler beim Speichern der Top 3 Liste:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Route für das Laden der Top 3 Liste
app.get('/api/lade-top3', async (req, res) => {
    try {
        // Lade die Top 3 Liste, sortiert nach der höchsten Punktzahl
        const top3 = await Top3.find().sort({ punktzahl: -1 }).limit(3);
        res.json(top3);
    } catch (error) {
        console.error('Fehler beim Laden der Top 3 Liste:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Route zum Speichern oder Aktualisieren einer Punktzahl
app.post('/api/speichere-punktzahl', async (req, res) => {
    const { name, punktzahl } = req.body;

    try {
        if (!name || typeof punktzahl !== 'number') {
            return res.status(400).json({ error: 'Name und Punktzahl müssen angegeben werden und Punktzahl muss eine Zahl sein' });
        }

        // Finde die bestehende Punktzahl des Spielers
        const existingPunktzahl = await Punktzahl.findOne({ name });

        if (existingPunktzahl) {
            // Aktualisiere die Punktzahl, wenn der Spieler bereits existiert
            existingPunktzahl.punktzahl = punktzahl;
            await existingPunktzahl.save();
            res.json({ message: 'Punktzahl erfolgreich aktualisiert', punktzahl: existingPunktzahl });
        } else {
            // Erstelle eine neue Punktzahl, wenn der Spieler noch nicht existiert
            const neuePunktzahl = new Punktzahl({ name, punktzahl });
            await neuePunktzahl.save();
            res.json({ message: 'Punktzahl erfolgreich gespeichert', punktzahl: neuePunktzahl });
        }
    } catch (error) {
        console.error('Fehler beim Speichern der Punktzahl:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});


// Route zum Laden der aktuellen Punktzahl
app.get('/api/lade-aktuelle-punktzahl', async (req, res) => {
    try {
        const letztePunktzahl = await Punktzahl.findOne().sort({ _id: -1 }).limit(1);
        
        if (!letztePunktzahl) {
            return res.status(404).json({ message: 'Keine Punktzahl gefunden' });
        }

        res.json(letztePunktzahl);
    } catch (error) {
        console.error('Fehler beim Laden der Punktzahl:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Route für das Speichern einer Frage
app.post('/api/speichere-frage', async (req, res) => {
    const { frage, antworten, richtigeAntwort } = req.body;

    try {
        const neueFrage = new Frage({ frage, antworten, richtigeAntwort });
        await neueFrage.save();
        res.json({ message: 'Frage erfolgreich gespeichert', frage: neueFrage });
    } catch (error) {
        console.error('Fehler beim Speichern der Frage:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Route für das Laden aller Fragen
app.get('/lade-fragen', async (req, res) => {
    try {
        const fragen = await Frage.find();
        res.json(fragen);
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

