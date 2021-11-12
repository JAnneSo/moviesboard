import React from "react";
import { base_image_url } from "../services/TMDBService";

const ActorCard = ({ actor }) => {
  return (
    <div className="card">
      {actor && (
        <div>
          {actor.photo && <img src={base_image_url + actor.photo} alt="" />}
          {actor.profile_path && (
            <img src={base_image_url + actor.profile_path} alt="" />
          )}
          {!actor.photo && !actor.profile_path && (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/be/Film_strip.jpg"
              alt=""
            />
          )}
          <p>Rôle : {actor.character}</p>
          <p>Nom : {actor.name}</p>
        </div>
      )}
    </div>
  );
};

export default ActorCard;
