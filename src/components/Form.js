import React, { useEffect, useState } from "react";
import TMDBService, {
  base_image_url,
  base_backdrop_url
} from "../services/TMDBService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Form = (props) => {
  // FORM VARIABLES
  const [formStep, setFormStep] = useState(0);
  const [movieChoices, setMovieChoices] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [id, setId] = useState(null);
  const [actorsInSelectedMovie, setActorsInSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [checked, setChecked] = useState(true);
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
    categories: yup
      .array()
      .of(yup.string())
      .required("Sélectionner au moins une catégorie"),
    backdrop: yup.string().url(),
    poster: yup.string().url(),
    description: yup.string().required("Le synopsis est requis"),
    actors: yup.array().of(
      yup.object({
        name: yup.string(),
        photo: yup.string().url(),
        character: yup.string()
      })
    ),
    similar_movies: yup
      .array()
      .of(
        yup.object({
          title: yup.string(),
          poster: yup.string().url(),
          release_date: yup.string()
        })
      )
      .required()
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: {
      categories: [],
      actors: [],
      similar_movies: []
    }
  };

  const { watch, register, setValue, trigger, handleSubmit, reset, formState } =
    useForm(formOptions);
  const { errors } = formState;

  const completeFormStep = () => {
    setFormStep((cur) => cur + 1);
  };
  const previousFormStep = () => {
    setFormStep((cur) => cur - 1);
  };
  // FETCH MOVIE IF EDIT
  //-----------------------
  useEffect(() => {
    if (props.movie) {
      let year = props.movie.release_date
        ? props.movie.release_date.split("-")[0]
        : undefined;
      TMDBService.fetchMovies(props.movie.title, false, year)
        .then((response) => response)
        .then((response) => {
          setSelectedMovie(response[0]);
          setId(response[0].id);
        });
    }
  }, [props.movie, setValue]);

  // ----------------------------
  // FETCH MOVIES FOR DROPDOWN LIST
  function onKeyDown(e) {
    if (e.target.value.trim() !== "") {
      TMDBService.fetchMovies(e.target.value, true).then((response) => {
        response.splice(5);
        setMovieChoices(response);
      });
    }
  }
  function onClick(event) {
    setMovieChoices(null);
    setId(event.target.id);
  }
  // FETCH ALL THE NECESSARY INFORMATION ABOUT THE SELECTED MOVIE
  useEffect(() => {
    if (id) {
      console.log(id);
      TMDBService.fetchMovieById(id).then((response) => {
        setSelectedMovie(response);
      });
      TMDBService.fetchActorsInMovie(id)
        .then((response) => response)
        .then((response) => {
          response.splice(15);
          setActorsInSelectedMovie(response);
        });
      TMDBService.fetchSimilarMovies(id)
        .then((response) => response)
        .then((response) => {
          response.splice(10);
          setSimilarMovies(response);
        });
    }
  }, [id]);
  useEffect(() => {
    if (selectedMovie) {
      setValue("title", selectedMovie.title);
      setValue("release_date", selectedMovie.release_date);
      setValue(
        "backdrop",
        selectedMovie.backdrop_path
          ? base_backdrop_url + selectedMovie.backdrop_path
          : ""
      );
      setValue(
        "poster",
        selectedMovie.poster_path
          ? base_image_url + selectedMovie.poster_path
          : ""
      );
      setValue("description", selectedMovie.overview);
    }
  }, [selectedMovie, setValue]);

  // useEffect(() => {
  //   if (similarMovies) {
  //     setValue("similar_movies", similarMovies);
  //   }
  //   if (actorsInSelectedMovie) {
  //     setValue("actors", actorsInSelectedMovie);
  //   }
  // }, [actorsInSelectedMovie, similarMovies, setValue]);

  async function checkFirstStep() {
    const bool = await trigger(["title", "release_date"]);
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
          poster: movie.poster_path ? base_image_url + movie.backdrop_path : "",
          release_date: movie.release_date
        }
      : null;
    setValue(`similar_movies[${id}]`, value);
  };
  const cleanTab = (tab) => {
    return tab.filter((el) => el !== null || el !== undefined);
  };

  function onSubmit(data) {
    // TREAT DATA
    // console.log("submit");
    data.actors = cleanTab(data.actors);
    data.similar_movies = cleanTab(data.similar_movies);
    props.onValidation(data);
    reset();
    setFormStep(0);
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
                type="text"
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
                      <span>{` (${movie.release_date.split("-")[0]})`}</span>
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
        {(props.modify || formStep === 1) && (
          <section>
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
                      defaultChecked={checked}
                      onChange={() => setChecked(!checked)}
                      {...register("categories")}
                    />
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
                      onChange={(e) => {
                        updateActorsArray(e, id, actor);
                      }}
                    />
                    <div>
                      <img
                        src={
                          actor.profile_path
                            ? base_image_url + actor.profile_path
                            : "https://upload.wikimedia.org/wikipedia/commons/b/be/Film_strip.jpg"
                        }
                        alt=""
                      />
                      <p>{actor.name}</p>
                      <p>Rôle: {actor.character}</p>
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
            {!props.modify && (
              <button type="button" onClick={previousFormStep}>
                Précédent
              </button>
            )}
            <button type="submit">{props.verb}</button>
          </div>
        )}
        {formStep === 0 && (
          <div>
            <button type="button" onClick={checkFirstStep}>
              Suivant
            </button>
          </div>
        )}
        <pre>{JSON.stringify(watch(), null, 2)}</pre>
      </form>
    </div>
  );
};

export default Form;
