import { Button } from "@/components/ui/button.jsx";
import { Text } from "@/components/ui/typography/Text.jsx";
import { IoClose } from "react-icons/io5";

export default function FormError({ children, clearError }) {
	if (!children) {
		return null;
	}

	return (
		<Text
			className="mb-5 flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
			role="alert"
			aria-live="polite"
		>
			{children}{" "}
			{clearError && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => clearError(null)}
				>
					<IoClose />
				</Button>
			)}
		</Text>
	);
}
