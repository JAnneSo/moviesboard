import React from "react";
import { base_image_url } from "../../services/TMDBService";

const ActorCard = ({ actor }) => {
  return (
    <div className="card">
      {actor && (
        <div className="actor-card">
          <div className="actor-card__img-ctnr">
            {actor.photo && <img src={base_image_url + actor.photo} alt="" />}
            {actor.profile_path && (
              <img src={base_image_url + actor.profile_path} alt="" />
            )}
          </div>
          <div className="actor-card__info">
            <p className="actor-card__info--name">{actor.name}</p>
            <p className="actor-card__info--character">{actor.character}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorCard;
