import Joi from "joi";

export default Joi.object({
  email: Joi.string().email({ minDomainSegments: 1 }).required().messages({
    "any.required": "L'email est requis",
    "string.base": "L'email doit être au format d'une chaîne de caractères",
    "string.email": "L'email donné n'est pas au format valide",
  }),
}).required();
