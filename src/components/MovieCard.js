import React from "react";
import { Link } from "react-router-dom";
import EditButton from "./EditButton";

const MovieCard = ({ movie, link }) => {
  return (
    <div>
      {link && (
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
      )}
      {!link && (
        <div>
          {movie.poster && <img src={movie.poster} alt="" />}
          <h2>{movie.title}</h2>
          <p>{movie.release_date}</p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
