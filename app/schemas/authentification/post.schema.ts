import Joi from "joi";
import { passwordRegex } from "../regex.schema";

export default Joi.object({
  email: Joi.string().email({ minDomainSegments: 1 }).required().messages({
    "any.required": "L'email est requis",
    "string.base": "L'email doit être au format d'une chaîne de caractères",
    "string.email": "L'email donné n'est pas au format valide",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "any.required": "Le mot de passe est requis",
    "string.base":
      "Le mot de passe doit être au format d'une chaîne de caratères",
    "string.pattern.base": "Échec lors de l'authentification",
  }),
}).required();
