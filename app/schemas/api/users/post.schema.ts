import { passwordRegex } from "@/schemas/regex.schema";
import Joi from "joi";

export default Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "Le nom est requis",
    "string.base": "Le nom doit être au format d'une chaîne de caractères",
    "string.empty": "Le nom ne doit pas être vide",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "any.required": "Le mot de passe est requis",
    "string.base":
      "Le mot de passe doit être au format d'une chaîne de caratères",
    "string.pattern.base":
      "Le mot de passe doit contenir au moins 8 caractères dont 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial",
  }),
  email: Joi.string().email({ minDomainSegments: 1 }).messages({
    "string.base": "L'email doit être au format d'une chaîne de caractères",
    "string.email": "L'email donné n'est pas au format valide",
  }),
  is_admin: Joi.boolean().default(false),
}).required();
