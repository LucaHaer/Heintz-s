// Fragen und Antworten für das Quiz
let fragenUndAntworten = [
    {
        frage: "Wer ist der Kapitän der deutschen Nationalmannschaft?",
        antworten: ["Manuel Neuer", "Toni Kroos", "Leroy Sané", "Marco Reus"],
        richtigeAntwort: "Manuel Neuer"
    },
    {
        frage: "Wie viele Spieler sind in einer Fußballmannschaft auf dem Feld?",
        antworten: ["11", "10", "9", "12"],
        richtigeAntwort: "11"
    },
    {
        frage: "Wer gewann die FIFA-Weltmeisterschaft 2018?",
        antworten: ["Frankreich", "Deutschland", "Brasilien", "Argentinien"],
        richtigeAntwort: "Frankreich"
    },
    {
        frage: "Welcher Spieler hält den Rekord für die meisten Tore in der FIFA-Weltmeisterschaft?",
        antworten: ["Miroslav Klose", "Pele", "Ronaldo", "Lionel Messi"],
        richtigeAntwort: "Miroslav Klose"
    },
    {
        frage: "Welches Land hat die meisten FIFA-Weltmeisterschaften gewonnen?",
        antworten: ["Brasilien", "Deutschland", "Italien", "Argentinien"],
        richtigeAntwort: "Brasilien"
    },
    {
        frage: "In welchem Jahr wurde die erste FIFA-Weltmeisterschaft ausgetragen?",
        antworten: ["1930", "1926", "1934", "1924"],
        richtigeAntwort: "1930"
    },
    {
        frage: "Welches Land gewann die erste FIFA-Weltmeisterschaft?",
        antworten: ["Uruguay", "Argentinien", "Brasilien", "Italien"],
        richtigeAntwort: "Uruguay"
    },
    {
        frage: "Wer ist der Rekordtorschütze der UEFA Champions League?",
        antworten: ["Cristiano Ronaldo", "Lionel Messi", "Raul", "Karim Benzema"],
        richtigeAntwort: "Cristiano Ronaldo"
    },
    {
        frage: "Wie viele europäische Länder nehmen an der UEFA Europameisterschaft teil?",
        antworten: ["24", "16", "20", "32"],
        richtigeAntwort: "24"
    },
    {
        frage: "Welcher Club gewann die UEFA Champions League am häufigsten?",
        antworten: ["Real Madrid", "FC Barcelona", "Bayern München", "AC Milan"],
        richtigeAntwort: "Real Madrid"
    },
    {
        frage: "Wer hat den FIFA Ballon d'Or 2020 gewonnen?",
        antworten: ["Lionel Messi", "Robert Lewandowski", "Cristiano Ronaldo", "Neymar"],
        richtigeAntwort: "Robert Lewandowski"
    },
    {
        frage: "Welches Team gewann die UEFA Europa League 2021?",
        antworten: ["Villarreal", "Manchester United", "Roma", "Arsenal"],
        richtigeAntwort: "Villarreal"
    },
    {
        frage: "Wer ist der Rekordspieler der deutschen Nationalmannschaft?",
        antworten: ["Lothar Matthäus", "Miroslav Klose", "Bastian Schweinsteiger", "Toni Kroos"],
        richtigeAntwort: "Lothar Matthäus"
    },
];

// Initialisierung der Liste der unbeantworteten Fragen und der beantworteten Fragen
let unbeantworteteFragen = [...fragenUndAntworten];
let beantworteteFragen = [];

// Initialisierung der Top-3-Liste
let top3 = [
    { name: "Max", punkte: 5 },
    { name: "Paul", punkte: 3 },
    { name: "Anna", punkte: 2 }
];

// Punktzahl am Start
let punktzahl = 0;
let aktuellerSpieler = "";
let aktuelleFrageIndex = null; // Vor dem Laden des Spielstands initialisieren

