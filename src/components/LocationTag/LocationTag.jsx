import Icon from "../Icon/Icon";
import "./LocationTag.scss";

function LocationTag({ name, value, icon = null }) {
	let printName, printValue;
	switch (name) {
		case "website":
			printName = "Website";
			printValue = (
				<a className="location-tag__link"
				target="blank" href={value}>
					Go to External Site
				</a>);
			break;
		case "fee":
			printName = "Entry Fee?";
			printValue = feeTagVal();
			break;
		case "wheelchair":
			printName = "Wheelchair Accessible?";
			printValue = wheelchairTagVal();
			break;
		case "dog":
			printName = "Dogs Allowed?";
			printValue = dogTagVal();
			break;
		default:
			printName = name;
			printValue = value;
	}

	function feeTagVal() {
		switch (value) {
			case "yes": return "Yes";
			case "no": return "No";
			default: return "Unknown";
		}
	}

	function wheelchairTagVal() {
		switch (value) {
			case "yes": return "Yes; fully accessible";
			case "limited": return "Yes; partial access";
			case "no": return "No";
			default: return "Unknown";
		}
	}

	function dogTagVal() {
		switch (value) {
			case "yes":
			case "unleashed":
				return "Yes; follow local leashing laws";
			case "leashed": return "Yes; must be leashed";
			case "outside": return "Only in outside areas";
			case "no": return "No";
			default: return "Unknown; most likely yes, but check";
		}
	}

	return (
		<div className="location-tag">
			<dt className="location-tag__title">
				{icon &&
					<Icon className="location-tag__icon"
						src={icon}
						alt=""/>
				}
				{printName}
			</dt>
			<dd className="location-tag__content">
				{printValue}
			</dd>
		</div>
	);
}

export default LocationTag;
