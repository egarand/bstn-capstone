import { useState } from "react";
import Icon from "../Icon/Icon";
import "./Input.scss";
import errorSrc from "../../assets/icons/error.svg";

/** A styled text (number, email, date, etc) input. You can pass it any
 * attribute that you would use on an `<input>`, such as `value`. */
function Input({
	type = "text",
	label,
	hideLabel = false,
	description = "",
	onChange,
	onInvalid,
	className ="",
	inputClassName = "",
	...rest
}) {
	const [invalid, setInvalid] = useState(false);
	if (["file","image","submit","button","checkbox","radio","reset","color"].includes(type)) {
		return ("Disallowed input type.");
	}
	if (!label) {
		console.error("Inputs must have a label");
	}
	if (rest.pattern && !description) {
		console.error("Please provide a 'description' prop explaining the required pattern for this field.");
	}

	function handleInvalid(ev) {
		setInvalid(true);
		onInvalid?.(ev);
	}
	function handleChange(ev) {
		setInvalid(true);
		if (ev.target.validity.valid) {
			setInvalid(false);
		}
		// document.createElement("input").validity.
		onChange?.(ev);
	}

	return (
		<label className={`input ${className}`}>
			<span className={hideLabel ? "input__hidden" : "input__label"}>
				{label}
			</span>
			<input
				{...rest}
				className={`input__field ${invalid ? "input__field--invalid" : ""} ${inputClassName}`}
				type={type}
				onChange={handleChange}
				onInvalid={handleInvalid} />
			{invalid && <Icon className="input__error" src={errorSrc} alt=""/>}
			<small className="input__description">{description}</small>
		</label>
	);
}

export default Input;
