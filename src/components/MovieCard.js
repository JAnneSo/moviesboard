import React from "react";
import { Link } from "react-router-dom";
import EditButton from "./EditButton";

const MovieCard = ({ movie }) => {
  return (
    <div>
      <Link
        to={{
          pathname: `/movie/${movie.id}`
        }}
      >
        <img src={movie.poster} alt="" />
      </Link>
      <EditButton id={movie.id} />
      <Link
        to={{
          pathname: `/movie/${movie.id}`
        }}
      >
        <h2>{movie.title}</h2>
      </Link>
      <p>{movie.release_date}</p>
      <p>{movie.description}</p>
    </div>
  );
};

export default MovieCard;
