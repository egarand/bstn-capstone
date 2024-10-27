import "./SimpleCard.scss";

function SimpleCard({ variant="species", children }) {
	const variantClass = `simple-card--${variant}`;
	return (
		<div className={`simple-card ${variantClass}`}>
			{children}
		</div>
	);
}

export default SimpleCard;