// Diese Funktion speichert den gesamten Spielstand in der MongoDB
async function speichereGesamtenSpielstand() {
    const spielstand = {
        punktzahl: punktzahl,
        aktuellerSpieler: aktuellerSpieler,
        unbeantworteteFragen: unbeantworteteFragen,
        beantworteteFragen: beantworteteFragen,
        top3: top3,
        aktuelleFrageIndex: aktuelleFrageIndex // Speichere die Indexnummer der aktuellen Frage
    };

    try {
        // Speichere unbeantwortete Fragen
        await fetch('/api/unbeantwortete-fragen', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(spielstand.unbeantworteteFragen),
        });
        console.log("Unbeantwortete Fragen erfolgreich in der Datenbank gespeichert.");

        // Speichere Punktzahl
        await fetch('/api/speichere-punktzahl', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: spielstand.aktuellerSpieler,
                punktzahl: spielstand.punktzahl
            }),
        });
        console.log("Punktzahl erfolgreich in der Datenbank gespeichert.");

        // Speichere Top 3
        await fetch('/api/speichere-top3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: spielstand.top3.map(eintrag => eintrag.name),
                punktzahl: spielstand.top3.map(eintrag => eintrag.punktzahl)
            }),
        });
        console.log("Top 3 erfolgreich in der Datenbank gespeichert.");

    } catch (error) {
        console.error("Fehler beim Speichern des Spielstands:", error);
    }
}
// Diese Funktion lädt den gesamten Spielstand aus der MongoDB
async function ladeGesamtenSpielstand() {
    try {
        const response = await fetch('/api/unbeantwortete-fragen');
        const gespeicherterSpielstand = await response.json();
        if (gespeicherterSpielstand.length > 0) {
            unbeantworteteFragen = gespeicherterSpielstand;
            console.log("Spielstand erfolgreich aus der Datenbank geladen.");
        } else {
            console.log("Kein gespeicherter Spielstand gefunden. Starte ein neues Spiel.");
        }
    } catch (error) {
        console.error("Fehler beim Laden des Spielstands:", error);
    }
}

// Funktion zum Zufälligen Auswählen einer unbeantworteten Frage und Einsetzen der Antworten
function neueFrage() {
    if (unbeantworteteFragen.length === 0) { //Abfragen ob noch unbeantwortete fragen da
        console.log("Alle Fragen wurden beantwortet.");
        return;
    }

    let frageObjekt;
    if (aktuelleFrageIndex !== null && aktuelleFrageIndex < unbeantworteteFragen.length) {
        frageObjekt = unbeantworteteFragen[aktuelleFrageIndex];
    } else {
        // Zufällige Frage aus der Liste mit unbeantworteten Fragen auswählen
        const zufälligeIndex = Math.floor(Math.random() * unbeantworteteFragen.length);
        aktuelleFrageIndex = zufälligeIndex;
        frageObjekt = unbeantworteteFragen[zufälligeIndex];
    }
    //restliche fragen in den unbeantworteten fragen bleiben unberührt

    const frage = frageObjekt.frage;
    const antworten = frageObjekt.antworten;
    const richtigeAntwort = frageObjekt.richtigeAntwort;

    // Die Frage einfügen
    document.getElementById("frage").innerText = frage;

    // Zufällige Reihenfolge der Antworten erstellen
    const shuffledAntworten = shuffle(antworten);

    // Die Antworten einfügen
    const antwortFelder = document.querySelectorAll('.antwort');
    antwortFelder.forEach((feld, index) => {
        feld.innerText = shuffledAntworten[index];
        // Markiere das Feld als die richtige Antwort
        if (shuffledAntworten[index] === richtigeAntwort) {
            feld.dataset.richtig = true;
        } else {
            feld.dataset.richtig = false;
        }
        // Setze die Hintergrundfarbe des Antwortfeldes auf Weiß zurück bei neuer Frage
        feld.classList.remove('right', 'wrong', 'selected');
    });

    // Aktiviere die Klick-Ereignisse für die Antwortfelder
    document.querySelectorAll('.antwort').forEach(feld => {
        feld.addEventListener('click', antwortAuswählen);
    });

    // Entferne die aktuelle Frage aus der Liste der unbeantworteten Fragen
    unbeantworteteFragen.splice(aktuelleFrageIndex, 1);
    speichereGesamtenSpielstand();  // Speichere den Spielstand nach der Frageanzeige
}
// Funktion zum Mischen der Antworten
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Funktion zum Auswählen einer Antwort
function antwortAuswählen(event) {
    // Das ausgewählte Antwortfeld markieren
    event.currentTarget.classList.add('selected');

    // Überprüfe, ob die Antwort richtig ist
    const istRichtig = event.currentTarget.dataset.richtig === "true";

    // Färbt Antwort grün wenn richtig
    event.currentTarget.classList.toggle('right', istRichtig);
    // Punktzahl erhöhen, wenn die Antwort richtig ist
    if (istRichtig) {
        const spielerName = document.getElementById("spielername").value.trim();
        aktuellerSpieler = spielerName;  // Speichere den aktuellen Spieler
        const spielerIndex = top3.findIndex(spieler => spieler.name === spielerName);
        let punktzahlErhoeht = false;

        // Punktzahl nur erhöhen, wenn der Spieler die richtige Antwort gegeben hat
        punktzahl++;
        document.getElementById("punktzahl").textContent = punktzahl;
        speichereGesamtenSpielstand();  // Speichere den Spielstand nach jeder richtigen Antwort

        if (spielerIndex !== -1) {
            // Spieler ist bereits in der Top-3-Liste, Punktzahl aktualisieren
            top3[spielerIndex].punkte = punktzahl;
            punktzahlErhoeht = true;
        } else if (punktzahl > top3[2].punkte) {
            // Spieler ist neu in der Top-3-Liste und hat mehr Punkte als der Drittplatzierte
            top3.push({ name: spielerName, punkte: punktzahl });
            top3.sort((a, b) => b.punkte - a.punkte);

            // Entferne den Spieler mit den wenigsten Punkten, falls die Liste mehr als 3 Spieler enthält
            if (top3.length > 3) {
                top3.pop();
            }

            punktzahlErhoeht = true;
        }

        // Aktualisiere Top3-Liste in HTML und speichere sie im Local Storage, falls Punktzahl erhöht wurde
        if (punktzahlErhoeht) {
            aktualisiereTop3Liste();
            speichereGesamtenSpielstand();
        }

        // Verzögerung bevor nächste Frage angezeigt wird 
        setTimeout(() => {
            // Entferne Hintergrundfarbe des Antwortsfeldes nach dem Anzeigen neuer Frage
            document.querySelectorAll('.antwort').forEach(feld => {
                feld.classList.remove('right', 'wrong', 'selected');
            });           
            neueFrage(); // Neue Frage anzeigen
        }, 1000);
    } else {
        // Benachrichtigung anzeigen, dass das Quiz beendet ist
        alert("Das Quiz ist beendet. Du hast eine Frage falsch beantwortet.");

        // Zurücksetzen des Quiz
        resetQuiz();
    }
}

