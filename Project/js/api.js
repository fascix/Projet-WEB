let spotifyToken = null;
let tokenExpiration = null;

const album = document.getElementById("album");
const nomArtiste = document.getElementById("nom_artiste");
const titreMusique = document.getElementById("Titre_M");

const EmpRock = document.querySelector('.swiper-slide-Rock');
const EmpHipHop = document.querySelector('.swiper-slide-Hip-Hop');
const EmpPop= document.querySelector('.swiper-slide-Pop');
const EmpElectro = document.querySelector('.swiper-slide-Electronique');
const EmpJazz = document.querySelector('.swiper-slide-Jazz');
const EmpKpop = document.querySelector('.swiper-slide-Kpop');
const EmpCountry = document.querySelector('.swiper-slide-Country');
const EmpSoul = document.querySelector('.swiper-slide-Soul');
const EmpBlues = document.querySelector('.swiper-slide-Blues');



//Création des tableaux qui nous serviront à représenter les genres de musiques
// car l'appel de genre de l'API Spotify est "Obsolète".

const genres = {
    rock: ["Linkin Park", "Queen", "Nirvana", "Sum 41", "AC/DC"],
    hiphop: ["Damso", "PNL", "PLK", "Travis Scott", "Kendrick Lamar"],
    pop: ["Bruno Mars", "Taio Cruz", "Katy Perry", "The Weeknd", "Magic System"],
    electronic: ["Daft Punk", "DJ Snake", "David Guetta", "Skrillex", "Calvin Harris"],
    jazz: ["Miles Davis", "John Coltrane", "Duke Ellington", "Ella Fitzgerald", "Louis Armstrong"],
    kpop: ["BTS", "BLACKPINK", "EXO", "TWICE", "Stray Kids"],
    country: ["Johnny Cash", "Dolly Parton", "Luke Bryan", "Carrie Underwood", "Blake Shelton"],
    soul: ["Aretha Franklin", "Marvin Gaye", "Otis Redding", "Etta James", "Al Green"],
    blues: ["B.B. King", "Muddy Waters", "Robert Johnson", "Howlin' Wolf", "John Lee Hooker"]
};



//Récuperer Token valable
async function getSpotifyToken() {
    const CLIENT_ID = "5b11546928184232b3491c7186e026a7";
    const CLIENT_SECRET = "f53f6b1914df428c8c4a62a4c8d0c493";

    // Vérifie si le token est encore valide
    if (spotifyToken && tokenExpiration && Date.now() < tokenExpiration) {
        console.log(" Token encore valide, pas besoin de le renouveler.");
        return spotifyToken;
    }

    console.log(" Récupération d’un nouveau token...");

    const url = "https://accounts.spotify.com/api/token";
    const headers = {
        "Authorization": "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const body = new URLSearchParams({ grant_type: "client_credentials" });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`Erreur API Spotify: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("Réponse invalide : Aucun token reçu");
        }

        // Stocker le token et son expiration (temps actuel + durée de vie)
        spotifyToken = data.access_token;
        tokenExpiration = Date.now() + data.expires_in * 1000; // expires_in est en secondes

        console.log(" Nouveau token récupéré avec succès !");
        return spotifyToken;

    } catch (error) {
        console.error(" Erreur lors de la récupération du token:", error.message);
        return null;
    }
}

//Fonction pour avoir un Artiste aléatoire parmit le genre choisis
function getRandomArtist(genre){
    const artists = genres[genre];
    if (!artists) return "Genre inconnu";
    const random = Math.floor(Math.random() * artists.length);
    return artists[random];
}

//Récuperer data de l'artiste par L'API
async function getInfoArtiste(artiste) {
    const token = await getSpotifyToken();
    if (!token) return;

    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(artiste)}&type=artist&limit=1`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401) {
            throw new Error("Token invalide ou expiré !");
        }

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Informations de l'Artiste:", data);
        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération de l'artiste:", error.message);
    }
}

//Récuperation musique aléatoire de l'artiste
async function getRandomMusic(artistId) {
    const token = await getSpotifyToken();
    if (!token) return null;

    const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=FR`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Erreur API pour les tracks: ${response.status}`);
        }

        const data = await response.json();

        if (!data.tracks || data.tracks.length === 0) {
            console.warn("Aucune musique trouvée pour cet artiste.");
            return null;
        }

        const randomIndex = Math.floor(Math.random() * data.tracks.length);
        return data.tracks[randomIndex];

    } catch (error) {
        console.error("Erreur lors de la récupération des musiques:", error.message);
        return null;
    }
}

//Fonction globale pour avoir toutes les infos de l'artiste et sa musique aléatoire
async function afficherArtisteParGenre(genre) {
    const artiste = getRandomArtist(genre);
    if (!artiste) {
        console.error("Aucun artiste trouvé pour le genre :", genre);
        return;
    }

    const artisteDataGlobal = await getInfoArtiste(artiste);
    if (!artisteDataGlobal || !artisteDataGlobal.artists || artisteDataGlobal.artists.items.length === 0) {
        console.error("Aucune donnée récupérée pour l'artiste :", artiste);
        return;
    }

    const artisteData = artisteDataGlobal.artists.items[0];

    // Afficher image + nom
    if (artisteData.images && artisteData.images.length > 0) {
        album.src = artisteData.images[0].url;
    }
    nomArtiste.textContent = artisteData.name;

    // Obtenir une musique aléatoire
    const track = await getRandomMusic(artisteData.id);
    if (track) {
        titreMusique.textContent = `${track.name}`;
    } else {
        titreMusique.textContent = "Pas de musique trouvée";
    }
}

// Événements au clic sur les boutons de genre
EmpRock.addEventListener('click', () => afficherArtisteParGenre('rock'));
EmpHipHop.addEventListener('click', () => afficherArtisteParGenre("hiphop"));
EmpPop.addEventListener('click', () => afficherArtisteParGenre("pop"));
EmpElectro.addEventListener('click', () => afficherArtisteParGenre("electronic"));
EmpJazz.addEventListener('click', () => afficherArtisteParGenre("jazz"));
EmpKpop.addEventListener('click', () => afficherArtisteParGenre("kpop"));
EmpCountry.addEventListener('click', () => afficherArtisteParGenre("country"));
EmpSoul.addEventListener('click', () => afficherArtisteParGenre("soul"));
EmpBlues.addEventListener('click', () => afficherArtisteParGenre("blues"));
