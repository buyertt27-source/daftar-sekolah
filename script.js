// ===============================
// REVEAL ANIMATION
// ===============================

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");

        }

    });

}, {
    threshold: 0.2
});

reveals.forEach((element) => {
    observer.observe(element);
});


// ===============================
// HERO ANIMATION
// ===============================

window.addEventListener("load", () => {

    const hero = document.querySelector(".hero-content");

    hero.style.opacity = "1";
    hero.style.transform = "translateY(0)";

});


// ===============================
// CARD HOVER EFFECT
// ===============================

const cards = document.querySelectorAll(".student-card");

cards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-12px) scale(1.05)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});


// ===============================
// CLICK EFFECT
// ===============================

cards.forEach((card) => {

    card.addEventListener("click", () => {

        card.animate([
            {
                transform: "scale(1)"
            },
            {
                transform: "scale(1.1)"
            },
            {
                transform: "scale(1)"
            }
        ], {
            duration: 300,
            easing: "ease-out"
        });

    });

});


// ===============================
// RANDOM DELAY ANIMATION
// ===============================

reveals.forEach((item, index) => {

    item.style.transitionDelay = `${index * 0.08}s`;

});
