const movieSearchBox = document.getElementById('movie__search--box');
const searchList = document.getElementById('search__list');
const resultDisplay = document.getElementById('result__display');

// pull from API
async function main(searchPhrase) {
  const url = `https://www.omdbapi.com/?apikey=ba040381&s=${searchPhrase}`;
  const response = await fetch(`${url}`);
  const data = await response.json();
  // console.log(data.Search)
  if (data.Response == 'True') displayMovieList(data.Search);
}

function searchMovies() {
  let searchPhrase = (movieSearchBox.value).trim();
  if (searchPhrase.length > 0) {
    searchList.classList.remove('hide__search--list');
    main(searchPhrase);
  } else {
    searchList.classList.add('hide__search--list');
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = ``;
  for (let i = 0; i < movies.length; i++) {
    let movieListElem = document.createElement('div');
    movieListElem.dataset.id = movies[i].imdbID;
    movieListElem.classList.add('search__list--elem');
    if (movies[i].Poster != "N/A")
      moviePoster = movies[i].Poster;
    else
      moviePoster = 'image-not-available.png';

    movieListElem.innerHTML = `
    <div class="search__elem--thumbnail">
      <img src="${moviePoster}" alt="">
    </div>
    <div class="search__elem--info">
      <h3>${movies[i].Title}</h3>
      <p>${movies[i].Year}</p>
    </div>
    `;
    searchList.appendChild(movieListElem);
  }
  loadMovieSpecs();
}

function loadMovieSpecs() {
  const searchListMovies = searchList.querySelectorAll('.search__list--elem');
  searchListMovies.forEach(movie => {
    movie.addEventListener('click', async () => {
      // console.log(movie.dataset.id)
      searchList.classList.add('hide__search--list');
      movieSearchBox.value = '';

      const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=ba040381`);
      const movieSpecs = await result.json();
      // console.log(movieSpecs);
      renderMovieSpecs(movieSpecs);
    });
  });
}

function renderMovieSpecs(specs) {
  resultDisplay.innerHTML = `
  <div class="movie__poster">
    <img src="${(specs.Poster != "N/A") ? specs.Poster : 'image-not-available.png'}" alt="">
  </div>
  <div class="movie__info">
    <h3 class="movie__title">${specs.Title}</h3>
    <ul class="movie__info--more">
      <li class="year">Year: ${specs.Year}</li>
      <li class="rating">Rating: ${specs.Rated}</li>
      <li class="released">Released: ${specs.Released}</li>
    </ul>
    <p class="genre"><b>Genre:</b> ${specs.Genre}</p>
    <p class="writer"><b>Writer:</b> ${specs.Writer}</p>
    <p class="actors"><b>Actors:</b> ${specs.Actors}</p>
    <p class="plot"><b>Plot:</b> ${specs.Plot}</p>
    <p class="language"><b>Language:</b> ${specs.Language}</p>
    <p class="awards"><b><i class="fas fa-award"></i></b> ${specs.Awards}</p>
  </div>
  `;
}

window.addEventListener('click', (event) => {
  if(event.target.className != 'form__control') {
    searchList.classList.add('hide__search--list');
  }
});