// TOKENS

/**
 * @typedef { object } Tokens
 * @property { string } accessToken - Token d'accès à l'Api
 * @property { string } refreshToken - Token pour refaire un access token
 */

/**
 * @typedef { object } Message
 * @property { string } message - Messsage
 */

// LOGIN

/**
 * @typedef { object } LoginBody
 * @property { string } email - Email
 * @property { string } password - Mot de passe
 */

/**
 * @typedef { object } EmailBody
 * @property { string } email - Email
 */

// TRACES

/**
 * @typedef { object } Trace
 * @property { number } id
 * @property { string } strava_id
 * @property { string } strava_hash
 * @property { string } start
 * @property { string } finish
 * @property { string } switch
 * @property { boolean } is_a_loop
 * @property { number } distance
 * @property { number } elevation
 * @property { string } description
 * @property { string } image
 */

/**
 * @typedef { object } TraceBody
 * @property { string } strava_id
 * @property { string } strava_hash
 * @property { string } start
 * @property { string } finish
 * @property { string } switch
 * @property { boolean } is_a_loop
 * @property { number } distance
 * @property { number } elevation
 * @property { string } description
 * @property { string } image
 */

// USERS

/**
 * @typedef { object } User
 * @property { string } id
 * @property { string } firstname
 * @property { string } email
 * @property { string } password
 * @property { boolean } is_admin
 */

/**
 * @typedef { object } UserBody
 * @property { string } firstname
 * @property { string } email
 * @property { string } password
 * @property { boolean } is_admin
 */
