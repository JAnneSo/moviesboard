import axios from "axios";

const API_URL = "https://api.themoviedb.org/3/";
export const base_image_url = "https://image.tmdb.org/t/p/original";

const TMDBService = {
  fetchMovies(search) {
    return axios
      .get(
        `${API_URL}search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${search}&sort_by=popularity.desc&language=fr-FR`
      )
      .then((response) => response.data.results)
      .catch(errorHandlerTab);
  },
  fetchMovieById(id) {
    return axios
      .get(
        `${API_URL}movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      )
      .then((response) => response.data)
      .catch(errorHandler);
  },
  fetchActorsInMovie(id) {
    return axios
      .get(
        `${API_URL}movie/${id}/casts?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      )
      .then((response) => response.data.cast)
      .catch(errorHandlerTab);
  },
  fetchSimilarMovies(id) {
    return axios
      .get(
        `${API_URL}movie/${id}/similar?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      )
      .then((response) => response.data.results)
      .catch(errorHandlerTab);
  }
};
const errorHandler = (err) => {
  console.log(err);
  return err;
};
const errorHandlerTab = (err) => {
  console.log(err);
  return [];
};

export default TMDBService;
