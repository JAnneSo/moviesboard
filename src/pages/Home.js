import React, { useEffect, useRef, useState } from "react";
import MovieCard from "../components/MovieCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const Home = () => {
  // Variables
  const [movies, setMovies] = useState(null);
  const searchInputRef = useRef();
  const filterRef = useRef();

  /**
   * @function
   * @description
   * @param
   */
  const fetchAllMovies = () => {
    ServerService.fetchServerMovies().then((response) => {
      if (response !== "") {
        setMovies(response);
      }
    });
  };
  // Fetch movies saved in server once
  useEffect(() => {
    fetchAllMovies();
  }, []);

  const fetchByFilter = (filter, searchValue) => {
    if (searchValue !== "") {
      ServerService.fetchServerMovies(filter, searchValue).then((response) => {
        setMovies(response);
      });
    }
  };

  /**
   * @function changeFilter
   * @description update the filter parameter and fetch the corresponding data
   * @param {event} e
   */
  const changeFilter = (e) => {
    filterRef.current.value = e.target.value;
    if (filterRef.current.value === "tout") {
      fetchAllMovies();
    } else {
      if (searchInputRef.current.value !== "") {
        fetchByFilter(filterRef.current.value, searchInputRef.current.value);
      }
    }
  };

  const onKeyDown = (e) => {
    // Click to Enter => fetch data
    if (e.keyCode === 13) {
      if (e.target.value !== "") {
        fetchByFilter(filterRef.current.value, searchInputRef.current.value);
      }
    }
  };

  return (
    <div>
      <Navigation></Navigation>
      <h1>Welcome</h1>
      <input
        type="search"
        ref={searchInputRef}
        placeholder="Rechercher..."
        onKeyDown={onKeyDown}
      />
      <label>Filtrer par :</label>
      <select ref={filterRef} onChange={changeFilter} defaultValue="title_like">
        <option value="tout">Tout</option>
        <option value="title_like">Titre</option>
        <option value="release_date_like">Date de sortie</option>
        <option value="categories_like">Catégories</option>
      </select>

      {movies && (
        <div>
          {movies.length !== 0 &&
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} link />
            ))}
          {movies.length === 0 && (
            <h2>Aucun film trouvé dans la bibliothèque 🥺</h2>
          )}
          {movies === "" && (
            <h2>Une erreur s'est produite. Réessayez plus tard 😉</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
