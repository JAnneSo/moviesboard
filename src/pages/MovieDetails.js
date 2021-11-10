import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ActorCard from "../components/ActorCard";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const MovieDetails = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    ServerService.fetchServerMovieById(id).then((response) =>
      setMovie(response)
    );
  }, [id]);
  return (
    <div>
      <Navigation></Navigation>
      {movie && (
        <div>
          <img src={movie.backdrop} alt="" />
          <img src={movie.poster} alt="" />
          <h1>{movie.title}</h1>
          <p>{movie.release_date}</p>
          <p>{movie.description}</p>
          {movie.categories.map((cat) => (
            <span key={cat}>{cat}</span>
          ))}
          {movie.actors.map((actor) => (
            <ActorCard key={actor.name} actor={actor} />
          ))}
          {/* {movie.similar_movies.map((movie) => (
            <MovieCard key={movie.name} movie={movie} />
          ))} */}
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
