let spotifyToken = null;
let tokenExpiration = null;

const album = document.getElementById("album");
const nomArtiste = document.getElementById("nom_artiste");
const titreMusique = document.getElementById("Titre_M");


const genres = {
    Tous: ["Linkin Park", "Queen", "Nirvana", "Sum 41", "AC/DC", 
             "Damso", "PNL", "PLK", "Travis Scott", "Kendrick Lamar", 
             "Bruno Mars", "Taio Cruz", "Katy Perry", "The Weeknd", "Magic System", 
             "Daft Punk", "DJ Snake", "David Guetta", "Skrillex", "Calvin Harris", 
             "Miles Davis", "John Coltrane", "Duke Ellington", "Ella Fitzgerald", "Louis Armstrong", 
             "BTS", "BLACKPINK", "EXO", "TWICE", "Stray Kids", 
             "Johnny Cash", "Dolly Parton", "Luke Bryan", "Carrie Underwood", "Blake Shelton", 
             "Aretha Franklin", "Marvin Gaye", "Otis Redding", "Etta James", "Al Green", 
             "B.B. King", "Muddy Waters", "Robert Johnson", "Howlin' Wolf", "John Lee Hooker"],
    rock: ["Linkin Park", "Queen", "Nirvana", "Sum 41", "AC/DC"],
    hiphop: ["Damso", "PNL", "PLK", "Travis Scott", "Kendrick Lamar"],
    pop: ["Bruno Mars", "Taio Cruz", "Katy Perry", "The Weeknd", "Magic System"],
    electronic: ["Daft Punk", "DJ Snake", "David Guetta", "Skrillex", "Calvin Harris"],
    jazz: ["Miles Davis", "John Coltrane", "Duke Ellington", "Ella Fitzgerald", "Louis Armstrong"],
    kpop: ["BTS", "BLACKPINK", "EXO", "TWICE", "Stray Kids"],
    country: ["Johnny Cash", "Dolly Parton", "Luke Bryan", "Carrie Underwood", "Blake Shelton"],
    soul: ["Aretha Franklin", "Marvin Gaye", "Otis Redding", "Etta James", "Al Green"],
    blues: ["B.B. King", "Muddy Waters", "Robert Johnson", "Howlin' Wolf", "John Lee Hooker"],
    classique: ["Mozart", "Beethoven", "Chopin", "Bach", "Vivaldi"], 
    world: ["Angélique Kidjo", "Youssou N'Dour", "Fela Kuti", "Caifanes", "Manu Dibango"],
    alternative: ["Radiohead", "The Strokes", "Arcade Fire", "The White Stripes", "Nirvana"]
};




// Récupérer Token valable
async function getSpotifyToken() {
    const CLIENT_ID = "5b11546928184232b3491c7186e026a7";
    const CLIENT_SECRET = "f53f6b1914df428c8c4a62a4c8d0c493";

    if (spotifyToken && tokenExpiration && Date.now() < tokenExpiration) {
        console.log("Token encore valide, pas besoin de le renouveler.");
        return spotifyToken;
    }

    console.log("Récupération d’un nouveau token...");
    const url = "https://accounts.spotify.com/api/token";
    const headers = {
        "Authorization": "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded"
    };
    const body = new URLSearchParams({ grant_type: "client_credentials" });

    try {
        const response = await fetch(url, { method: "POST", headers, body });
        const data = await response.json();
        if (!data.access_token) throw new Error("Réponse invalide : Aucun token reçu");
        spotifyToken = data.access_token;
        tokenExpiration = Date.now() + data.expires_in * 1000; // expires_in est en secondes
        return spotifyToken;
    } catch (error) {
        console.error("Erreur lors de la récupération du token:", error.message);
        return null;
    }
}

// Fonction pour obtenir un artiste aléatoire par genre
function getRandomArtist(genre) {
    const artists = genres[genre];
    if (!artists) return "Genre inconnu";
    const random = Math.floor(Math.random() * artists.length);
    return artists[random];
}

// Récupérer les infos de l'artiste via l'API Spotify
async function getInfoArtiste(artiste) {
    const token = await getSpotifyToken();
    if (!token) return;

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artiste)}&type=artist&limit=1`;

    try {
        const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'artiste:", error.message);
        nomArtiste.textContent="Oopsi une erreur est arrivée";
        titreMusique.textContent="Erreur lors de récupération de l'artiste";
    }
}

// Récupérer une musique aléatoire de l'artiste
async function getRandomMusic(artistId) {
    const token = await getSpotifyToken();
    if (!token) return null;

    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`;

    try {
        const response = await fetch(url, { method: "GET", headers: { "Authorization": `Bearer ${token}` } });
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.tracks.length);
        return data.tracks[randomIndex];
    } catch (error) {
        console.error("Erreur lors de la récupération des musiques:", error.message);
        nomArtiste.textContent="Oopsi une erreur est arrivée";
        titreMusique.textContent="Erreur lors de récupération de la musique";
        return null;
    }
}


// Choisir un genre aléatoire au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const genreKeys = Object.keys(genres);
    const randomIndex = Math.floor(Math.random() * genreKeys.length);
    const randomGenre = genreKeys[randomIndex];
    afficherArtisteParGenre(randomGenre);
});

// Événements au clic sur les boutons de genre
document.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.addEventListener('click', () => {
        const genre = slide.getAttribute('data-genre');
        afficherArtisteParGenre(genre);
    });
});

// Fonction pour rediriger vers la page Spotify du morceau
function redirectToSpotify(trackId) {
    if (trackId) {
        const url = `https://open.spotify.com/track/${trackId}`;
        window.open(url, '_blank'); // ouvre dans un nouvel onglet
    }
}

let currentTrackId = null; // Pour stocker l'ID du morceau courant

// Mettre à jour la fonction afficherArtisteParGenre pour récupérer l'ID du morceau
async function afficherArtisteParGenre(genre) {
    const artiste = getRandomArtist(genre);
    if (!artiste) {
        console.error("Aucun artiste trouvé pour le genre :", genre);
        titreMusique.textContent="Oopsi une erreur est arrivée";
        nomArtiste.textContent="Aucun artiste trouvé pour ce genre";
        return;
    }

    const artisteDataGlobal = await getInfoArtiste(artiste);
    if (!artisteDataGlobal || !artisteDataGlobal.artists || artisteDataGlobal.artists.items.length === 0) {
        console.error("Aucune donnée récupérée pour l'artiste :", artiste);
        titreMusique.textContent="Oopsi une erreur est arrivée";
        nomArtiste.textContent="Aucune donnée récupérée pour cette artiste";
        return;
    }

    const artisteData = artisteDataGlobal.artists.items[0];
    if (artisteData.images && artisteData.images.length > 0) {
        album.src = artisteData.images[0].url;
    }
    nomArtiste.textContent = artisteData.name;

    const track = await getRandomMusic(artisteData.id);
    if (track) {
        titreMusique.textContent = `${track.name}`;
        currentTrackId = track.id; // Stocke l'ID pour redirection
    } else {
        titreMusique.textContent = "Pas de musique trouvée";
        currentTrackId = null;
    }
}

// Ajouter un événement au clic sur la carte pour rediriger vers Spotify
[album, nomArtiste, titreMusique].forEach(el => {
    el.addEventListener('click', () => {
        redirectToSpotify(currentTrackId);
    });
});