import { forwardRef } from "react";

const Section = forwardRef(function Section({ children, className = "" }, ref) {
	return (
		<section ref={ref} className={`space-y-5 ${className}`}>
			{children}
		</section>
	);
});

export default Section;
