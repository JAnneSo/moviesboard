import React, { useState } from "react";
import { Link } from "react-router-dom";
import DeleteButton from "../buttons/DeleteButton";
import EditButton from "../buttons/EditButton";
import ServerService from "../../services/ServerService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MovieCard = ({ movie, link }) => {
  const [checked, setChecked] = useState(false);

  function onDelete() {
    //let modalResponse = confirm(`Confirme la suppression de:\n${title}`);
    if (window.confirm(`Confirme la suppression de:\n${movie.title}`)) {
      //delete the corresponding movie
      ServerService.delete(movie.id).then((response) => {
        if (response !== "error") {
          toast.success(`Le film ${movie.title} a bien été supprimé!`);
        } else {
          toast.error("Oups, une erreur s'est produite.");
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  }

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
              <DeleteButton
                id={movie.id}
                title={movie.title}
                onDelete={onDelete}
              />
            </div>
          </div>
          {/* CONTENT */}
          <div className="movie-card__content">
            <Link
              to={{
                pathname: `/movie/${movie.id}`
              }}
            >
              {movie.poster !== "" && <img src={movie.poster} alt="" />}
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
          <div className="similar-movie-card__img-ctnr">
            {movie.poster && <img src={movie.poster} alt="" />}
          </div>
          <figcaption className="movie-card__text">
            <p className="movie-card__text--title">{movie.title}</p>
            <p className="movie-card__text--date">
              {movie.release_date.split("-")[0]}
            </p>
          </figcaption>
        </figure>
      )}
      <ToastContainer theme="dark" autoClose={2000} closeOnClick />
    </div>
  );
};

export default MovieCard;
