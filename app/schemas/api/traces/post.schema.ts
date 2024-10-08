import { stravaHashRegex, stravaIdRegex } from "@/schemas/regex.schema";
import Joi from "joi";

export default Joi.object({
  strava_id: Joi.string().pattern(stravaIdRegex).required(),
  strava_hash: Joi.string().pattern(stravaHashRegex),
  start: Joi.string().required(),
  title: Joi.string().required(),
  finish: Joi.string().required(),
  switch: Joi.string(),
  is_a_loop: Joi.boolean().default(false),
  distance: Joi.number().required(),
  elevation: Joi.number().required(),
  description: Joi.string(),
  image: Joi.string(),
}).required();
