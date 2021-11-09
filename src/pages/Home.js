import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const Home = () => {
  const [movies, setMovies] = useState(null);
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    ServerService.fetchServerMovies().then((moviesData) => {
      console.log(typeof moviesData);
      if (typeof moviesData === String) {
        setMovies(moviesData);
        setDisplay(true);
      }
    });
  }, []);

  return (
    <div>
      <Navigation></Navigation>
      {display && (
        <div>
          <h1>Welcome</h1>
          {movies &&
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  );
};

export default Home;
