const rootElem = document.getElementById("root");
const searchInput = document.createElement("input"); // Creates an input element
const searchStats = document.createElement("p"); // Counts the number of episodes displayed
const searchContainer = document.createElement("div");
const allShows = document.createElement("div"); // A container which displays the episodes
let totalEpisodes; // Variable for the total number of episodes

// Adds classes to the elements
searchContainer.classList.add("search-container");
searchStats.classList.add("search-stats");
allShows.classList.add("all-shows");

// Appends the elements
searchContainer.appendChild(searchInput);
searchContainer.appendChild(searchStats);
rootElem.appendChild(searchContainer);
rootElem.appendChild(allShows);

// This function runs on loading
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  totalEpisodes = allEpisodes.length;

  // Event listener for the input field
  searchInput.addEventListener("keyup", search);
}

// This function filters the shows and is used in the event listener above
function search(event) {
  const value = event.target.value.toLowerCase();
  const filteredEpisodes = getAllEpisodes().filter((episode) => {
    return (
      episode.name.toLowerCase().includes(value) ||
      episode.summary.toLowerCase().includes(value)
    );
  });
  makePageForEpisodes(filteredEpisodes);
}

function makePageForEpisodes(episodeList) {
  allShows.innerHTML = ""; // Clears the old list of shows
  searchStats.innerText = `Displaying ${episodeList.length} / ${totalEpisodes} episodes`; // Shows how many elements are rendered on the page

  // Loops through the episodeList and creates a card type container for each episode
  episodeList.forEach((show) => {
    // The season and episode number with '0' appended to it
    const season = show.season.toString().padStart(2, "0");
    const episode = show.number.toString().padStart(2, "0");

    // Container
    const showContainer = document.createElement("div");
    showContainer.classList.add("show");
    allShows.appendChild(showContainer);

    const showTitleContainer = document.createElement("div");
    showTitleContainer.classList.add("show-title-container");
    showContainer.appendChild(showTitleContainer);

    const showTitle = document.createElement("h3");
    showTitle.classList.add("show-title");
    showTitle.innerText = `${show.name} - S${season}E${episode}`;
    showTitleContainer.appendChild(showTitle);

    const showThumbnailContainer = document.createElement("div");
    showThumbnailContainer.classList.add("show-thumbnail-container");
    showContainer.appendChild(showThumbnailContainer);

    const showThumbnail = document.createElement("img");
    showThumbnail.classList.add("show-thumbnail");
    showThumbnail.src = show.image.medium; // Link to thumbnail image
    showThumbnailContainer.appendChild(showThumbnail);

    const showDescriptionContainer = document.createElement("div");
    showDescriptionContainer.classList.add("show-description");
    showDescriptionContainer.innerHTML = show.summary;
    showContainer.appendChild(showDescriptionContainer);
  });
}

window.onload = setup;
