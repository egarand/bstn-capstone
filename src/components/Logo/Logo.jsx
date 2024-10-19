import "./Logo.scss";

/** The Hike & Seek logo, colorizable with CSS. By default, inherits the `color`
 * of its container. Pass a `className` to control the width and set the `color`. */
function Logo({ className = "", alt = "Hike & Seek" }) {
	return (
		<div
			className={`logo ${className}`}
			role="img"
			aria-label={alt}
		>{alt}</div>
	);
}

export default Logo;
