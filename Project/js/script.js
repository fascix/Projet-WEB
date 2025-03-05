const button = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");
const body = document.body;
const settingsButton = document.getElementById("settingsButton");
const modal = document.getElementById("modal");
const closeModalButton = document.getElementById("closeModalButton");

let isDarkMode = false;

button.addEventListener("click", () => {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        body.classList.add("dark-mode");
        icon.src = "../images/lune.png"; // Icône lune locale
    } else {
        body.classList.remove("dark-mode");
        icon.src = "../images/soleil.png"; // Icône soleil locale
    }
});

settingsButton.addEventListener("click", () => {
    modal.classList.add("show");
});

closeModalButton.addEventListener("click", () => {
    modal.classList.remove("show");
});

// Fermer la fenêtre modale lorsque l'utilisateur clique en dehors
window.addEventListener("click", (event) => {
    if (!settingsButton.contains(event.target) && !modal.contains(event.target)) {
        modal.classList.remove("show");
    }
});

// Ajouter un événement de clic pour les boutons de filtre
const filterButtons = document.querySelectorAll(".filter-button");
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});
