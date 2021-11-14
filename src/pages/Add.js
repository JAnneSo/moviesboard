import React from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/form/Form";
import Navigation from "../components/navigation/Navigation";
import ServerService from "../services/ServerService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  let navigate = useNavigate();

  function addMovie(data) {
    ServerService.add(data).then((response) => {
      if (response !== "error") {
        toast.success("Le film a bien été ajouté!");
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
        <h1>Ajouter un film</h1>
        <Form onValidation={addMovie} verb="Ajouter à la bibliothèque" />
        <ToastContainer autoClose={2500} closeOnClick />
      </main>
    </div>
  );
};

export default Add;
