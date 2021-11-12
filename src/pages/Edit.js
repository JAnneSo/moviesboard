import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../components/Form";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  let navigate = useNavigate();
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
      if (response !== "error") {
        toast.success("Le film a bien été modifié!");
      } else {
        toast.error("Oups, une erreur s'est produite.");
      }
      setTimeout(() => {
        navigate("/");
      }, 2000);
    });
  }

  return (
    <div>
      <Navigation></Navigation>
      {!movie && <p>Loading</p>}
      {movie && (
        <Form onValidation={modifyMovie} movie={movie} verb="Modifier" modify />
      )}
      <ToastContainer theme="dark" autoClose={2000} closeOnClick />
    </div>
  );
};

export default Edit;
