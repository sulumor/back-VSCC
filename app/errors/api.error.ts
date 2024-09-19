/**
 * @typedef {object} ApiJsonError - Error response
 * @property {string} error.required - Error message
 * @example
 * {
 *  "error": "Mauvaise requête"
 * }
 */

export default class ApiError extends Error {
  name: string;
  format: string;
  httpStatus: number;
  /**
   * Personnalizes Error Constructor to personnalized user response
   * @param {string} message contains literal message to communicate
   * @param {object} info dynamic object to add more informations to the error (ex: http status)
   */
  constructor(message: string, infos: { httpStatus?: number }) {
    super(message);
    this.name = "Api error";
    this.format = "json";
    this.httpStatus = infos.httpStatus || 500;
    // * A décommenter pour ajouter plus de paramètres
    // Object.entries(infos).forEach(([key, value]) => {
    //   this[key] = value;
    // });
  }
}
