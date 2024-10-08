/**
 * @typedef {object} WebsiteJsonError - Error response
 * @property {string} error.required - Error message
 * @example
 * {
 *  "error": "Bad request"
 * }
 */

export default class WebsiteError extends Error {
  format: string;
  httpStatus: any;
  /**
   * Personnalizes Error Constructor to personnalized user response
   * @param {string} message contains literal message to communicate
   * @param {object} info dynamic object to add more informations to the error (ex: http status)
   */
  constructor(message: string | undefined, info: { httpStatus: any }) {
    super(message);
    this.name = "WebsiteError";
    this.format = "html";
    this.httpStatus = info.httpStatus || 500;
    // * A décommenter pour ajouter plus de paramètres
    // Object.entries(infos).forEach(([key, value]) => {
    //   this[key] = value;
    // });
  }
}
