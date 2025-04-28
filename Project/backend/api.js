// backend/api.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// Configuration minimale CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Connexion à la base de données
const db = new sqlite3.Database('./music.db');


app.get('/api/random-artist/:genre', (req, res) => {
    const genreName = req.params.genre;

    // Requête SQL optimisée
    const query = `
        SELECT artists.name 
        FROM artists
        JOIN genres ON artists.genre_id = genres.id
        WHERE genres.name LIKE ? 
        ORDER BY RANDOM()
        LIMIT 1
    `;

    db.get(query, [genreName], (err, row) => {
        if (err) {
            console.error("Erreur DB:", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        if (!row) {
            // Debug supplémentaire
            console.log(`Aucun artiste trouvé pour le genre: ${genreName}`);
            return res.status(404).json({
                error: "Aucun artiste trouvé",
                genreDemande: genreName
            });
        }

        res.json({
            name: row.name,
            genre: genreName
        });
    });
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`API prête sur http://localhost:${port}`);
});