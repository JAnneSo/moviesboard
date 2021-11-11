import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

const MovieCard = ({ movie, link }) => {
  const [checked, setChecked] = useState(false);
  return (
    <div className="card">
      {link && (
        <div className="movie-card">
          {/* BUTTONS */}
          <div className={`movie-card__button${checked ? " visible" : ""}`}>
            <label>
              <input type="checkbox" onClick={() => setChecked(!checked)} />
              <div className="round-button movie-card__button--description"></div>
            </label>
            <div>
              <EditButton id={movie.id} />
              <DeleteButton id={movie.id} title={movie.title} />
            </div>
          </div>
          {/* CONTENT */}
          <div className="movie-card__content">
            <Link
              to={{
                pathname: `/movie/${movie.id}`
              }}
            >
              <img src={movie.poster} alt="" />
              <div
                className={`movie-card__content--description${
                  checked ? " visible" : ""
                }`}
              >
                <p className="synopsis">Synopsis</p>
                <p>{movie.description}</p>
              </div>
            </Link>
          </div>

          {/* TITLE */}
          <div className="movie-card__text">
            <Link
              to={{
                pathname: `/movie/${movie.id}`
              }}
            >
              <p className="movie-card__text--title">{movie.title}</p>
            </Link>
            <p className="movie-card__text--date">
              {movie.release_date.split("-")[0]}
            </p>
          </div>
        </div>
      )}
      {!link && (
        <figure className="similar-movie-card">
          {movie.poster && <img src={movie.poster} alt="" />}
          <figcaption>
            <h2>{movie.title}</h2>
            <p>{movie.release_date.split("-")[0]}</p>
          </figcaption>
        </figure>
      )}
    </div>
  );
};

export default MovieCard;
