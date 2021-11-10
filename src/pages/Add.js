import React from "react";
import Form from "../components/Form";
import Navigation from "../components/Navigation";
import ServerService from "../services/ServerService";

const Add = () => {
  function addMovie(data) {
    // Envoyer "data" vers le serveur POST /collaborateurs
    ServerService.add(data).then((response) => {
      //toast.success(message);
      // Redirection vers la page /list
      console.log(response);
    });
  }
  return (
    <div>
      <Navigation></Navigation>
      <Form onValidation={addMovie} />
    </div>
  );
};

export default Add;
