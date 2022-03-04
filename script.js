const rootElem = document.getElementById("root");
const showDropdownEl = document.createElement("select");
const episodeDropdownEl = document.createElement("select");
const searchInput = document.createElement("input"); // Creates an input element
const searchStats = document.createElement("p"); // Counts the number of episodes displayed
const searchContainer = document.createElement("div");
const allShows = document.createElement("div"); // A container which displays the episodes
let totalEpisodes; // Variable for the total number of episodes

// Adds classes to the elements
episodeDropdownEl.classList.add("episode-dropdown");
searchContainer.classList.add("search-container");
searchInput.classList.add("search-input");
searchStats.classList.add("search-stats");
allShows.classList.add("all-episodes");

// Appends the elements
searchContainer.appendChild(showDropdownEl);
searchContainer.appendChild(episodeDropdownEl);
searchContainer.appendChild(searchInput);
searchContainer.appendChild(searchStats);
rootElem.appendChild(searchContainer);
rootElem.appendChild(allShows);

// This event listener goes to the show which is selected in the drop down
episodeDropdownEl.addEventListener("change", (event) => {
  document.location = `index.html#${event.target.value}`;
});

// This function when the page is loaded
function setup() {
  fetchedShows(getAllShows());
  // fetch("https://api.tvmaze.com/shows")
  //   .then((response) => response.json())
  //   .then((data) => fetchedShows(data))
  //   .catch((error) => console.log(error));
}

// This fetches the shows
function fetchedShows(data) {
  data.forEach((show) => {
    const optionEl = document.createElement("option");
    optionEl.value = show.id;
    optionEl.innerText = show.name;
    showDropdownEl.appendChild(optionEl);

    fetch(`https://api.tvmaze.com/shows/${1632}/episodes`)
      .then((response) => response.json())
      .then((data) => fetchedEpisodes(data))
      .catch((error) => console.log(error));
  });

  // This event listener fetches the episodes from the show which is selected in the dropdown
  showDropdownEl.addEventListener("change", (event) => {
    const showId = event.target.value;
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => fetchedEpisodes(data))
      .catch((error) => console.log(error));
  });
}

// This function fetches all the episodes and filters them if needed
function fetchedEpisodes(data) {
  let episodeList = data;
  totalEpisodes = data.length;

  // This event listener filters the shows
  searchInput.addEventListener("keyup", (event) => {
    const value = event.target.value.toLowerCase();
    episodeList = data.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(value) ||
        episode.summary.toLowerCase().includes(value)
      );
    });
    makePageForEpisodes(episodeList); // Renders episodes according to the search input
  });
  makePageForEpisodes(episodeList); // Renders all episodes
}

function makePageForEpisodes(episodeList) {
  searchStats.innerText = `Displaying ${episodeList.length} / ${totalEpisodes} episodes`; // Shows how many elements are rendered on the page
  allShows.innerHTML = ""; // Clears the old list of shows
  episodeDropdownEl.innerHTML = ""; // Clears the old show's select element

  // Loops through the episodeList and creates a card type container for each episode
  episodeList.forEach((episode) => {
    // The season and episode number with '0' appended to it
    const season = episode.season.toString().padStart(2, "0");
    const episodeNo = episode.number.toString().padStart(2, "0");

    const episodeId = episode.name
      .toLowerCase()
      .replaceAll(",", "")
      .replaceAll(" ", "-");

    const episodeOptionEl = document.createElement("option");
    episodeOptionEl.value = episodeId;
    episodeOptionEl.innerText = `S${season}E${episodeNo} - ${episode.name}`;
    episodeDropdownEl.appendChild(episodeOptionEl);

    // Container
    const episodeContainer = document.createElement("div");
    episodeContainer.classList.add("episode");
    episodeContainer.id = episodeId;
    allShows.appendChild(episodeContainer);

    const episodeTitleContainer = document.createElement("div");
    episodeTitleContainer.classList.add("episode-title-container");
    episodeContainer.appendChild(episodeTitleContainer);

    const episodeTitle = document.createElement("h3");
    episodeTitle.classList.add("episode-title");
    episodeTitle.innerText = `${episode.name} - S${season}E${episodeNo}`;
    episodeTitleContainer.appendChild(episodeTitle);

    const episodeThumbnailContainer = document.createElement("div");
    episodeThumbnailContainer.classList.add("episode-thumbnail-container");
    episodeContainer.appendChild(episodeThumbnailContainer);

    const episodeThumbnail = document.createElement("img");
    episodeThumbnail.classList.add("episode-thumbnail");
    episodeThumbnail.src = episode.image.medium; // Link to thumbnail image
    episodeThumbnailContainer.appendChild(episodeThumbnail);

    const episodeDescriptionContainer = document.createElement("div");
    episodeDescriptionContainer.classList.add("episode-description");
    episodeDescriptionContainer.innerHTML = episode.summary;
    episodeContainer.appendChild(episodeDescriptionContainer);
  });
}

window.onload = setup;
