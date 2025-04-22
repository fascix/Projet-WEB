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
        icon.src = "../images/lune_b.png"; // Icône lune locale
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


document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});


// Swiper : 

document.addEventListener('DOMContentLoaded', function () {
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 9,
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                1200: { // Extra large (1200px et plus)
                    slidesPerView: 9,
                    spaceBetween: 10,
                },
                992: { // Large (992px et plus)
                    slidesPerView: 7,
                    spaceBetween: 25,
                },
                768: { // Medium (768px et plus)
                    slidesPerView: 5,
                    spaceBetween: 15,
                },
                576: { // Small (576px et plus)
                    slidesPerView: 4,
                    spaceBetween: 10,
                },
                0: { // Extra small (moins de 576px)
                    slidesPerView: 3,
                    spaceBetween: 5,
                }
            }
            });
        });