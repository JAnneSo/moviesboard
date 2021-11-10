import React, { useEffect, useState } from "react";
import TMDBService, { base_image_url } from "../services/TMDBService";
import ActorCard from "./ActorCard";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Form = () => {
  // FORM VARIABLES
  const [formStep, setFormStep] = useState(0);
  const [movieChoices, setMovieChoices] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actorsInSelectedMovie, setActorsInSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  // FORM CONFIG
  const validationSchema = yup.object().shape({
    title: yup.string().required("Le titre est requis"),
    release_date: yup
      .string()
      .required("La date de sortie est requise")
      .matches(
        /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        "La date de sortie doit être au format JJ-MM-AAAA"
      ),
    categories: yup.array().of(yup.string()).required(),
    backdrop: yup.string().url(),
    poster: yup.string().url(),
    description: yup.string().required("Le synopsis est requis"),
    actors: yup.array().of(
      yup.object({
        name: yup.string().required(),
        photo: yup.string().url(),
        character: yup.string().required()
      })
    ),
    similar_movies: yup.array().of(
      yup.object({
        title: yup.string().required(),
        poster: yup.string().url(),
        release_date: yup.string().required()
      })
    )
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categories: [],
      actors: [],
      similar_movies: []
    }
  };

  const {
    watch,
    register,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    reset,
    formState
  } = useForm(formOptions);
  const { errors } = formState;

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };
  const previousFormStep = () => {
    setFormStep((cur) => cur - 1);
  };

  console.log(formStep);

  // ----------------------------
  // FETCH MOVIES
  function onKeyDown(e) {
    console.log(register("title"));
    console.log(e.target.value);
    if (e.target.value.trim() !== "") {
      TMDBService.fetchMovies(e.target.value).then((response) => {
        response.splice(5);
        setMovieChoices(response);
      });
    }
  }
  function onClick(event) {
    setValue("title", event.target.innerHTML.split("<span")[0]);
    setMovieChoices(null);
    console.log(watch());
    // Au click sur next
    TMDBService.fetchMovieById(event.target.id).then((response) => {
      setSelectedMovie(response);
      console.log(response);
    });
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
      setValue("release_date", selectedMovie.release_date);
      setValue("backdrop", base_image_url + selectedMovie.backdrop_path);
      setValue("poster", base_image_url + selectedMovie.poster_path);
      setValue("description", selectedMovie.overview);
    }
  }, [selectedMovie]);

  async function checkFirstStep() {
    const bool = await trigger(["title", "release_date"]);
    console.log(bool);
    if (bool) {
      completeFormStep();
    }
  }

  const updateActorsArray = (e, id, actor) => {
    const value = e.target.checked
      ? {
          name: actor.name,
          photo: base_image_url + actor.profile_path,
          character: actor.character
        }
      : null;
    setValue(`actors[${id}]`, value);
  };

  const updateSimilarMoviesArray = (e, id, movie) => {
    const value = e.target.checked
      ? {
          title: movie.title,
          photo: base_image_url + movie.profile_path,
          release_date: movie.release_date
        }
      : null;
    setValue(`similar_movies[${id}]`, value);
  };

  function onSubmit(data) {
    // display form data on success
    console.log(JSON.stringify(data, null, 4));
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
    completeFormStep();
    return false;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {formStep >= 0 && (
          <section className={formStep === 0 ? "" : "hidden"}>
            <fieldset>
              <label htmlFor="title">Titre</label>
              <input
                name="title"
                placeholder="Rechercher un film"
                onInput={onKeyDown}
                {...register("title")}
              />
              {movieChoices && movieChoices.length !== 0 && (
                <ul>
                  {movieChoices.map((movie) => (
                    <li key={movie.id} id={movie.id} onClick={onClick}>
                      {`${movie.title}`}
                      <span>{` - ${movie.release_date}`}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="error">{errors.title?.message}</p>
            </fieldset>
            <fieldset>
              <label htmlFor="release-date">Date de sortie</label>
              <input
                name="release_date"
                type="date"
                {...register("release_date")}
              />
              <p className="error">{errors.release_date?.message}</p>
            </fieldset>
          </section>
        )}
        {formStep >= 0 && (
          <section className={formStep === 1 ? "" : "hidden"}>
            <fieldset>
              <label htmlFor="backdrop">Bannière (url)</label>
              <input
                type="url"
                name="backdrop"
                placeholder="http://..."
                {...register("backdrop")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="poster">Affiche</label>
              <input
                type="url"
                name="poster"
                placeholder="http://..."
                {...register("poster")}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                rows="4"
                id="description"
                placeholder="Description..."
                {...register("description")}
              />
              <p className="error">{errors.description?.message}</p>
            </fieldset>
            <fieldset>
              <h2>Catégories</h2>
              {selectedMovie &&
                selectedMovie.genres &&
                selectedMovie.genres.map((genre) => (
                  <label key={genre.id}>
                    <input
                      name="categories"
                      type="checkbox"
                      value={genre.name}
                      {...register("categories")}
                    />{" "}
                    {genre.name}
                  </label>
                ))}
            </fieldset>
            <fieldset>
              <h2>Acteurs</h2>
              {actorsInSelectedMovie &&
                actorsInSelectedMovie.map((actor, id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      name="actors"
                      onChange={(e) => updateActorsArray(e, id, actor)}
                    />
                    <div>
                      <img
                        src={
                          actor.profile_path
                            ? base_image_url + actor.profile_path
                            : "/film_strip.jpeg"
                        }
                        alt=""
                      />
                      <p>{actor.character}</p>
                      <p>{actor.name}</p>
                    </div>
                  </label>
                ))}
            </fieldset>
            <fieldset>
              <h2>Films similaires</h2>
              {similarMovies &&
                similarMovies.map((movie, id) => (
                  <label key={id}>
                    <input
                      type="checkbox"
                      name="similar_movies"
                      onChange={(e) => updateSimilarMoviesArray(e, id, movie)}
                    />
                    <div>
                      <img src={base_image_url + movie.poster_path} alt="" />
                      <p>{movie.title}</p>
                      <p>{movie.release_date}</p>
                    </div>
                  </label>
                ))}
            </fieldset>
          </section>
        )}
        {/* BUTTONS */}
        {formStep === 1 && (
          <div>
            <button type="button" onClick={previousFormStep}>
              Précédent
            </button>
            <button type="submit">Ajouter</button>
          </div>
        )}
        {formStep === 0 && (
          <div>
            <button type="button" onClick={checkFirstStep}>
              Suivant
            </button>
          </div>
        )}
        <pre className={formStep < 2 ? "" : "hidden"}>
          {JSON.stringify(watch(), null, 2)}
        </pre>
      </form>
      {formStep === 2 && (
        <div>
          <div>
            <h2>Le film a été ajouté ! 🎉</h2>
            <Link to="/">Retourner sur la page d'accueil</Link>
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              setFormStep(0);
            }}
          >
            Ajouter un film
          </button>
        </div>
      )}
      {/* BUTTON RESET "AJOUTER UN FILM" */}
    </div>
  );
};

export default Form;
