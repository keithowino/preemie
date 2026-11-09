# Preemie Folder Structure

Generated on: 2026-11-08

```bash
├── client/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── config/
│   │   │   │   ├── env.js
│   │   │   │   └── index.js
│   │   │   ├── providers/
│   │   │   │   ├── AppProviders.jsx
│   │   │   │   └── index.js
│   │   │   ├── router/
│   │   │   │   ├── AppRouter.jsx
│   │   │   │   ├── index.js
│   │   │   │   └── RouteConfiguration.jsx
│   │   │   └── index.js
│   │   ├── components/
│   │   │   ├── custom/
│   │   │   │   ├── layout/
│   │   │   │   │   └── ScrollToTop.jsx
│   │   │   │   └── workspace/
│   │   │   │       ├── WorkspaceSidebar.jsx
│   │   │   │       ├── WorkspaceTopBar.jsx
│   │   │   │       └── WorkspaceUserMenu.jsx
│   │   │   ├── test/
│   │   │   │   └── page.jsx
│   │   │   ├── toast/
│   │   │   │   ├── index.js
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── ToastViewport.jsx
│   │   │   ├── ui/
│   │   │   │   ├── custom/
│   │   │   │   │   └── FormError.jsx
│   │   │   │   ├── Layouts/
│   │   │   │   │   ├── container/
│   │   │   │   │   │   ├── Container.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── manual_code/
│   │   │   │   │   │   └── drop_down/
│   │   │   │   │   │       └── ss/
│   │   │   │   │   │           └── one.jsx
│   │   │   │   │   └── WorkspaceLayout.jsx
│   │   │   │   ├── typography/
│   │   │   │   │   └── Text.jsx
│   │   │   │   ├── avatar.jsx
│   │   │   │   ├── breadcrumb.jsx
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── collapsible.jsx
│   │   │   │   ├── combobox.jsx
│   │   │   │   ├── dropdown-menu.jsx
│   │   │   │   ├── field.jsx
│   │   │   │   ├── input-group.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── phone-input.jsx
│   │   │   │   ├── scroll-area.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   ├── separator.jsx
│   │   │   │   ├── sheet.jsx
│   │   │   │   ├── sidebar.jsx
│   │   │   │   ├── skeleton.jsx
│   │   │   │   ├── textarea.jsx
│   │   │   │   └── tooltip.jsx
│   │   │   ├── app-sidebar.jsx
│   │   │   ├── nav-main.jsx
│   │   │   ├── nav-projects.jsx
│   │   │   ├── nav-user.jsx
│   │   │   └── team-switcher.jsx
│   │   ├── hooks/
│   │   │   ├── use-mobile.js
│   │   │   ├── useRecentIdeations.js
│   │   │   └── useSignOut.js
│   │   ├── lib/
│   │   │   ├── config/
│   │   │   │   ├── index.js
│   │   │   │   └── platform.js
│   │   │   ├── custom_components/
│   │   │   │   ├── layouts/
│   │   │   │   │   ├── featureGrid/
│   │   │   │   │   │   ├── FeatureGrid.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── ui/
│   │   │   │   │   ├── loader/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── Loader.jsx
│   │   │   │   │   ├── section/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── Section.jsx
│   │   │   │   │   ├── typography/
│   │   │   │   │   │   ├── Heading.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   └── index.js
│   │   │   ├── index.js
│   │   │   ├── MetaDataInsert.jsx
│   │   │   └── utils.js
│   │   ├── modules/
│   │   │   ├── administration/
│   │   │   │   ├── lab/
│   │   │   │   │   ├── layouts/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── LabLayout.jsx
│   │   │   │   │   ├── pages/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── Test.jsx
│   │   │   │   │   ├── routes/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── lab.routes.jsx
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   ├── gateway/
│   │   │   │   ├── layouts/
│   │   │   │   │   ├── AppFooter.jsx
│   │   │   │   │   ├── AppHeader.jsx
│   │   │   │   │   └── MarketingLayout.jsx
│   │   │   │   ├── pages/
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── LandingPage.jsx
│   │   │   │   ├── routes/
│   │   │   │   │   ├── gateway.routes.jsx
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   ├── identity/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AccountMenu.jsx
│   │   │   │   │   ├── AuthTextField.jsx
│   │   │   │   │   ├── MobileNav.jsx
│   │   │   │   │   └── StatusBot.jsx
│   │   │   │   ├── layouts/
│   │   │   │   │   ├── AuthLayout.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── AccountSettingsPage.jsx
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LoginPage.jsx
│   │   │   │   │   ├── ProfilePage.jsx
│   │   │   │   │   ├── RegisterPage.jsx
│   │   │   │   │   └── SessionsPage.jsx
│   │   │   │   ├── routes/
│   │   │   │   │   ├── identity.routes.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── utils/
│   │   │   │   │   ├── HoldToSignOut.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── validators/
│   │   │   │   │   └── authSchema.js
│   │   │   │   └── index.js
│   │   │   ├── workspace/
│   │   │   │   ├── components/
│   │   │   │   │   ├── IdeationConstraintsForm.jsx
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── MaterialEditor.jsx
│   │   │   │   │   └── StepHeader.jsx
│   │   │   │   ├── constants/
│   │   │   │   │   ├── ideationExamples.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── HomePage.jsx
│   │   │   │   │   ├── IdeasPage.jsx
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── LibraryPage.jsx
│   │   │   │   ├── routes/
│   │   │   │   │   └── workspace.routes.jsx
│   │   │   │   ├── services/
│   │   │   │   │   ├── ideation.api.js
│   │   │   │   │   └── index.js
│   │   │   │   └── validators/
│   │   │   │       ├── ideationFormSchema.js
│   │   │   │       └── index.js
│   │   │   └── index.js
│   │   ├── platform/
│   │   │   ├── api/
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── response.interceptor.js
│   │   │   │   ├── apiClient.js
│   │   │   │   ├── apiError.js
│   │   │   │   ├── index.js
│   │   │   │   ├── request.service.js
│   │   │   │   └── sessionRefresh.js
│   │   │   ├── identity/
│   │   │   │   ├── identity.service.js
│   │   │   │   ├── IdentityContext.jsx
│   │   │   │   ├── IdentityProvider.jsx
│   │   │   │   ├── index.js
│   │   │   │   └── useIdentity.js
│   │   │   ├── notifications/
│   │   │   │   ├── index.js
│   │   │   │   ├── NotificationContext.jsx
│   │   │   │   ├── NotificationProvider.jsx
│   │   │   │   └── useNotify.js
│   │   │   ├── routing/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AuthenticatedRoute.jsx
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── PublicOnlyRoute.jsx
│   │   │   │   └── index.js
│   │   │   ├── session/
│   │   │   │   ├── index.js
│   │   │   │   ├── sessionManager.js
│   │   │   │   └── tokenStorage.js
│   │   │   ├── theme/
│   │   │   │   ├── index.js
│   │   │   │   ├── ThemeContext.jsx
│   │   │   │   ├── ThemeProvider.jsx
│   │   │   │   └── useTheme.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.example
│   ├── .env.production
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
├── config/
│   └── generate-structure.js
├── server/
│   ├── src/
│   │   ├── app/
│   │   │   ├── bootstrap/
│   │   │   │   ├── database.js
│   │   │   │   └── index.js
│   │   │   ├── config/
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── ideationRateLimiters.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── cors.js
│   │   │   │   ├── env.js
│   │   │   │   └── index.js
│   │   │   ├── lib/
│   │   │   │   ├── constants/
│   │   │   │   │   ├── httpStatus.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── utils/
│   │   │   │   │   ├── error/
│   │   │   │   │   │   ├── appError.js
│   │   │   │   │   │   ├── errorCodes.js
│   │   │   │   │   │   ├── errorHandler.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── notFound.js
│   │   │   │   │   ├── http/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── requestMetadata.js
│   │   │   │   │   ├── validation/
│   │   │   │   │   │   ├── email.schema.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── password.schema.js
│   │   │   │   │   │   ├── phone.schema.js
│   │   │   │   │   │   └── validateRequest.js
│   │   │   │   │   ├── apiResponse.js
│   │   │   │   │   ├── asyncHandler.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── presenter.js
│   │   │   │   └── index.js
│   │   │   ├── routes/
│   │   │   │   ├── api.js
│   │   │   │   └── index.js
│   │   │   ├── app.js
│   │   │   ├── index.js
│   │   │   └── server.js
│   │   ├── modules/
│   │   │   ├── ideations/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── ideation.controller.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── models/
│   │   │   │   │   ├── Ideation.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── providers/
│   │   │   │   │   ├── gemini.client.js
│   │   │   │   │   ├── gemini.provider.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── ideation.repository.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── routes/
│   │   │   │   │   ├── ideation.routes.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── services/
│   │   │   │   │   ├── ideation.service.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── validators/
│   │   │   │   │   ├── ideation.schema.js
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   ├── identity/
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── auth.controller.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── middleware/
│   │   │   │   │   ├── authenticate.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── models/
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── Session.js
│   │   │   │   │   └── User.js
│   │   │   │   ├── presenters/
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── session.presenter.js
│   │   │   │   │   └── user.presenter.js
│   │   │   │   ├── repositories/
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── session.repository.js
│   │   │   │   │   └── user.repository.js
│   │   │   │   ├── routes/
│   │   │   │   │   ├── auth.routes.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── security/
│   │   │   │   │   ├── accessToken.service.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── password.service.js
│   │   │   │   │   ├── refreshToken.service.js
│   │   │   │   │   ├── session.service.js
│   │   │   │   │   └── tokenHasher.js
│   │   │   │   ├── services/
│   │   │   │   │   ├── auth.service.js
│   │   │   │   │   └── index.js
│   │   │   │   ├── validators/
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── loginRequestSchema.js
│   │   │   │   │   ├── logoutRequestSchema.js
│   │   │   │   │   ├── refreshRequestSchema.js
│   │   │   │   │   └── registerRequestSchema.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   └── index.js
│   ├── tests/
│   │   ├── rest/
│   │   │   ├── auth.rest
│   │   │   ├── ideation.rest
│   │   │   └── system.rest
│   │   └── unit/
│   │       └── integration/
│   ├── .env.development
│   ├── .env.example
│   ├── .env.production
│   ├── .gitignore
│   ├── apiClientConnection.js
│   ├── checkModelSupport.js
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```
