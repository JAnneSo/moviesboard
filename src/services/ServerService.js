import axios from "axios";

const SERVER_URL = "http://localhost:3000/movies";

const ServerService = {
  fetchServerMovies(filter, value) {
    const url =
      filter && value ? `${SERVER_URL}?${filter}=${value}` : SERVER_URL;
    return axios
      .get(url)
      .then((response) => response.data)
      .catch(errorHandler);
  },
  fetchServerMovieById(id) {
    return axios
      .get(`${SERVER_URL}/${id}`)
      .then((response) => response.data)
      .catch(errorHandler);
  },
  fetchByFilter(filter, value) {
    return axios
      .get(`${SERVER_URL}?${filter}=${value}`)
      .then((response) => response.data)
      .catch(errorHandler);
  },

  add(movie) {
    return axios
      .post(SERVER_URL, movie)
      .then((response) => response.data)
      .catch(errorHandler);
  },
  modify(id, movie) {
    return axios
      .put(`${SERVER_URL}/${id}`, movie)
      .then((response) => response.data)
      .catch(errorHandler);
  }
};
const errorHandler = (err) => {
  console.log(err, err.message);
  return "";
};

export default ServerService;
