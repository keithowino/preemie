import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = path.join(ROOT, "docs", "folder-structure.md");

/**
 * Directories and files to ignore
 */
const IGNORE = [
	"node_modules",
	".git",
	".next",
	"dist",
	"build",
	"coverage",
	".env",
	".cache",
	".vscode",
	".idea",
	"*.log",
	"package-lock.json",
	"yarn.lock",
	"pnpm-lock.yaml",
	".DS_Store",
	"*.test.js",
	"*.spec.js",
	"*.test.ts",
	"*.spec.ts",
	"*.map",
	"*.min.js",
	"*.min.css",

	"trash",
	"rest_tests",
	"tests",
	"prompts",
	"docs",
];

function shouldIgnore(filePath) {
	const relativePath = path.relative(ROOT, filePath);
	const parts = relativePath.split(path.sep);

	return parts.some((part) =>
		IGNORE.some((pattern) => {
			if (pattern.includes("*")) {
				const escapedPattern = pattern
					.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
					.replace(/\*/g, ".*");

				return new RegExp(`^${escapedPattern}$`).test(part);
			}

			return part === pattern;
		}),
	);
}

function generateTree(dir, prefix = "", output = []) {
	const items = fs
		.readdirSync(dir)
		.filter((item) => !shouldIgnore(path.join(dir, item)))
		.sort((a, b) => {
			const aPath = path.join(dir, a);
			const bPath = path.join(dir, b);

			const aIsDir = fs.statSync(aPath).isDirectory();
			const bIsDir = fs.statSync(bPath).isDirectory();

			if (aIsDir && !bIsDir) return -1;
			if (!aIsDir && bIsDir) return 1;

			return a.localeCompare(b);
		});

	items.forEach((item, index) => {
		const fullPath = path.join(dir, item);
		const isDir = fs.statSync(fullPath).isDirectory();
		const isLastItem = index === items.length - 1;

		const connector = isLastItem ? "└── " : "├── ";

		output.push(`${prefix}${connector}${item}${isDir ? "/" : ""}`);

		if (isDir) {
			const newPrefix = prefix + (isLastItem ? "    " : "│   ");

			// Recursively traverse every directory that is not ignored.
			generateTree(fullPath, newPrefix, output);
		}
	});

	return output;
}

/**
 * Generate markdown
 */
function generateMarkdown(tree) {
	const header = `# Preemie Folder Structure

Generated on: ${new Date().toISOString().split("T")[0]}

\`\`\`bash
${tree.join("\n")}
\`\`\`
`;

	return header;
}

/**
 * Main execution
 */
const tree = generateTree(ROOT);
const markdown = generateMarkdown(tree);

/**
 * Ensure docs directory exists
 */
const docsDir = path.join(ROOT, "docs");

if (!fs.existsSync(docsDir)) {
	fs.mkdirSync(docsDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, markdown);
console.log(`✅ Folder structure generated at ${OUTPUT_FILE}`);
