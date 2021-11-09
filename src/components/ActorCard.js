import React from "react";
import { base_image_url } from "../services/TMDBService";

const ActorCard = ({ actor }) => {
  const image_path =
    actor.photo && actor.photo !== ""
      ? actor.photo
      : base_image_url + actor.profile_path;
  return (
    <div>
      <img src={image_path} alt="" />
      <p>{actor.character}</p>
      <p>{actor.name}</p>
    </div>
  );
};

export default ActorCard;
