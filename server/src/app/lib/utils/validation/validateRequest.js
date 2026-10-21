export default function validateRequest({ body, params, query, headers }, req) {
	/**
	 * console.log("[Validation] Incoming body", req.body);
	 * const parsedBody = body ? body.parse(req.body) : req.body;
	 * console.log("[Validation] Parsed body", parsedBody);
	 * body: parsedBody,
	 */
	return {
		body: body ? body.parse(req.body) : req.body,
		params: params ? params.parse(req.params) : req.params,
		query: query ? query.parse(req.query) : req.query,
		headers: headers ? headers.parse(req.headers) : req.headers,
	};
}
