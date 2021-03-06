import React, { useEffect, useState } from "react";
import TMDBService, {
  base_image_url,
  base_backdrop_url
} from "../../services/TMDBService";
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
    similar_movies: yup.array().of(
      yup.object({
        title: yup.string(),
        poster: yup.string().url(),
        release_date: yup.string()
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
  //watch,
  const { register, setValue, trigger, handleSubmit, reset, formState } =
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
        response.splice(10);
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
          response.splice(10);
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

  useEffect(() => {
    document.getElementsByName("actors").forEach((checkbox) => {
      checkbox.click();
    });
    document.getElementsByName("similar_movies").forEach((checkbox) => {
      checkbox.click();
    });
  }, [formStep]);

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
    console.log("movie");
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

  // function isInLocal(movie) {
  //   ServerService.fetchMovies()
  // }

  function onSubmit(data) {
    console.log("submit", data);
    // CHECK EXISTENCE OF THE NEW FILM IN THE SERVER
    //todo --------------------------------
    // TREAT DATA
    data.actors = cleanTab(data.actors);
    data.similar_movies = cleanTab(data.similar_movies);
    // SEND DATA
    props.onValidation(data);
    setFormStep(0);
    reset();

    return false;
  }

  return (
    <div className="form">
      {!props.modify && (
        <h2>
          {formStep === 0 && "Étape 1"}
          {formStep === 1 && "Étape 2"}
        </h2>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {formStep === 0 && (
          <section className="section-step1">
            <div className="section-step1__input">
              {/* TITLE */}
              <fieldset className="title-field">
                <label htmlFor="title" className="input-label">
                  Titre
                </label>
                <input
                  type="text"
                  name="title"
                  className="search-input"
                  placeholder="Rechercher un film"
                  onInput={onKeyDown}
                  {...register("title")}
                />
                {movieChoices && movieChoices.length !== 0 && (
                  <ul className="title-suggestion-list">
                    {movieChoices.map((movie) => (
                      <li key={movie.id} id={movie.id} onClick={onClick}>
                        {`${movie.title}`}
                        {movie.release_date && (
                          <span>{` (${
                            movie.release_date.split("-")[0]
                          })`}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="error">{errors.title?.message}</p>
              </fieldset>
              {/* DATE */}
              <fieldset>
                <label htmlFor="release-date" className="input-label">
                  Date de sortie
                </label>
                <input
                  name="release_date"
                  type="date"
                  {...register("release_date")}
                />
                <p className="error">{errors.release_date?.message}</p>
              </fieldset>
            </div>
            {/* BUTTON NEXT */}
            {!props.modify && formStep === 0 && (
              <button
                type="button"
                className="next-button"
                onClick={checkFirstStep}
              >
                Suivant
              </button>
            )}
          </section>
        )}
        {(props.modify || formStep === 1) && (
          <section>
            {/* CATEGORIES */}
            <fieldset className="categories-field">
              <p className="input-label">Catégories</p>
              <div className="categories-field__grid">
                {selectedMovie &&
                  selectedMovie.genres &&
                  selectedMovie.genres.map((genre) => (
                    <label key={genre.id}>
                      <input
                        name="categories"
                        type="checkbox"
                        className="custom-check"
                        value={genre.name}
                        defaultChecked={checked}
                        onChange={() => setChecked(!checked)}
                        {...register("categories")}
                      />
                      <div>
                        <span>{genre.name}</span>
                      </div>
                    </label>
                  ))}
              </div>
            </fieldset>
            <div className="image-field">
              {/* BACKDROP */}
              <fieldset>
                <label htmlFor="backdrop" className="input-label">
                  Bannière
                </label>
                <input
                  type="url"
                  name="backdrop"
                  placeholder="http://..."
                  {...register("backdrop")}
                />
              </fieldset>
              {/* POSTER */}
              <fieldset>
                <label htmlFor="poster" className="input-label">
                  Poster
                </label>
                <input
                  type="url"
                  name="poster"
                  placeholder="http://..."
                  {...register("poster")}
                />
              </fieldset>
            </div>

            {/* OVERVIEW */}
            <fieldset className="overview-field">
              <label htmlFor="description" className="input-label">
                Synopsis
              </label>
              <textarea
                name="description"
                rows="4"
                id="description"
                placeholder="Description..."
                {...register("description")}
              />
              <p className="error">{errors.description?.message}</p>
            </fieldset>

            {/* ACTORS */}
            <fieldset>
              <p className="input-label">Têtes d'affiche</p>
              <div className="form__grid">
                {actorsInSelectedMovie &&
                  actorsInSelectedMovie.map((actor, id) => (
                    <label key={id} className="checkbox-card-ctnr">
                      <input
                        type="checkbox"
                        name="actors"
                        className="custom-check"
                        onChange={(e) => {
                          updateActorsArray(e, id, actor);
                        }}
                      />
                      <div className="checkbox-card">
                        <div className="checkbox-card__img-ctnr">
                          <img
                            src={
                              actor.profile_path
                                ? base_image_url + actor.profile_path
                                : "https://upload.wikimedia.org/wikipedia/commons/b/be/Film_strip.jpg"
                            }
                            alt=""
                          />
                          <div className="checkbox-card__overlay"></div>
                        </div>
                        <div className="checkbox-card__text">
                          <p className="checkbox-card__text--title">
                            {actor.name}
                          </p>
                          <p className="checkbox-card__text--character">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </fieldset>
            {/* SIMILAR MOVIES */}
            <fieldset>
              <p>Films similaires</p>
              <div className="form__grid">
                {similarMovies &&
                  similarMovies.map((movie, id) => (
                    <label key={id} className="checkbox-card-ctnr">
                      <input
                        type="checkbox"
                        name="similar_movies"
                        className="custom-check"
                        onChange={(e) => updateSimilarMoviesArray(e, id, movie)}
                      />
                      <div className="checkbox-card">
                        <div className="checkbox-card__img-ctnr">
                          <div className="checkbox-card__overlay"></div>
                          <img
                            src={base_image_url + movie.poster_path}
                            alt=""
                          />
                        </div>

                        <div className="checkbox-card__text">
                          <p className="checkbox-card__text--title">
                            {movie.title}
                          </p>
                          <p className="checkbox-card__text--character">
                            {movie.release_date}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            </fieldset>
          </section>
        )}
        {/* BUTTONS */}
        <div>
          {formStep === 1 && !props.modify && (
            <button
              type="button"
              className="previous-button"
              onClick={previousFormStep}
            >
              Précédent
            </button>
          )}
          {(props.modify || formStep === 1) && (
            <button type="submit" className="submit-button">
              {props.verb}
            </button>
          )}
        </div>

        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
      </form>
    </div>
  );
};

export default Form;
