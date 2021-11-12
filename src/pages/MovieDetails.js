import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActorCard from "../components/ActorCard";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import MovieCard from "../components/MovieCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    ServerService.fetchServerMovieById(id).then((response) => {
      console.log(response);
      setMovie(response);
    });
  }, [id]);

  let navigate = useNavigate();

  function onDelete() {
    //let modalResponse = confirm(`Confirme la suppression de:\n${title}`);
    if (window.confirm(`Confirme la suppression de:\n${movie.title}`)) {
      //delete the corresponding movie
      ServerService.delete(id).then((response) => {
        if (response !== "error") {
          toast.success(`Le film ${movie.title} a bien été supprimé!`);
        } else {
          toast.error("Oups, une erreur s'est produite.");
        }
        setTimeout(() => {
          navigate("/");
        }, 2000);
      });
    }
  }

  return (
    <div className="movie-details-body">
      <Navigation white></Navigation>
      {movie && (
        <div className="movie-detail-container">
          <div className="backdrop-ctnr">
            {movie.backdrop && <img src={movie.backdrop} alt="" />}
          </div>

          <main className="main-movie-details">
            <section className="movie-info-section">
              <div className="poster-ctnr">
                {movie.poster && <img src={movie.poster} alt="" />}
              </div>
              <div className="headline">
                <div className="headline__inner">
                  <div className="headline__inner--title">
                    <h1>{movie.title}</h1>
                    <div className="buttons-ctnr">
                      <EditButton id={id} />
                      <DeleteButton
                        id={id}
                        title={movie.title}
                        onDelete={onDelete}
                      />
                    </div>
                  </div>
                  <div className="date-categories-ctnr">
                    <p className="release-date">
                      {new Date(movie.release_date).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="categories">{movie.categories.join(", ")}</p>
                  </div>
                </div>
                <div className="synopsis">
                  <h2>Synopsis</h2>
                  <p>{movie.description}</p>
                </div>
              </div>
            </section>
            {movie.actors.length !== 0 && (
              <section>
                <h2>Têtes d’affiche</h2>
                {movie.actors.map((actor) => (
                  <ActorCard key={actor.name} actor={actor} />
                ))}
              </section>
            )}
            {movie.similar_movies.length !== 0 && (
              <section>
                <h2>Films similaires</h2>
                {movie.similar_movies.map((movie, id) => (
                  <MovieCard key={id} movie={movie} />
                ))}
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
