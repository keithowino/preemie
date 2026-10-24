# Preemie Folder Structure

Generated on: 2026-10-24

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
│   │   │   │   │   └── index.js
│   │   │   │   ├── routes/
│   │   │   │   │   ├── ideation.routes.jsx
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
│   │   │   │   │   ├── validation/
│   │   │   │   │   │   ├── index.js
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
│   │   │   └── index.js
│   │   └── index.js
│   ├── tests/
│   │   ├── rest/
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
