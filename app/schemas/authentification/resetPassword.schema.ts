import Joi from "joi";
import { passwordRegex } from "../regex.schema";

export default Joi.object({
  id: Joi.string().guid().required().messages({
    "string.guid": "L'identifiant fourni n'est pas valide",
    "any.required": "L'identifiant est requis",
  }),
  token: Joi.string().required().messages({
    "any.required": "Le token est requis",
    "string.base": "Le token doit être au format d'une chaîne de caratères",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "any.required": "Le mot de passe est requis",
    "string.base":
      "Le mot de passe doit être au format d'une chaîne de caratères",
    "string.pattern.base":
      "Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial",
  }),
}).required();
