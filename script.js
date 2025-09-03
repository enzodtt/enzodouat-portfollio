// =======================
// Scroll vers le haut sur le logo
// =======================
const logo = document.querySelector('.logo');
if (logo) {
  logo.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =======================
// Initialisation des carousels
// =======================
function initCarousel(carouselElement) {
  const carouselContainer = carouselElement.querySelector(".carousel-container");
  const items = carouselElement.querySelectorAll(".carousel-item");
  const prev = carouselElement.querySelector(".prev");
  const next = carouselElement.querySelector(".next");

  let index = 0;

  function showSlide(i) {
    if (i >= items.length) index = 0;
    if (i < 0) index = items.length - 1;
    carouselContainer.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener("click", () => {
    index++;
    showSlide(index);
  });

  prev.addEventListener("click", () => {
    index--;
    showSlide(index);
  });

  // Afficher la première slide
  showSlide(index);
}

// Appliquer à tous les carousels de la page
document.querySelectorAll(".carousel").forEach(carousel => {
  initCarousel(carousel);
});

// =======================
// Récupération des articles dynamiques
// =======================
async function fetchArticles() {
  const container = document.getElementById("articles-container");
  if (!container) return;

  container.innerHTML = "<p>Chargement des articles...</p>";

  try {
    const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://siecledigital.fr/feed");
    const data = await response.json();

    container.innerHTML = "";

    data.items.slice(0, 6).forEach(article => {
      const card = document.createElement("div");
      card.classList.add("article-card");

      // ====== Gestion des images ======
      let image = "";

      if (article.enclosure?.link) {
        image = article.enclosure.link;
      } else {
        const imgMatch = article.description.match(/<img.*?src="(.*?)"/);
        if (imgMatch && imgMatch[1]) {
          image = imgMatch[1];
        }
      }

      if (!image) {
        image = "https://via.placeholder.com/400x200?text=Article";
      }

      // ====== Nettoyer description ======
      const cleanDescription = article.description.replace(/<[^>]*>?/gm, '').slice(0, 150);

      // ====== Génération HTML ======
      card.innerHTML = `
        <div class="article-meta">
          <span>📰 ${article.author || "Siècle Digital"}</span>
          <span>${new Date(article.pubDate).toLocaleDateString()}</span>
        </div>
        <img src="${image}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p>${cleanDescription}...</p>
        <a href="${article.link}" target="_blank" class="read-more">Lire l'article</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = "<p>Impossible de charger les articles 😢</p>";
    console.error("Erreur chargement articles:", error);
  }
}

// ===== Change header color on scroll =====
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  

// Lancer au chargement
fetchArticles();
