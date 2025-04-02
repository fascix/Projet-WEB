let spotifyToken = null;
let tokenExpiration = null;

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
async function getAvailableGenres() {
    const token = await getSpotifyToken();
    if (!token) return;

    const url = "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 401) {
            throw new Error("❌ Token invalide ou expiré !");
        }

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Genres disponibles:", data);
        return data;

    } catch (error) {
        console.error("❌ Erreur lors de la récupération des genres:", error.message);
    }
}

// Exécuter la requête
getAvailableGenres();

