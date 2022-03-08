const header = document.querySelector("#header");
const main = document.querySelector("#main");
const homeButton = document.createElement("h1");
const showDropdownEl = document.createElement("select");
const episodeDropdownEl = document.createElement("select");
const showSearchInput = document.createElement("input");
const episodeSearchInput = document.createElement("input");
const searchStats = document.createElement("p");
let totalEpisodes; // Variable for the total number of episodes

homeButton.innerText = "TV Show Dom Project"; // Text for the home button

// Adds classes to the elements
episodeDropdownEl.classList.add("episode-dropdown");
header.classList.add("header");
showSearchInput.classList.add("show-search");
episodeSearchInput.classList.add("episode-search");
searchStats.classList.add("search-stats");
main.classList.add("main");

// Appends the elements
header.appendChild(homeButton);
header.appendChild(showDropdownEl);
header.appendChild(episodeDropdownEl);
header.appendChild(episodeSearchInput);
header.appendChild(showSearchInput);
header.appendChild(searchStats);

// When the home button is clicked this event listener is executed
homeButton.addEventListener("click", () => {
  main.innerHTML = "";
  // Shows all the elements related to the shows
  showDropdownEl.style.display = "inline";
  main.classList.remove("all-episodes");
  episodeDropdownEl.style.display = "";
  searchStats.style.display = "";
  episodeSearchInput.style.display = "";
  showSearchInput.style.display = "inline";

  fetchedShows(getAllShows());
});

// This event listener goes to the show which is selected in the drop down
showDropdownEl.addEventListener("change", (event) => {
  document.location = `index.html#${event.target.value}`;
});

// This event listener goes to the episode which is selected in the drop down
episodeDropdownEl.addEventListener("change", (event) => {
  document.location = `index.html#${event.target.value}`;
});

// This function runs when the page is loaded
function setup() {
  let allShows = getAllShows();

  showSearchInput.addEventListener("keyup", (event) => {
    const value = event.target.value.toLowerCase();
    allShows = getAllShows().filter((show) => {
      return (
        show.name.toLowerCase().includes(value) ||
        show.summary.toLowerCase().includes(value) ||
        show.genres.forEach((genre) => genre.toLowerCase().includes(value))
      );
    });
    fetchedShows(allShows);
  });
  fetchedShows(allShows);
}

// This fetches the shows
function fetchedShows(data) {
  main.innerHTML = "";
  let sortedData = data.sort((a, b) => a.name.localeCompare(b.name)); // Sorts the shows alphabetically

  // Loops through each show element and creates a container with information for it
  sortedData.forEach((show) => {
    const showId = show.name
      .toLowerCase()
      .replaceAll(",", "")
      .replaceAll(" ", "-");

    // Creates a dropdown for the shows in the header
    const showOptionEl = document.createElement("option");
    showOptionEl.value = showId;
    showOptionEl.innerText = show.name;
    showDropdownEl.appendChild(showOptionEl);

    const showDiv = document.createElement("div");
    const showTitle = document.createElement("h3");
    const showThumbnail = document.createElement("img");
    const showSummary = document.createElement("div");

    const showStats = document.createElement("div");
    const showRating = document.createElement("p");
    const showGenres = document.createElement("p");
    const showStatus = document.createElement("p");
    const showRuntime = document.createElement("p");

    showTitle.classList.add("show-title");
    showDiv.classList.add("show");
    showThumbnail.classList.add("show-thumbnail");
    showSummary.classList.add("show-summary");
    showStats.classList.add("show-stats");

    showDiv.id = showId;

    showTitle.innerText = show.name;
    showThumbnail.src = show.image ? show.image.medium : ""; // handles if the link is broken or missing
    showSummary.innerHTML = show.summary;

    showRating.innerText = `Rated: ${show.rating.average}`;
    showGenres.innerText = `Genres: ${show.genres}`;
    showStatus.innerText = `Status: ${show.status}`;
    showRuntime.innerText = `Runtime: ${show.runtime} minutes`;

    showDiv.appendChild(showTitle);
    showDiv.appendChild(showThumbnail);
    showDiv.appendChild(showSummary);
    showDiv.appendChild(showStats);

    showStats.appendChild(showRating);
    showStats.appendChild(showGenres);
    showStats.appendChild(showStatus);
    showStats.appendChild(showRuntime);

    main.appendChild(showDiv);

    let clickElements = [showTitle, showThumbnail]; // An array which contains the elements which listen to clicks

    // Loops through the above array
    clickElements.forEach((element) => {
      // This shows all the episode for the selected show
      element.addEventListener("click", () => {
        // Hides the elements related to displaying all the shows
        showDropdownEl.style.display = "none";
        episodeDropdownEl.style.display = "inline";
        episodeSearchInput.style.display = "inline";
        showSearchInput.style.display = "none";
        searchStats.style.display = "block";

        fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`)
          .then((response) => response.json())
          .then((data) => fetchedEpisodes(data))
          .catch((error) => console.log(error));

        window.scrollTo(0, 0);
      });
    });
  });
}

// This function fetches all the episodes and filters them if needed
function fetchedEpisodes(data) {
  let episodeList = data;
  totalEpisodes = data.length;

  // This event listener filters the shows
  episodeSearchInput.addEventListener("keyup", (event) => {
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
  main.innerHTML = ""; // Clears the old list of shows
  episodeDropdownEl.innerHTML = ""; // Clears the old show's select element
  main.classList.add("all-episodes");

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
    main.appendChild(episodeContainer);

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
