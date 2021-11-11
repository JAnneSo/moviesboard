import React from "react";
import ServerService from "../services/ServerService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

const DeleteButton = ({ id, title }) => {
  let navigate = useNavigate();
  let location = useLocation();
  function onClick() {
    //let modalResponse = confirm(`Confirme la suppression de:\n${title}`);
    if (window.confirm(`Confirme la suppression de:\n${title}`)) {
      //delete the corresponding movie
      ServerService.delete(id).then((response) => {
        if (response !== "error") {
          toast.success("Le film a bien été supprimé!");
        } else {
          toast.error("Oups, une erreur s'est produite.");
        }
        setTimeout(() => {
          if (location.pathname === "/") {
            window.location.reload();
          } else {
            navigate("/");
          }
        }, 2000);
      });
    }
  }

  return (
    <div className="round-button delete-button" onClick={onClick}>
      <ToastContainer theme="dark" autoClose={2000} closeOnClick />
    </div>
  );
};

export default DeleteButton;
