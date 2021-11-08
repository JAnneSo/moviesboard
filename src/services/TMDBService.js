import axios from "axios";
//REACT_TMDB_API_KEY

const API_URL = "";

const TMDBService = {
  fetchServerMovies() {
    return axios
      .get(API_URL)
      .then((response) => response)
      .catch(errorHandler);
  }
};
const errorHandler = (err) => {
  console.log(err);
  return err;
};

export default TMDBService;
