import Button from "../button/Button.jsx";
import { Text } from "../typography/index.js";
import { IoClose } from "react-icons/io5";

export default function FormError({ children, clearError }) {
	if (!children) {
		return null;
	}

	return (
		<Text
			className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
			role="alert"
		>
			{children}{" "}
			{clearError && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => clearError("")}
				>
					<IoClose />
				</Button>
			)}
		</Text>
	);
}
