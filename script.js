const button = document.getElementById("themeToggle");
const icon = document.getElementById("themeIcon");
const body = document.body;

let isDarkMode = false;

button.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        body.classList.add("dark-mode");
        icon.src = "images/lune.png"; // Icône lune locale
    } else {
        body.classList.remove("dark-mode");
        icon.src = "images/soleil.png"; // Icône soleil locale
    }
});