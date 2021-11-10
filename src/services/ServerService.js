import axios from "axios";

const SERVER_URL = "http://localhost:3000/movies";

const ServerService = {
  fetchServerMovies(filter, value) {
    const url =
      filter && value
        ? `${SERVER_URL}?${filter}=${value}`
        : `${SERVER_URL}?_sort=id&_order=desc`;
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
      .catch((err) => {
        return "error";
      });
  },
  modify(movieId, movie) {
    return axios
      .put(`${SERVER_URL}/${movieId}`, movie)
      .then((response) => response.data)
      .catch((err) => {
        return "error";
      });
  },
  delete(movieId) {
    return axios
      .delete(`${SERVER_URL}/${movieId}`)
      .then((response) => response.data)
      .catch((err) => {
        return "error";
      });
  }
};
const errorHandler = (err) => {
  //console.log(err);
  return "";
};

export default ServerService;
