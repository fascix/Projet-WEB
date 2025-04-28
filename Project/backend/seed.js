const db = require('./db');
const { genres } = require('../js/genres.js');

db.serialize(async () => {
    const genreMap = new Map();

    // Étape 1 : Insérer les genres et récupérer leurs IDs
    for (const genreName of Object.keys(genres)) {
        // Insertion du genre
        await new Promise((resolve, reject) => {
            db.run(
                'INSERT OR IGNORE INTO genres (name) VALUES (?)',
                [genreName],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Récupération de l'ID du genre
        const row = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM genres WHERE name = ?',
                [genreName],
                (err, row) => err ? reject(err) : resolve(row)
            );
        });

        genreMap.set(genreName, row.id); // 👉 Stocke genre → ID
        console.log(`Genre "${genreName}" → ID: ${row.id}`); // Log
    }

    // Étape 2 : Insérer les artistes avec le bon genre_id
    for (const [genreName, artists] of Object.entries(genres)) {
        const genreId = genreMap.get(genreName);
        console.log(`Insertion des artistes pour "${genreName}" (ID: ${genreId})`);

        for (const artist of artists) {
            await new Promise((resolve, reject) => {
                db.run(
                    'INSERT OR IGNORE INTO artists (name, genre_id) VALUES (?, ?)',
                    [artist, genreId],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }
    }

    console.log('Base de données initialisée avec succès !');
    db.close();
});