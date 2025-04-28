const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./music.db');

// Création des tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS genres (
                                              id INTEGER PRIMARY KEY,
                                              name TEXT UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS artists (
                                               id INTEGER PRIMARY KEY,
                                               name TEXT,
                                               genre_id INTEGER,
                                               FOREIGN KEY(genre_id) REFERENCES genres(id)
            )
    `);
});

module.exports = db;