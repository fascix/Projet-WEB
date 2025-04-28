// Éléments DOM
const elements = {
    album: document.getElementById("album"),
    nomArtiste: document.getElementById("nom_artiste"),
    titreMusique: document.getElementById("Titre_M"),
    buttons: document.querySelectorAll('.filter-button'),
    spotifyLink: document.getElementById("spotify-link")
};

// Vérification des éléments DOM
if (!elements.album || !elements.nomArtiste) {
    console.error("Éléments manquants dans le DOM");
    throw new Error("Elements manquants");
}

// Configuration
const config = {
    spotify: {
        clientId: "5b11546928184232b3491c7186e026a7",
        clientSecret: "f53f6b1914df428c8c4a62a4c8d0c493"
    },
    localAPI: "http://localhost:3001"
};

// État global
const state = {
    token: null,
    tokenExpiration: null,
    currentTrack: null
};

// Récupère le token Spotify
async function getSpotifyToken() {
    if (state.token && Date.now() < state.tokenExpiration) {
        return state.token;
    }

    try {
        const auth = btoa(`${config.spotify.clientId}:${config.spotify.clientSecret}`);
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ grant_type: "client_credentials" })
        });

        const data = await response.json();
        state.token = data.access_token;
        state.tokenExpiration = Date.now() + data.expires_in * 1000;
        return state.token;
    } catch (error) {
        console.error("Erreur Spotify Token:", error);
        throw error;
    }
}

// Charge et affiche un artiste
async function loadArtist(genre) {
    try {
        // Reset UI
        elements.album.style.display = 'none';
        elements.nomArtiste.textContent = "Chargement...";
        elements.titreMusique.textContent = "";

        const genreConversion = {
            'Hip-Hop': 'hiphop',
            'Électronique': 'electronic'
        };

        // 1. Récupérer un artiste depuis notre API
        const dbGenre = genreConversion[genre] || genre;

        const apiUrl = `${config.localAPI}/api/random-artist/${encodeURIComponent(dbGenre)}`;
        const apiResponse = await fetch(apiUrl);


        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `Erreur ${apiResponse.status}`);
        }
        const artist = await apiResponse.json();

        if (!artist?.name) {
            throw new Error("Données d'artiste invalides");
        }

        // 2. Récupérer les infos Spotify
        const token = await getSpotifyToken();
        const [artistData, topTracks] = await Promise.all([
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist.name)}&type=artist&limit=1`, {
                headers: { "Authorization": `Bearer ${token}` }
            }),
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist.name)}&type=track&limit=5`, {
                headers: { "Authorization": `Bearer ${token}` }
            })
        ]);

        const [artistJson, tracksJson] = await Promise.all([
            artistData.json(),
            topTracks.json()
        ]);

        const spotifyArtist = artistJson?.artists?.items[0];
        const tracks = tracksJson?.tracks?.items;

        if (!spotifyArtist || !tracks?.length) {
            throw new Error("Données Spotify non disponibles");
        }

        // Sélection de la première piste (ou une aléatoire si vous préférez)
        const selectedTrack = tracks[0];

        // 3. Mettre à jour l'UI
        elements.album.src = spotifyArtist.images[0]?.url || '';
        elements.album.style.display = 'block';
        elements.album.style.cursor = 'pointer';
        elements.nomArtiste.textContent = spotifyArtist.name;
        elements.titreMusique.textContent = tracks[0].name;
        state.currentTrack = tracks[0].id;


        // Lien profond Spotify (ouvre l'app si installée)
        const spotifyUri = `https://open.spotify.com/track/${selectedTrack.id}`;
        state.currentTrack = {
            id: selectedTrack.id,
            url: spotifyUri };

        // Gestion du clic
        elements.album.onclick = (e) => {
            e.preventDefault();
            window.open(spotifyUri, '_blank', 'noopener,noreferrer');
        };



    } catch (error) {
        console.error("Erreur détaillée:", {
            message: error.message,
            stack: error.stack
        });
        elements.nomArtiste.textContent = "Erreur de chargement";
        elements.titreMusique.textContent = error.message.includes("404")
            ? "Genre non trouvé dans la base"
            : error.message;
    }
}

// Initialisation
function init() {
    // Événements des boutons
    elements.buttons.forEach(button => {
        button.addEventListener('click', () => {
            loadArtist(button.textContent.trim());
        });
    });

    // Premier chargement
    loadArtist('rock');
}

// Démarrer l'application
if (document.readyState === 'complete') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}