export function getId(value) {
	if (!value) return null;

	return value?._id?.toString?.() ?? value?.id ?? value?.toString?.() ?? null;
}

export function isPopulated(value, property) {
	return value && typeof value === "object" && property in value;
}
