const HTTP_STATUS = Object.freeze({
	/**
	 * * #### Informational Responses
	 */

	/**
	 * 100 Continue
	 * The server has received the initial request headers, and the client
	 * may continue sending the request.
	 */
	CONTINUE: 100,

	/**
	 * 101 Switching Protocols
	 * The server is switching protocols as requested by the client.
	 */
	SWITCHING_PROTOCOLS: 101,

	/**
	 * 102 Processing
	 * The server has received and is processing the request, but no response
	 * is available yet.
	 */
	PROCESSING: 102,

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
	 * 203 Non-Authoritative Information
	 * The request succeeded, but the returned metadata may differ
	 * from the information available from the origin server.
	 */
	NON_AUTHORITATIVE_INFORMATION: 203,

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
	 * 205 Reset Content
	 * The request succeeded, and the client should reset the view
	 * or form used to submit the request.
	 */
	RESET_CONTENT: 205,

	/**
	 * 206 Partial Content
	 * The server is returning only part of the requested resource.
	 *
	 * Commonly used for range requests.
	 */
	PARTIAL_CONTENT: 206,

	/**
	 * * #### Redirection
	 */

	/**
	 * 300 Multiple Choices
	 * The requested resource has multiple possible representations.
	 */
	MULTIPLE_CHOICES: 300,

	/**
	 * 301 Moved Permanently
	 * The resource has permanently moved to another URL.
	 */
	MOVED_PERMANENTLY: 301,

	/**
	 * 302 Found
	 * The resource is temporarily available at another URL.
	 */
	FOUND: 302,

	/**
	 * 303 See Other
	 * The client should retrieve the response from another URL,
	 * typically using GET.
	 */
	SEE_OTHER: 303,

	/**
	 * 304 Not Modified
	 * The resource has not changed since the client's cached version.
	 */
	NOT_MODIFIED: 304,

	/**
	 * 307 Temporary Redirect
	 * The resource is temporarily available at another URL.
	 * The original HTTP method must be preserved.
	 */
	TEMPORARY_REDIRECT: 307,

	/**
	 * 308 Permanent Redirect
	 * The resource has permanently moved to another URL.
	 * The original HTTP method must be preserved.
	 */
	PERMANENT_REDIRECT: 308,

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
	 * 402 Payment Required
	 * Reserved for future use; some services use it for payment-related
	 * requirements.
	 */
	PAYMENT_REQUIRED: 402,

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
	 * 405 Method Not Allowed
	 * The HTTP method is not supported for the requested resource.
	 */
	METHOD_NOT_ALLOWED: 405,

	/**
	 * 406 Not Acceptable
	 * The server cannot produce a response matching the client's
	 * acceptable response formats.
	 */
	NOT_ACCEPTABLE: 406,

	/**
	 * 407 Proxy Authentication Required
	 * The client must authenticate with a proxy before proceeding.
	 */
	PROXY_AUTHENTICATION_REQUIRED: 407,

	/**
	 * 408 Request Timeout
	 * The server did not receive the complete request within
	 * the time it was prepared to wait.
	 */
	REQUEST_TIMEOUT: 408,

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
	 * 410 Gone
	 * The resource is no longer available and this condition is
	 * expected to be permanent.
	 */
	GONE: 410,

	/**
	 * 411 Length Required
	 * The server requires a Content-Length header.
	 */
	LENGTH_REQUIRED: 411,

	/**
	 * 412 Precondition Failed
	 * A request precondition evaluated to false.
	 */
	PRECONDITION_FAILED: 412,

	/**
	 * 413 Content Too Large
	 * The request payload exceeds the server's accepted size.
	 */
	CONTENT_TOO_LARGE: 413,

	/**
	 * 414 URI Too Long
	 * The requested URI is longer than the server is willing to process.
	 */
	URI_TOO_LONG: 414,

	/**
	 * 415 Unsupported Media Type
	 * The request content format is not supported by the server.
	 */
	UNSUPPORTED_MEDIA_TYPE: 415,

	/**
	 * 416 Range Not Satisfiable
	 * The requested range cannot be provided for the resource.
	 */
	RANGE_NOT_SATISFIABLE: 416,

	/**
	 * 417 Expectation Failed
	 * The server cannot satisfy the expectations in the request's
	 * Expect header.
	 */
	EXPECTATION_FAILED: 417,

	/**
	 * 418 I'm a Teapot
	 * An intentionally humorous status code defined by RFC 2324.
	 * Not intended for ordinary application errors.
	 */
	IM_A_TEAPOT: 418,

	/**
	 * 421 Misdirected Request
	 * The request was directed to a server that cannot produce
	 * a response for the requested target.
	 */
	MISDIRECTED_REQUEST: 421,

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
	 * 423 Locked
	 * The requested resource is locked.
	 */
	LOCKED: 423,

	/**
	 * 424 Failed Dependency
	 * The request failed because it depended on another operation
	 * that failed.
	 */
	FAILED_DEPENDENCY: 424,

	/**
	 * 425 Too Early
	 * The server is unwilling to process a request that might
	 * be replayed.
	 */
	TOO_EARLY: 425,

	/**
	 * 426 Upgrade Required
	 * The client must switch to another protocol to proceed.
	 */
	UPGRADE_REQUIRED: 426,

	/**
	 * 428 Precondition Required
	 * The server requires the request to be conditional.
	 */
	PRECONDITION_REQUIRED: 428,

	/**
	 * 429 Too Many Requests
	 * The client has sent too many requests within a given period.
	 *
	 * Useful for rate limiting API requests.
	 */
	TOO_MANY_REQUESTS: 429,

	/**
	 * 431 Request Header Fields Too Large
	 * The server refuses to process the request because its headers
	 * are too large.
	 */
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,

	/**
	 * 451 Unavailable For Legal Reasons
	 * Access to the resource is denied for legal reasons.
	 */
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,

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

	/**
	 * 501 Not Implemented
	 * The server does not support the functionality required
	 * to fulfill the request.
	 */
	NOT_IMPLEMENTED: 501,

	/**
	 * 502 Bad Gateway
	 * The server, acting as a gateway or proxy, received an invalid
	 * response from an upstream server.
	 */
	BAD_GATEWAY: 502,

	/**
	 * 503 Service Unavailable
	 * The server is temporarily unable to handle the request.
	 *
	 * Use when a service is overloaded, temporarily unavailable,
	 * or undergoing maintenance.
	 *
	 * Relevant to Preemie: an upstream AI provider such as Gemini
	 * may return this status when its model is experiencing high demand.
	 */
	SERVICE_UNAVAILABLE: 503,

	/**
	 * 504 Gateway Timeout
	 * The server, acting as a gateway or proxy, did not receive
	 * a timely response from an upstream server.
	 */
	GATEWAY_TIMEOUT: 504,

	/**
	 * 505 HTTP Version Not Supported
	 * The server does not support the HTTP version used in the request.
	 */
	HTTP_VERSION_NOT_SUPPORTED: 505,

	/**
	 * 506 Variant Also Negotiates
	 * The server encountered an internal configuration error
	 * during content negotiation.
	 */
	VARIANT_ALSO_NEGOTIATES: 506,

	/**
	 * 507 Insufficient Storage
	 * The server cannot store the representation needed to
	 * complete the request.
	 */
	INSUFFICIENT_STORAGE: 507,

	/**
	 * 508 Loop Detected
	 * The server detected an infinite loop while processing
	 * the request.
	 */
	LOOP_DETECTED: 508,

	/**
	 * 510 Not Extended
	 * Further extensions to the request are required for the server
	 * to fulfill it.
	 */
	NOT_EXTENDED: 510,

	/**
	 * 511 Network Authentication Required
	 * The client must authenticate to gain network access.
	 */
	NETWORK_AUTHENTICATION_REQUIRED: 511,
});

export default HTTP_STATUS;
