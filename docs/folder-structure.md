# Preemie Folder Structure

Generated on: 2026-10-26

```bash
├── client/
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
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   │   ├── apiClient.js
│   │   │   │   └── index.js
│   │   │   ├── components/
│   │   │   │   ├── layouts/
│   │   │   │   │   ├── featureGrid/
│   │   │   │   │   │   ├── FeatureGrid.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── AppFooter.jsx
│   │   │   │   │   ├── AppHeader.jsx
│   │   │   │   │   ├── AppShell.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button/
│   │   │   │   │   │   ├── Button.jsx
│   │   │   │   │   │   ├── button.styles.js
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── container/
│   │   │   │   │   │   ├── Container.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── section/
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── Section.jsx
│   │   │   │   │   ├── typography/
│   │   │   │   │   │   ├── Heading.jsx
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── Text.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── index.js
│   │   │   │   └── ScrollToTop.jsx
│   │   │   ├── config/
│   │   │   │   ├── index.js
│   │   │   │   └── platform.js
│   │   │   ├── utils/
│   │   │   │   ├── index.js
│   │   │   │   ├── styles.js
│   │   │   │   └── validateIdeationInput.js
│   │   │   ├── index.js
│   │   │   └── MetaDataInsert.jsx
│   │   ├── modules/
│   │   │   ├── ideations/
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
│   │   │   │   │   └── index.js
│   │   │   │   ├── routes/
│   │   │   │   │   ├── ideation.routes.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── services/
│   │   │   │   │   ├── ideation.api.js
│   │   │   │   │   └── index.js
│   │   │   │   └── index.js
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.development
│   ├── .env.example
│   ├── .env.production
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
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
│   │   │   └── ideation.rest
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
