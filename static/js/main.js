function getCookie (name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break;
      }
    }
  }
  return cookieValue
}
const csrftoken = getCookie('csrftoken')
const searchForm = document.querySelector('#movie-form')
const posterPrefix = 'https://image.tmdb.org/t/p/w200'
const dbPrefix = 'https://api.themoviedb.org/3/search/movie?api_key=cdea2b0b411e1e124dcdfb6985b46497&query='

const movieDisplay = document.querySelector('#display')

function searchMovies (searchTerm) {
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
  const moviePoster = document.createElement('div')

  movieTitle.classList.add('movie-title')
  movieTitle.id = movie.id
  movieOverview.classList.add('movie-overview')
  movieOverview.classList.add('hide-me')
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

const addURL = '/movies/add/'

function createMovie (obj, trailerLink) {
  const youTubeLink = `https://www.youtube.com/embed/${trailerLink}`
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
      trailer_link: youTubeLink
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      window.location.replace('/')
    })
}

function getTrailerKey (movie) {
  const movieId = movie.id
  const urlVideo = `https://api.themoviedb.org/3/movie/${movieId}?api_key=cdea2b0b411e1e124dcdfb6985b46497&append_to_response=videos`
  fetch(urlVideo)
    .then(res => res.json())
    .then(data => {
      return data
    })
    .then(data => {
      const trailerLink = data.videos.results[0].key
      createMovie(movie, trailerLink)
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                   Event Listeners                                                  */
/* ------------------------------------------------------------------------------------------------------------------ */

if (searchForm != null) {
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault()
    const searchTerm = document.getElementById('movie-search').value
    console.log(searchTerm)
    searchMovies(searchTerm)
  })
}

if (movieDisplay != null) {
  movieDisplay.addEventListener('click', function (event) {
    if (event.target.classList.contains('save')) {
      console.log('I clicked save')
      getTrailerKey(event.target.parentElement)
      event.target.parentElement.parentElement.classList.add('hide-me')
    }
  })
}

const nominate = document.querySelectorAll('.nominate')
const unNominate = document.querySelectorAll('.un-nominate')
const toDelete = document.querySelectorAll('.delete')
const nominateFromOther = document.querySelectorAll('.nominate-from-other')

if (nominate != null) {
  for (candidate of nominate) {
    candidate.addEventListener('click', function (event) {
      const moviePk = event.target.dataset.moviePk
      const nomURL = `/movies/${moviePk}/nominate`
      console.log(moviePk)
      console.log(nomURL)
      const nominees = document.querySelector('.nominees')
      const numNominees = nominees.dataset.numNominees
      if (numNominees < 5) {
        fetch(nomURL, {
          headers: {
            Accept: 'application/json/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            window.location.replace('/')
          })
      } else {
        window.location.replace('/movies/warning/')
      }
    })
  }
}

if (unNominate != null) {
  for (unCandidate of unNominate) {
    unCandidate.addEventListener('click', function (event) {
      const moviePk = event.target.dataset.moviePk
      const nomURL = `/movies/${moviePk}/un_nominate`
      console.log(moviePk)
      console.log(nomURL)

      fetch(nomURL, {
        headers: {
          Accept: 'application/json/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          window.location.replace('/')
        })
    })
  }
}

if (toDelete != null) {
  for (deleteCandidate of toDelete) {
    deleteCandidate.addEventListener('click', function (event) {
      const moviePk = event.target.dataset.moviePk
      const nomURL = `/movies/${moviePk}/delete`

      fetch(nomURL, {
        headers: {
          Accept: 'application/json/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          window.location.replace('/')
        })
    })
  }
}

if (nominateFromOther != null) {
  for (other of nominateFromOther) {
    other.addEventListener('click', function (event) {
      const moviePk = event.target.dataset.moviePk
      const nomURL = `/movies/${moviePk}/nominate_from_other`
      const nominees = document.querySelector('.nominees')
      const numNominees = nominees.dataset.numNominees
      if (numNominees < 5) {
        fetch(nomURL, {
          headers: {
            Accept: 'application/json/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        })
          .then(response => {
            return response.json()
          })
          .then(data => {
            window.location.replace('/movies/all_nominees/')
          })
      } else {
        window.location.replace('/movies/warning/')
      }
    })
  }
}
