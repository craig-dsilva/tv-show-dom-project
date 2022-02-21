//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  // rootElem.textContent = `Got ${episodeList.length} episode(s)`;

  episodeList.forEach((show) => {
    let season = show.season.toString();
    let episode = show.number.toString();

    const showContainer = document.createElement("div");
    showContainer.classList.add("show");
    rootElem.appendChild(showContainer);

    const showTitleContainer = document.createElement("div");
    showTitleContainer.classList.add("show-title-container");
    showContainer.appendChild(showTitleContainer);

    const showTitle = document.createElement("p");
    showTitle.classList.add("show-title");
    showTitle.innerText = `${show.name} - S${season.padStart(
      2,
      "0"
    )}E${episode.padStart(2, "0")}`;
    showTitleContainer.appendChild(showTitle);

    const showThumbnail = document.createElement("img");
    showThumbnail.classList.add("show-thumbnail");
    showThumbnail.src = show.image.medium;
    showContainer.appendChild(showThumbnail);

    const showDescriptionContainer = document.createElement("div");
    showDescriptionContainer.classList.add("show-description");
    showDescriptionContainer.innerHTML = show.summary;
    showContainer.appendChild(showDescriptionContainer);
  });
}

window.onload = setup;
