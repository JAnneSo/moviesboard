import React, { useEffect, useRef, useState } from "react";
import TMDBService, { base_image_url } from "../services/TMDBService";
import ActorCard from "./ActorCard";
import { Link } from "react-router-dom";

const Form = () => {
  // form variables
  const [formStep, setFormStep] = useState(0);
  const [movieChoices, setMovieChoices] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actorsInSelectedMovie, setActorsInSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const movieTitleRef = useRef();
  const releaseDateRef = useRef();
  const backdropRef = useRef();
  const posterRef = useRef();
  const descriptionRef = useRef();

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };
  const previousFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

  console.log(formStep);

  function onInput() {
    if (
      movieTitleRef.current.value ||
      movieTitleRef.current.value.trim() !== ""
    ) {
      TMDBService.fetchMovies(movieTitleRef.current.value).then((response) => {
        response.splice(5);
        setMovieChoices(response);
      });
    }
  }
  //   function onChange(event) {
  //     console.log("change", event.target);
  //   }
  function onClick(event) {
    // console.log("click", event.target);
    movieTitleRef.current.value = event.target.innerHTML.split("<span")[0];
    setMovieChoices(null);
    // Au click sur next
    TMDBService.fetchMovieById(event.target.id).then((response) =>
      setSelectedMovie(response)
    );
    TMDBService.fetchActorsInMovie(event.target.id)
      .then((response) => response)
      .then((response) => {
        response.splice(15);
        setActorsInSelectedMovie(response);
      });
    TMDBService.fetchSimilarMovies(event.target.id)
      .then((response) => response)
      .then((response) => {
        response.splice(10);
        setSimilarMovies(response);
      });
  }
  useEffect(() => {
    if (selectedMovie) {
      releaseDateRef.current.value = selectedMovie.release_date
        ? selectedMovie.release_date
        : "";
      backdropRef.current.value = selectedMovie.backdrop_path
        ? base_image_url + selectedMovie.backdrop_path
        : "";
      posterRef.current.value = selectedMovie.poster_path
        ? base_image_url + selectedMovie.poster_path
        : "";
      descriptionRef.current.value = selectedMovie.overview
        ? selectedMovie.overview
        : "";
    }
  }, [selectedMovie]);

  return (
    <div>
      <form>
        {formStep === 0 && (
          <section>
            <fieldset>
              <label htmlFor="movie-title-choice">Titre</label>
              <input
                id="movie-title-choice"
                ref={movieTitleRef}
                placeholder="Rechercher un film"
                onInput={onInput}
                required
              />
              {movieChoices && movieChoices.length !== 0 && (
                <ul id="movie-title-list">
                  {movieChoices.map((movie) => (
                    <li key={movie.id} id={movie.id} onClick={onClick}>
                      {`${movie.title}`}
                      <span>{` - ${movie.release_date}`}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* {movieChoices && movieChoices.length !== 0 && (
              <datalist id="movie-title">
                {movieChoices.map((movie) => (
                  <option
                    key={movie.id}
                    value={movie.id}
                    label={`${movie.title}/${movie.release_date}`}
                  />
                ))}
              </datalist>
            )} */}
            </fieldset>
            <fieldset>
              <label htmlFor="release-date">Date de sortie</label>
              <input
                type="date"
                id="release-date"
                ref={releaseDateRef}
                required
              />
            </fieldset>
          </section>
        )}
        {formStep === 0 && (
          <section>
            <fieldset>
              <label htmlFor="backdrop">Bannière (url)</label>
              <input
                type="url"
                id="backdrop"
                ref={backdropRef}
                placeholder="http://..."
              />
            </fieldset>
            <fieldset>
              <label htmlFor="poster">Affiche</label>
              <input
                type="url"
                id="poster"
                ref={posterRef}
                placeholder="http://..."
              />
            </fieldset>
            <fieldset>
              <label htmlFor="description">Description</label>
              <textarea
                rows="4"
                id="description"
                ref={descriptionRef}
                placeholder="Description..."
                required
              />
            </fieldset>
            <fieldset>
              <label>Catégories</label>
              {selectedMovie &&
                selectedMovie.genres &&
                selectedMovie.genres.map((genre) => (
                  <span key={genre.id}>{genre.name}</span>
                ))}
            </fieldset>
            <fieldset>
              <label>Acteurs</label>
              {actorsInSelectedMovie &&
                actorsInSelectedMovie.map((actor) => (
                  <ActorCard key={actor.id} actor={actor} />
                ))}
            </fieldset>
            <fieldset>
              <label>Films similaires</label>
              {}
            </fieldset>
          </section>
        )}
        {formStep === 1 && (
          <div>
            <button type="button" onClick={previousFormStep}>
              Précédent
            </button>
            <button type="submit" onClick={completeFormStep}>
              Ajouter
            </button>
          </div>
        )}
        {formStep === 0 && (
          <div>
            <button type="bouton" onClick={completeFormStep}>
              Suivant
            </button>
          </div>
        )}
      </form>
      {formStep === 2 && (
        <div>
          <h2>Le film a été ajouté ! 🎉</h2>
          <Link to="/">Retourner sur la page d'accueil</Link>
        </div>
      )}
    </div>
  );
};

export default Form;
