import Joi from "joi";

export default Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "Le nom est requis",
    "string.base": "Le nom doit être au format d'une chaîne de caractères",
    "string.empty": "Le nom ne doit pas être vide",
  }),
  email: Joi.string().email({ minDomainSegments: 1 }).required().messages({
    "any.required": "L'email est requis",
    "string.base": "L'email doit être au format d'une chaîne de caractères",
    "string.email": "L'email donné n'est pas au format valide",
  }),
  is_admin: Joi.boolean().default(false),
}).required();
