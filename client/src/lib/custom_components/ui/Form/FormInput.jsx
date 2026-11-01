import { TextInput } from "../input/index.js";

/**
 * Instead of every form importing Input, we wrap it.
 */
export default function FormInput(props) {
	return <TextInput {...props} />;
}
