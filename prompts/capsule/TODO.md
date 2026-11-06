## Header

### What's not done

Status is local state. The menu shows a status dot and lets the user pick a status, but the choice isn't persisted and isn't visible to anyone else. The TODO in AccountMenu shows exactly where the backend call goes. Once PATCH /auth/me { status } exists, swap the useState for the optimistic-update version in the TODO, and swap the trigger's status prop to read from user.status.

Theme is a localStorage-only hook, not a provider. useTheme in lib/hooks/useTheme.js works, but it should be a ThemeProvider in AppProviders so multiple consumers agree on the current theme. The TODO in the hook says so. Also: "system" doesn't react to OS preference changes after mount — the hook listens for changes, but only while theme === "system" is the current selection, which is correct, but a matchMedia flapping between user preferences and OS preferences deserves a test before you trust it.

/account/switch doesn't exist. The menu item links to it, and the item is annotated "Soon." The route needs a page; the page needs backend multi-account support, which is a bigger product decision (one email with multiple workspaces? one user with multiple emails?). Ship the link as a placeholder; don't ship a fake switch UI.

No mobile-specific menu for the two new links. MobileNav includes them, so they're reachable on mobile, but they're inside the hamburger rather than a tab bar. That's fine for now and can be revisited if usage justifies a bottom nav.

The dropdown doesn't use the Kokonut morph. The avatar trigger is circular and the content opens as a standard anchored dropdown. That's a deliberate choice; the morph animation requires a panel-shaped trigger and would fight the Radix positioning. If you want the morph later, it belongs as a separate component that opts into it (<AccountMenuMorph> vs <AccountMenu>), not as a variant flag on this one.

No tests. The hold-to-sign-out interaction and the onSelect prevention are the two spots most worth unit-testing. Neither exists yet. When the test harness lands, the first test should be "sign-out only fires after duration ms of holding, and cancels on pointerup."
