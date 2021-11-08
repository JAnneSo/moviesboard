import axios from "axios";

const SERVER_URL = "http://localhost:3000/movies";

const ServerService = {
  fetchServerMovies() {
    return axios
      .get(SERVER_URL)
      .then((response) => response.data)
      .catch(errorHandler);
  },
  fetchServerMovieById(id) {
    return axios
      .get(`${SERVER_URL}/${id}`)
      .then((response) => response.data)
      .catch(errorHandler);
  }
  //   add(movie) {
  //     return axios
  //       .post(SERVER_URL, {
  //         title: movie.title,
  //         release_date: movie.release_date,
  //         categories: movie.categories,
  //         description: movie.description,
  //         poster: movie.poster,
  //         backdrop: movie.backdrop,
  //         actors: movie.actors
  //       })
  //       .then((response) => response.data)
  //       .catch(errorHandler);
  //   }
};
const errorHandler = (err) => {
  console.log(err);
  return err;
};

export default ServerService;
