require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const app = express();

const CLIENT_ID="5b11546928184232b3491c7186e026a7";
const CLIENT_SECRET="f53f6b1914df428c8c4a62a4c8d0c493";
const REDIRECT_URI= "http://localhost:3000/callback";



app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email"; // Permissions demandées
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(authUrl);
});


app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: "Code manquant" });
    }

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        const data = await response.json();
        if (data.error) {
            return res.status(400).json(data);
        }

        res.json({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
        });
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).json({ error: "Erreur interne" });
    }
});

app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));
