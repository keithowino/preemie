## Vite + React + Tailwindcss v4 + Shadcn Manual Setup

> **Goal:** support registries.

### 1. Scaffold a standard Vite JavaScript project

```bash
npm create vite@latest shadcn-vite-js -- --template react
cd shadcn-vite-js
npm install
```

### 2. Install and configure Tailwind CSS v4

Tailwind v4 uses a Vite plugin and a single CSS import, removing the need for tailwind.config.js and postcss.config.js .

```bash
npm install tailwindcss @tailwindcss/vite
```

Update your vite.config.js to include the Tailwind plugin. You also need to add the path alias here for Vite to resolve imports correctly.

```text
~\client\vite.config.js
```

```js
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
});
```

### 3. Update the global CSS file

For now, replace its contents with:

```css
@import "tailwindcss";
```

### 4. Create jsconfig.json for the shadcn CLI

Since you are using JavaScript, the shadcn CLI reads jsconfig.json instead of tsconfig.json to resolve the @/ alias . Create this file in your project root:

```text
~\client\jsconfig.json
```

```json
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@/*": ["./src/*"]
		}
	}
}
```

### 5. Initialize shadcn and force JavaScript output

Run the init command. It may warn about missing TypeScript config, but it will proceed using your jsconfig.json.

```bash
npx shadcn@latest init
```

If you have a preset from:

```text
https://ui.shadcn.com/create?template=vite
```

such as:

```bash
npx shadcn@latest init --preset b3lDlqdIO --template vite --pointer
```

edit to:

```bash
npx shadcn@latest init --preset b3lDlqdIO --pointer
```
