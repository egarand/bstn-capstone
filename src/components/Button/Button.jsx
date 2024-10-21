import "./Button.scss";
import { AnnouncedLink } from "../../navigation-accessibility";

/** A CTA button. By default, renders as a `<button>`. If you provide a `to`
 * prop with a route, it will be rendered as an `<AnnouncedLink>` element that
 * goes to that route.
 * - The `variant` prop controls the style of the button. `"primary"` (default) renders an orange button; `"secondary"` makes it white.
 * - You can provide a `className` prop to further customize styling. */
function Button({ to = null, onClick, variant = "primary", className = "", children }) {
	const TagName = to ? AnnouncedLink : "button";
	const variantClass = variant ? `cta-button--${variant}` : "";
	return (
		<TagName
			to={to}
			onClick={onClick}
			className={`cta-button ${variantClass} ${className}`}
		>
			{children}
		</TagName>
	);
}

export default Button