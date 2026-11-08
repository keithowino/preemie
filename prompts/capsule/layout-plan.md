|        | Marketing Shell        | Workspace Shell                            |
| ------ | ---------------------- | ------------------------------------------ |
| Routes | /, /community, /museum | /create, /ideas/:id, /library, /account/\* |
| Chrome | Header + footer        | Sidebar + slim top bar, no footer, no hero |
| Job    | Explain and convert    | Get work done                              |

1 & 2. Sidebar on /account? Don’t give /account its own page sidebar or hero. It lives inside the workspace shell, whose sidebar is the one global nav. Account gets only a secondary nav inside the content area (Profile, Settings, Security), as a left list on desktop and tabs on mobile. That’s one sidebar, plus a local sub-nav that appears only on /account/\*.

3 & 4. Landing page. Yours is structurally fine. It needs three changes:

Show the product. Add a static sample of materials turning into three approaches, such as a mocked card trio. People trust what they can see.
Respond to auth status. Authenticated users get “Open workspace” in the header and “Start creating” linking to /create. Right now both CTAs link to /register even when logged in, which is a bug. You could also show their last two ideations as “Continue where you left off.”
One action per state. Logged out means create account. Logged in means start creating. Everything else is secondary.

5. After the landing page. Authenticated users land in the workspace at /create.

6. Header vs sidebar.

Marketing header: brand, Community, Museum, then Sign in and Create account, or “Open workspace” and the avatar when authed. Keep your GSAP tagline here only.
Workspace: no header nav. The sidebar holds the brand, a New ideation button, Library, Community and Museum, a list of recent ideations, and the user menu at the bottom (Account, Security, Sign out). The top bar shows only the sidebar trigger on mobile and a breadcrumb.

7. UX of the prompt part. Don’t copy the chat plane, because you collect structure rather than free text.

```bash
/create (workspace)
┌─────────┬──────────────────────────────────────────┐
│ Sidebar │ New ideation                             │
│         │ Start from an example: [chip][chip][chip]│
│ + New   │ ┌─ Materials ───────────────┐ ┌─ Goal ─┐ │
│ Library │ │ rows (name/qty/unit/cond) │ │ env    │ │
│ ──────  │ │ + Add material            │ │ skill  │ │
│ Recent  │ └───────────────────────────┘ │ notes  │ │
│  · ...  │                               └────────┘ │
│ ──────  │              [ Generate ideas → ]        │
│ Avatar  │                                          │
└─────────┴──────────────────────────────────────────┘

/ideas/:id (workspace)
┌─────────┬──────────────────────────────────────────┐
│ Sidebar │ Your inputs (collapsed summary) [Refine] │
│         │ [Repurpose] [Improve] [Invent]  ← tabs   │
│         │ ┌──────────────────────────────────────┐ │
│         │ │ Summary · Materials · Tools · Steps  │ │
│         │ │ Principles · Safety                  │ │
│         │ └──────────────────────────────────────┘ │
└─────────┴──────────────────────────────────────────┘
```

Changes from your current page:

Examples collapse from a full card grid to a row of chips, so the form is the first thing users see. The big grid works as the empty state of /create only.
Materials and constraints sit side by side on desktop (about 2/3 and 1/3) and stack on mobile.
Results use tabs for the three approaches, with a “Compare” toggle later. Each approach is a plan, not a chat bubble.
Loading shows a skeleton of the three tabs with a status line, not just a disabled button.

## Roadmap

Phase 1: Layout routes (no visual change yet)

Create MarketingLayout (current header, <main> with container, footer, <Outlet />).
Create WorkspaceLayout (empty skeleton with <Outlet />).
Remove AppShell from AppRouter. Put layouts in the route tree:

Phase 2: Workspace shell

Install the shadcn sidebar and build WorkspaceSidebar (New ideation, nav, user menu).
Add the top bar (mobile trigger and breadcrumb). Move AccountMenu into the sidebar footer.
Add /library with an empty state.
