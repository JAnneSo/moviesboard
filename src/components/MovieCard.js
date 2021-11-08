import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link
      to={{
        pathname: "/movie",
        search: `${movie.id}`
      }}
    >
      <h2>{movie.title}</h2>
      <p>{movie.release_date}</p>
      <p>{movie.description}</p>
      <img src={movie.poster} alt="" />
    </Link>
  );
};

export default MovieCard;
