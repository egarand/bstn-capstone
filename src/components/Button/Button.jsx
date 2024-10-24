import "./Button.scss";
import { AnnouncedLink } from "../../navigation-accessibility";

/** A CTA button. By default, renders as a `<button>`. If you provide a `to`
 * prop with a route, it will be rendered as an `<AnnouncedLink>` element that
 * goes to that route. If you provide a `href` prop with a URL, it will be rendered as an `<a>` with `target="blank"` that links to that external page.
 * - The `variant` prop controls the style of the button. `"primary"` (default) renders an orange button; `"secondary"` makes it white.
 * - You can provide a `className` prop to further customize styling. */
function Button({ onClick, to = null, href = null, variant = "primary", className = "", children, ...rest }) {
	const TagName = to ? AnnouncedLink : href ? "a" : "button";
	const variantClass = variant ? `cta-button--${variant}` : "";
	return (
		<TagName
			{...rest}
			to={to}
			href={href}
			target={href ? "blank" : null}
			onClick={onClick}
			className={`cta-button ${variantClass} ${className}`}
		>
			{children}
		</TagName>
	);
}

export default Button