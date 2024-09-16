import Joi from "joi";
import { frAlphaNum } from "../regex.schema";

export default Joi.object({
  name: Joi.string().pattern(frAlphaNum),
}).required();
