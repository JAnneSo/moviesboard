import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActorCard from "../components/ActorCard";
import DeleteButton from "../components/DeleteButton";
import EditButton from "../components/EditButton";
import MovieCard from "../components/MovieCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    ServerService.fetchServerMovieById(id).then((response) => {
      console.log(response);
      setMovie(response);
    });
  }, [id]);

  return (
    <div>
      <Navigation></Navigation>
      {movie && (
        <div>
          <EditButton id={id} />
          <DeleteButton id={id} title={movie.title} />
          <div>{movie.backdrop && <img src={movie.backdrop} alt="" />}</div>
          <div>{movie.poster && <img src={movie.poster} alt="" />}</div>
          <h1>{movie.title}</h1>
          <p>{movie.release_date}</p>
          <p>{movie.description}</p>
          {movie.categories.map((cat) => (
            <span key={cat}>{cat}</span>
          ))}
          {movie.actors.length !== 0 && (
            <section>
              <h2>Acteurs</h2>
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
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
