console.log("Hello- I'm here")

function getCookie (name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break;
      }
    }
  }
  return cookieValue
}
const csrftoken = getCookie('csrftoken')

// const url = 'http://localhost:3000/movies'
const searchForm = document.querySelector('#movie-form')
const posterPrefix = 'https://image.tmdb.org/t/p/w200'
const dbPrefix = 'https://api.themoviedb.org/3/search/movie?api_key=cdea2b0b411e1e124dcdfb6985b46497&query='

const movieDisplay = document.querySelector('#display')

// const movieDisplayA = document.querySelector('.display-a')
// const movieDisplayB = document.querySelector('.display-b')
// const toWatchTab = document.querySelector('#to-watch-tab')
// const watchedTab = document.querySelector('#watched-tab')

searchForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const searchTerm = document.getElementById('movie-search').value
  console.log(searchTerm)
  searchMovies(searchTerm)
})

movieDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('save')) {
    console.log('I clicked save')
    createMovie(event.target.parentElement)
    event.target.parentElement.parentElement.classList.add('hide-me')
  }
})

function searchMovies (searchTerm) {
  console.log('running searchMovies')
  movieDisplay.innerHTML = ''
  fetch(dbPrefix + encodeURI(searchTerm))
    .then(res => res.json())
    .then(data => {
      for (const movie of data.results) {
        if (movie.poster_path !== null) {
          showResults(movie, movieDisplay)
        }
      }
    })
}

function showResults (movie, display) {
  const movieMain = document.createElement('div')
  movieMain.classList.add('search-card')
  const movieTitle = document.createElement('div')
  const movieOverview = document.createElement('div')
// set this as a data attribute
  const moviePoster = document.createElement('div')

  movieTitle.classList.add('movie-title')
  // set this id to id from database -- post if selected
  movieTitle.id = movie.id
  movieOverview.classList.add('movie-overview')
  moviePoster.classList.add('movie-poster')

  let posterUrl = ''
  if (movie.poster_path === null) {
    posterUrl = '/pexels-skitterphoto-390089.jpg'
  } else {
    posterUrl = posterPrefix + movie.poster_path
  }
  
  display.appendChild(movieMain)
  movieMain.appendChild(moviePoster)
  movieMain.appendChild(movieTitle)
  movieMain.appendChild(movieOverview)
  movieTitle.innerHTML = `${movie.title}<i class='fas fa-share-square save'></i></i>`
  movieOverview.innerHTML = movie.overview
  moviePoster.innerHTML = `<img class='poster' id =${posterUrl} src=${posterUrl}></img>`
}

let addURL = '/movies/add/'

function createMovie (obj) {
  fetch(addURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      title: obj.innerText,
      summary: obj.nextSibling.innerText,
      poster_image: obj.previousElementSibling.firstElementChild.id,
      // movie_id: obj.id
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      window.location.replace('/')
      // getMovies()
      //getMovieDetail()
    })
}
