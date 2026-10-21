const ErrorCodes = Object.freeze({
	/**
	 * * #### Client Errors
	 */

	/**
	 * The request is malformed or contains invalid input.
	 */
	BAD_REQUEST: "BAD_REQUEST",

	/**
	 * The request failed validation.
	 */
	VALIDATION_ERROR: "VALIDATION_ERROR",

	/**
	 * Valid authentication credentials are missing or invalid.
	 */
	UNAUTHORIZED: "UNAUTHORIZED",

	/**
	 * The authenticated user is not permitted to perform the operation.
	 */
	FORBIDDEN: "FORBIDDEN",

	/**
	 * The requested resource or endpoint could not be found.
	 */
	NOT_FOUND: "NOT_FOUND",

	/**
	 * The request conflicts with the current resource state.
	 */
	CONFLICT: "CONFLICT",

	/**
	 * The HTTP method is not supported for the requested resource.
	 */
	METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",

	/**
	 * The request content type is not supported.
	 */
	UNSUPPORTED_MEDIA_TYPE: "UNSUPPORTED_MEDIA_TYPE",

	/**
	 * The request violates a business rule.
	 */
	UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",

	/**
	 * The client has exceeded the permitted request rate.
	 */
	TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

	/**
	 * * #### Upstream Service Errors
	 */

	/**
	 * An upstream service returned an invalid response.
	 */
	BAD_GATEWAY: "BAD_GATEWAY",

	/**
	 * An upstream service did not respond within the permitted time.
	 */
	GATEWAY_TIMEOUT: "GATEWAY_TIMEOUT",

	/**
	 * The service is temporarily unable to handle the request.
	 *
	 * Relevant to temporary AI provider unavailability, including
	 * Gemini model overload or high demand.
	 */
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

	/**
	 * * #### Server Errors
	 */

	/**
	 * An unexpected server-side failure occurred.
	 */
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
});

export default ErrorCodes;
