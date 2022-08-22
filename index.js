const inputText = document.getElementById("search-input")
const formEl = document.getElementById("movie-search")
const moviesListEl = document.getElementById("movies-list")
const movieArray =  []
const watchlistArray = localStorage.getItem('watchList') ? JSON.parse(localStorage.getItem("watchList")) : []
const basicURL = "https://www.omdbapi.com/?apikey=6ac7378f"

formEl.addEventListener("submit", renderMoviesHtml)

async function getMovies() {
    const response = await fetch(`${basicURL}&s=${inputText.value}`)
    const data = await response.json()
    return data;
}

async function renderMoviesHtml(e) {
    e.preventDefault()
    let moviesData = await getMovies()
    let movieHTML = ''
    if(moviesData.Response === "True"){
        for(const movie of moviesData.Search){
            const res = await fetch(`${basicURL}&i=${movie.imdbID}`)
            const movieData = await res.json()
            const {Title, Runtime, Genre, Plot, Poster, imdbRating} = movieData
            movieHTML += 
                `
                 <div class='movie-container' id='${movie.imdbID}'>
                    <div class='poster-container'>
                        <img class="poster" src='${Poster}' alt='${Title} movie-poster'>
                    </div>
                    <div class="movie-info">
                        <h3 class="movie-title">${Title}<span>${imdbRating}</span></h3>
                        <div class="movie-details">
                            <p class="details">${Runtime}</p>
                            <p class="details">${Genre}</p>
                            <button class="details details-btn" id="movieSave" onclick="addToWatchlist(${movie.imdbID}, event)">Watchlist</button>
                        </div>
                        <p class="movie-plot">${Plot}</p>
                    </div>
                 </div>
                `
            moviesListEl.innerHTML = movieHTML
            movieArray.push(movieData)
        }
    }else {
        moviesListEl.innerHTML = `
            <div class='empty-container'>
                <p class="empty-text">Unable to find what you’re looking for. Please try another search.</p>
            </div>
        `
    }
    inputText.value = ''
}

function addToWatchlist(id,event){
    let btn = document.getElementById("movieSave")
    const movieId = id.getAttribute('id')
    if(!watchlistArray.includes(movieId)){
        btn = event.target
        btn.textContent = "Added"
        btn.style.color = "green"
        btn.style.setProperty("--icon", "url(./assets/accept-icon.png)")
        btn.disabled = true;
        watchlistArray.push(movieId)
        localStorage.setItem("watchList", JSON.stringify(watchlistArray))
    }else{
        watchlistArray.splice(movieId,1)
    }
}