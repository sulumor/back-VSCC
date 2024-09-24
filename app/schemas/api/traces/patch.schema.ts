import { stravaHashRegex, stravaIdRegex } from "@/schemas/regex.schema";
import Joi from "joi";

export default Joi.object({
  id: Joi.number(),
  strava_id: Joi.string().pattern(stravaIdRegex),
  strava_hash: Joi.string().pattern(stravaHashRegex),
  start: Joi.string(),
  finish: Joi.string(),
  switch: Joi.string(),
  is_a_loop: Joi.boolean(),
  distance: Joi.number(),
  elevation: Joi.number(),
  description: Joi.string(),
  image: Joi.string(),
})
  .min(1)
  .required();
