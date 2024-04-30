const playlist = document.getElementById("playlist");
const lecteur = document.querySelector(".lecteur");
const cover = document.getElementById("cover");
const disque = document.getElementById("disque");
const lyricsContainer = document.getElementById("lyrics");
const toggleLyricsButton = document.getElementById("toggle-lyrics");

// Configuration des chemins d'accès pour les couvertures et les musiques stockées
const config = {
    urlCover: "uploads/covers/",
    urlSound: "uploads/musics/"
};

// Fonction asynchrone pour récupérer et afficher les données des musiques
const getData = async () => {
    try {
        const response = await fetch("./assets/js/data.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const dbMusic = await response.json();
        populatePlaylist(dbMusic);
    } catch (error) {
        console.error('Error fetching music data:', error);
    }
};

function populatePlaylist(dbMusic) {
    dbMusic.forEach(music => {
        const musicItem = `<li id="${music.id}"><h2>${music.title}</h2><div><small>${music.date}</small></div></li>`;
        playlist.innerHTML += musicItem;
    });
    addMusicSelectionListeners(dbMusic);
}

function addMusicSelectionListeners(dbMusic) {
    document.querySelectorAll("#playlist li").forEach(li => {
        li.addEventListener("click", function() {
            const musicId = parseInt(this.id, 10);
            const music = dbMusic.find(m => m.id === musicId);
            updatePlayer(music);
        });
    });

    document.getElementById("aleatoire").addEventListener("click", () => {
        playMusicRandomly(dbMusic);
    });
}

function playMusicRandomly(dbMusic) {
    const randomMusic = dbMusic[Math.floor(Math.random() * dbMusic.length)];
    updatePlayer(randomMusic);
}

function updatePlayer(music) {
  lecteur.src = `${config.urlSound}${music.sound}`;
  cover.src = `${config.urlCover}${music.cover}`;
  if (music.lyricsFile) {
      fetchLyrics(`./${music.lyricsFile}`);
  } else {
      lyricsContainer.innerHTML = '<p>Aucune parole disponible.</p>';
  }
  disque.classList.remove("pause");
  lecteur.play();
}

async function fetchLyrics(filePath) {
  try {
      const response = await fetch(filePath);
      if (!response.ok) {
          throw new Error(`Failed to fetch lyrics: ${response.statusText}`);
      }
      const lyricsText = await response.text();
      lyricsContainer.innerHTML = `<p>${lyricsText}</p>`;
      toggleLyricsVisibility(false);
  } catch (error) {
      lyricsContainer.innerHTML = `<p>Erreur lors du chargement des paroles: ${error.message}</p>`;
  }
}


function toggleLyricsVisibility(isVisible) {
    lyricsContainer.style.display = isVisible ? 'block' : 'none';
    toggleLyricsButton.textContent = isVisible ? 'Masquer les paroles' : 'Afficher les paroles';
}

toggleLyricsButton.addEventListener('click', () => {
    const isLyricsVisible = lyricsContainer.style.display === 'block';
    toggleLyricsVisibility(!isLyricsVisible);
});

// Gestion de la pause et de la lecture pour l'animation du disque
lecteur.addEventListener("pause", () => disque.classList.add("pause"));
lecteur.addEventListener("play", () => disque.classList.remove("pause"));

getData(); // Chargement initial des données de la musique.


/*
// Fonction pour trier la liste de lecture en fonction de la méthode de tri sélectionnée
function sortPlaylist(sortBy) {
  const playlistItems = Array.from(document.querySelectorAll("#playlist li"));
  const sortedItems = playlistItems.sort((a, b) => {
    const aValue = a.querySelector(`.${sortBy}`).innerText;
    const bValue = b.querySelector(`.${sortBy}`).innerText;
    return aValue.localeCompare(bValue);
  });
  // Effacez la liste de lecture actuelle
  playlist.innerHTML = "";
  // Ajoutez les éléments triés à la liste de lecture
  sortedItems.forEach(item => playlist.appendChild(item));
}
*/

//console.log("start")
//setTimeout(() => {
//  console.log("en cours")
//}, 5000);
//console.log("end")

/*
setInterval(() => {
  console.log("coucou")
}, 1000);
*/