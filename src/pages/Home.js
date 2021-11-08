import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const Home = () => {
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    ServerService.fetchServerMovies().then((moviesData) => {
      setMovies(moviesData);
      console.log(moviesData);
    });
  }, []);

  return (
    <div>
      <Navigation></Navigation>
      <h1>Welcome</h1>
      {movies &&
        movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
};

export default Home;
