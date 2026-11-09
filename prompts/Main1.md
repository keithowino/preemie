- [x] Unauthenticated requests cannot access any ideation endpoint.
- [x] New generations are assigned to the authenticated user.
- [x] The API never accepts client-supplied ownership as authoritative.
- [x] Users can list only their own generations.
- [x] Pagination returns the correct items and metadata.
- [x] Users can retrieve their own generations.
- [x] A user cannot retrieve another user's generations.
- [x] A user cannot delete another user's generations.
- [x] A user can delete their own generations.
- [x] The API does not expose the internal owner field.

## Let's proceed to: Stage 3 — Backend account preferences

- Introduce persistent application preferences.
- Move theme preference from local-only state into the account.
    - When the user changes the theme, the application should:
        1. Update the UI immediately.
        2. Persist the preference through the backend.
        3. Restore that preference when the user signs in again or opens another session.

        We should also consider what happens when the user changes their theme on one device while another session is active.

- Introduce persistent presence/status.
  The status should be persisted against the user account.

    We should distinguish manually selected status from actual session activity. For example, a user selecting offline should not necessarily invalidate or terminate their active sessions.

    There is also an architectural consideration: presence across multiple devices is different from presence stored on a single user document. We can begin with account-level status and introduce real-time presence tracking only when necessary

- Implement authenticated profile and preferences endpoints.
- Update the user presenter and validators.
