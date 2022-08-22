const watchlistEl = document.getElementById("watchlist")
const URL = "https://www.omdbapi.com/?apikey=6ac7378f"

function removeFromWatchlist(movie) {
    let id = movie.getAttribute('id')
    const watchlist = JSON.parse(localStorage.getItem("watchList"))
    const movieId = watchlist.indexOf(id)
    watchlist.splice(movieId,1)
    localStorage.setItem('watchList', JSON.stringify(watchlist))
    renderWatchlist() 
}

async function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchList"))
    let watchlistHTML =''
    if(watchlist && watchlist.length > 0){
        for(let movie of watchlist){
            const res = await fetch(`${URL}&i=${movie}`)
            const data = await res.json()
            const {Title, Runtime, Genre, Plot, Poster, imdbRating} = data
            watchlistHTML += 
                `
                 <div class='movie-container' id='${movie}'>
                    <div class='poster-container'>
                        <img class="poster" src='${Poster}' alt='${Title} movie-poster'>
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${Title}<span>${imdbRating}</span></h3>
                        <div class="movie-details">
                            <p class="details">${Runtime}</p>
                            <p class="details">${Genre}</p>
                            <button class="details remove-btn" id="movieSave" onclick="removeFromWatchlist(${movie})">Remove</button>
                        </div>
                        <p class="movie-plot">${Plot}</p>
                    </div>
                 </div>
                `
           watchlistEl.innerHTML = watchlistHTML     
        }
    } else {
        watchlistEl.innerHTML = 
        `
        <div class='empty-container'>
                <p class="empty-text">Your watchlist looks empty...</p>
                <a class="movies" href="index.html">Find some movies</a> 
            </div>
        `
    }
}

renderWatchlist()