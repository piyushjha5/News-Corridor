const API_KEY = "52c318f977614e809de564edb3859cac";
const url = "https://newsapi.org/v2/everything?q=";

// Load news for the default query "India" when the window loads
window.addEventListener("load", () => fetchNews("India"));

// Function to reload the page
function reload() {
    window.location.reload();
}

// Function to fetch news based on the query
async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log(data); // Log the data for debugging purposes
        bindData(data.articles);
    } catch (error) {
        console.error('Error fetching the news:', error);
        // Display a user-friendly error message or fallback content
        showError('Failed to fetch news. Please try again later.');
    }
}

// Function to bind news data to the DOM
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    // Clear existing news cards
    cardsContainer.innerHTML = "";

    // Iterate through each article and create a news card
    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without an image
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data in each news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open article URL in a new tab when the card is clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to show error messages
function showError(message) {
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Variable to store the current selected navigation item
let curSelectedNav = null;

// Function to handle navigation item click
function onNavItemClick(id) {
    fetchNews(id); // Fetch news based on the clicked category
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Handle search button click with debounce
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

let debounceTimeout;
searchButton.addEventListener("click", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = searchText.value.trim();
        if (query) {
            fetchNews(query); // Fetch news based on the search query
            curSelectedNav?.classList.remove("active");
            curSelectedNav = null;
        }
    }, 300); // Adjust the debounce delay as needed
});

