import "./Loader.scss";

/** A themed loader. Provide a `className` and set the `color` to change the colour of the text and animation. */
function Loader({ className, isLoading, loadMessage, errorObj }) {
	return (
		<div className={`loader ${className}`} role="status">
			{isLoading && !errorObj && (<>
				<div className="loader__pawprints"></div>
				<div className="loader__loading-header">
					{loadMessage || "Loading..."}
				</div>
			</>)}
			{errorObj && (<>
				<div className="loader__error-header">Error</div>
				<div className="loader__error-message">{
					errorObj?.statusText
					|| errorObj?.message
					|| "Unknown error, sorry"
				}</div>
			</>)}
		</div>
	);
}

export default Loader;
