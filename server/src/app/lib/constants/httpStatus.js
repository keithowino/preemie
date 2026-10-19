const HTTP_STATUS = Object.freeze({
	/**
	 * * #### Success
	 */

	/**
	 * 200 OK
	 * The request succeeded.
	 *
	 * Use for successful GET, PATCH, PUT, or DELETE requests
	 * when a response body is returned.
	 */
	OK: 200,

	/**
	 * 201 Created
	 * The request successfully created a new resource.
	 *
	 * Use after creating a project, user, or other resource.
	 */
	CREATED: 201,

	/**
	 * 202 Accepted
	 * The request has been accepted for processing, but the
	 * processing has not necessarily completed.
	 *
	 * Use for asynchronous operations that will finish later.
	 */
	ACCEPTED: 202,

	/**
	 * 204 No Content
	 * The request succeeded, but there is no response body.
	 *
	 * Use when an operation completes successfully and the
	 * client does not need a response payload.
	 */
	NO_CONTENT: 204,

	/**
	 * * #### Client Errors
	 */

	/**
	 * 400 Bad Request
	 * The request is malformed or contains invalid input.
	 *
	 * Use for invalid request structure, malformed JSON,
	 * failed request validation, or invalid parameter values.
	 */
	BAD_REQUEST: 400,

	/**
	 * 401 Unauthorized
	 * The request lacks valid authentication credentials.
	 *
	 * Use when a user is not logged in, provides invalid
	 * credentials, or presents an invalid or expired token
	 * that cannot be refreshed.
	 */
	UNAUTHORIZED: 401,

	/**
	 * 403 Forbidden
	 * The user is authenticated but is not permitted to
	 * perform the requested operation.
	 *
	 * Use when an authenticated non-admin user attempts
	 * to access an administrator-only endpoint.
	 */
	FORBIDDEN: 403,

	/**
	 * 404 Not Found
	 * The requested resource or endpoint could not be found.
	 *
	 * Use when a project, user, or other requested resource
	 * does not exist or is not accessible through that route.
	 */
	NOT_FOUND: 404,

	/**
	 * 409 Conflict
	 * The request conflicts with the current state of a
	 * resource or violates a uniqueness constraint.
	 *
	 * Use for duplicate resources, conflicting operations,
	 * or state conflicts that prevent the request from
	 * being completed.
	 */
	CONFLICT: 409,

	/**
	 * 422 Unprocessable Entity
	 * The request is syntactically valid, but its instructions
	 * cannot be processed because of semantic or business-rule
	 * violations.
	 *
	 * Use when the request structure is valid but the
	 * requested operation violates a business rule.
	 */
	UNPROCESSABLE_ENTITY: 422,

	/**
	 * * #### Server Errors
	 */

	/**
	 * 500 Internal Server Error
	 * An unexpected condition prevented the server from
	 * completing the request.
	 *
	 * Use for unexpected failures that are not caused by
	 * invalid client input or a known application error.
	 */
	INTERNAL_SERVER_ERROR: 500,
});

export default HTTP_STATUS;