// Funktion zum Aktualisieren der Top-3-Liste im HTML
function aktualisiereTop3Liste() {
    // Sortiere Top-3-Liste absteigend nach Punktzahl
    top3.sort((a, b) => b.punkte - a.punkte);

    // Aktualisiere Top-3-Liste im HTML nach jeder beantworteten Frage
    const top3ListItems = document.querySelectorAll("#top3-liste ol li");
    top3.forEach((spieler, index) => {
        top3ListItems[index].textContent = `Platz ${index + 1}: ${spieler.name} - ${spieler.punkte} Punkte`;
    });
}
document.getElementById("start-button").addEventListener("click", starteQuiz);

// Funktion zum Starten vom Quiz und Änderung vom Anzeigemodus nach Eingabe des Spielernamens
function starteQuiz() {
    const spielerName = document.getElementById("spielername").value.trim();
    if (spielerName !== "") {
        aktuellerSpieler = spielerName;  // Speichere den aktuellen Spieler
        document.getElementById("name-eingeben").style.display = "none";
        document.getElementById("quiz-feld").style.display = "block";
        neueFrage();
        speichereUnbeantworteteFragen();  // Speichere die unbeantworteten Fragen beim Start des Quiz
    } else {
        alert("Bitte geben Sie Ihren Namen ein, um das Quiz zu starten.");
    }
}

// Funktion zum Zurücksetzen des Quiz manuell durch den Benutzer
function resetQuizManuell() {
    // Hier fügst du den Code ein, um das Quiz manuell zurückzusetzen
    punktzahl = 0;
    aktuellerSpieler = "";
    unbeantworteteFragen = [...fragenUndAntworten];
    beantworteteFragen = [];
    document.getElementById("punktzahl").textContent = punktzahl;
    document.getElementById("spielername").value = "";
    document.getElementById("name-eingeben").style.display = "block";
    document.getElementById("quiz-feld").style.display = "none";
    aktualisiereTop3Liste();
    speichereGesamtenSpielstand();  // Speichere den Spielstand nach dem Zurücksetzen
}

// Funktion zum Zurücksetzen des Quiz
function resetQuiz() {
    punktzahl = 0;
    aktuellerSpieler = "";
    unbeantworteteFragen = [...fragenUndAntworten];
    beantworteteFragen = [];
    document.getElementById("punktzahl").textContent = punktzahl;
    document.getElementById("spielername").value = "";
    document.getElementById("name-eingeben").style.display = "block";
    document.getElementById("quiz-feld").style.display = "none";
    aktualisiereTop3Liste();
    speichereGesamtenSpielstand();  // Speichere den Spielstand nach dem Zurücksetzen
}

// Laden des gesamten Spielstands beim Start der Anwendung
window.addEventListener("load", () => {
    ladeGesamtenSpielstand();
});