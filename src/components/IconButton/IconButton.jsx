import "./IconButton.scss";

/** Accessible icon button, with fallback text for screen readers and for when
 * the image fails to load. Provide class names to adjust the button and icon
 * styling. */
function IconButton({ text = "", iconSrc = "", onClick, className = "", ...rest }) {
	function showText(ev) {
		console.log("show txt ev", ev);

		ev.target.nextSibling.classList.remove("icon-btn__hidden");
		ev.target.classList.add("icon-btn__hidden");
	}
	function showImage(ev) {
		ev.target.nextSibling.classList.add("icon-btn__hidden");
		ev.target.classList.remove("icon-btn__hidden");
	}
	return (
		<button {...rest} className={`icon-btn ${className}`} onClick={onClick}>
			<img
				className="icon-btn__icon"
				alt=""
				src={iconSrc}
				onError={showText}
				onLoad={showImage} />
			<span className="icon-btn__text icon-btn__hidden">{text}</span>
		</button>
	);
}

export default IconButton;
