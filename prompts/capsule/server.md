## Findings during the ideation config

These are preliminary findings from the Express setup and provider client. We will examine them in detail in the next audit stage.

- Timeout behavior and normalization: The provider recognizes TimeoutError and messages containing “timeout,” but may not classify every SDK timeout or abort error consistently. We should test the actual SDK failure shape.
- Error responses: The controller and global error handler need to be checked together to ensure provider details and internal database errors are not exposed to clients.
- Server-side credentials: The client reads its API key from the server's environment configuration, which is the right architectural direction. We should verify startup validation and ensure the key is never returned in responses or logs.

---

> N/B: An important distinction: request-size limits protect against oversized individual requests, whereas rate limits protect against excessive request frequency. We need both, and they should be configured independently.

## Initial architecture recommendations

Based on the existing Express application structure, these are the controls I recommend evaluating.

| Control                  | Initial recommendation                                   | Reason                                                                                |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| JSON request limit       | Configurable; evaluate `64kb` as the starting value      | The request contains materials and constraints, not uploaded files.                   |
| Generation rate limit    | Separate, stricter limiter                               | Each accepted request can invoke Gemini and incur latency or provider costs.          |
| Retrieval rate limit     | Separate, more permissive limiter                        | Retrieving a saved generation should not consume another generation request.          |
| Rate-limit configuration | Environment variables validated in the existing `env.js` | Avoid hardcoding operational settings or replacing the existing configuration system. |
| Excessive requests       | HTTP `429 Too Many Requests`                             | Communicates rate-limit rejection clearly.                                            |
| Oversized requests       | HTTP `413 Content Too Large`                             | Identifies the payload-size violation.                                                |
| Error response format    | Preserve the existing `{ success, error }` contract      | Keeps frontend and REST-client error handling consistent.                             |

### Important implementation decisions

Configure proxy handling deliberately.

If Preemie is deployed behind a reverse proxy, we must verify how Express determines the client IP. Incorrect proxy configuration can cause many users to share one rate-limit bucket—or allow limits to be bypassed. We should not enable unrestricted proxy trust as a shortcut.

Keep the implementation proportional to the MVP.

Start with configurable, in-memory rate limiting if the deployment is a single server instance and the selected limiter supports that setup. Its counters will not be shared across instances and may reset on restart. We should document that limitation rather than introduce a distributed store prematurely.

---

# Preemie MVP — Request Protection Architecture Review

The current files show that Preemie already has a suitable foundation for implementing these controls. We can preserve the existing Express middleware order, Zod-based environment validation, centralized error handling, and versioned API routes.

My recommendation is to implement request-size protection first, test it, and then add rate limiting in a separate step. This keeps the changes small and makes failures easier to diagnose.
