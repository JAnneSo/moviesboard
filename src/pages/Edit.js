import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Form from "../components/Form";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const Edit = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    console.log("useEffect");
    ServerService.fetchServerMovieById(id).then((response) => {
      console.log(response);
      setMovie(response);
    });
  }, [id]);

  function modifyMovie(data) {
    ServerService.modify(id, data).then((response) => {
      console.log(response);
    });
  }

  return (
    <div>
      <Navigation></Navigation>
      {!movie && <p>Loading</p>}
      {movie && <Form onValidation={modifyMovie} movie={movie} />}
    </div>
  );
};

export default Edit;
