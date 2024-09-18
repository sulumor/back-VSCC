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
 * @property { Date } created_at
 * @property { Date } updated_at
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
