import "./Icon.scss";

/** A square SVG icon which can inherit the `color` of its container. Pass a
 * `className` to control the width or set the `color` manually. */
function Icon({ src, className = "", alt = "" }) {
	return (
		<div
			style={{ maskImage: `url(${src})` }}
			className={`icon ${className}`}
			role="img"
			aria-label={alt}
		>{alt}</div>
	);
}

export default Icon;
