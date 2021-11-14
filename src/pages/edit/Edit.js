import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/form/Form";
import Navigation from "../../components/navigation/Navigation";
import ServerService from "../../services/ServerService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Edit = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  let navigate = useNavigate();
  console.log(id);

  useEffect(() => {
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
      <main className="main main-form">
        <h1>Modifier un film</h1>
        {!movie && movie !== "" && <p>Loading</p>}
        {movie === "" && <p>Ce film n'existe pas dans votre bibliothèque</p>}
        {movie && (
          <Form
            onValidation={modifyMovie}
            movie={movie}
            verb="Modifier"
            modify
          />
        )}
        <ToastContainer autoClose={2500} closeOnClick />
      </main>
    </div>
  );
};

export default Edit;
