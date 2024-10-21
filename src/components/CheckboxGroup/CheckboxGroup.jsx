import { Children, cloneElement, useCallback, useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import "./CheckboxGroup.scss";
import errorSrc from "../../assets/icons/error.svg";

function CheckboxGroup({ name, values, onChange, required = false, label, className = "", children }) {
	const [invalid, setInvalid] = useState(!required);
	const [showInvalid, setShowInvalid] = useState(false);
	const ref = useRef(null);

	// Custom validation; HTML5 has no native way to validate that at least one
	// of a set of checkboxes must be checked.
	const validate = useCallback((vals) => {
		if (required && vals.length === 0) {
			ref.current.querySelectorAll('input[type="checkbox"]').forEach((box) => {
				box.setCustomValidity("You must check at least one checkbox from this group.");
			});
			setInvalid(true);
		} else {
			ref.current.querySelectorAll('input[type="checkbox"]').forEach((box) => {
				box.setCustomValidity("");
			});
			setInvalid(false);
			setShowInvalid(false);
		}
	}, [required]);

	useEffect(() => validate(values), [values, validate]);
	useEffect(() => {
		ref.current.querySelectorAll('input[type="checkbox"]')
			.forEach((box)=> showInvalid
							? box.classList.add("checkbox__input--invalid")
							: box.classList.remove("checkbox__input--invalid")
			);
	}, [showInvalid]);

	function onCheckboxChange(val, ev) {
		const newValues =
			ev.target.checked
			? values.concat(val)
			: values.filter(v => v !== val);
		validate(newValues);
		setShowInvalid(false);
		onChange({ target: { name, value: newValues } });
	}

	function onGroupInvalid() {
		validate(values);
		setShowInvalid(true);
	}

	// Passing name, onChange, and checked state to child components so that
	// they can be controlled
	const boxes = Children.map(
		children,
		(child) => cloneElement(
			child, {
				...child.props,
				name,
				onChange: onCheckboxChange.bind(null, child.props.value),
				onInvalid: onGroupInvalid,
				checked: values ? values.indexOf(child.props.value) >= 0 : false
			}
		)
	);

	return (
	<fieldset className={`checkbox-group ${className}`} aria-required={required} aria-invalid={invalid} onInvalid={onGroupInvalid} ref={ref}>
		<legend className="checkbox-group__legend">{label}</legend>
		{showInvalid && <Icon className="checkbox-group__error" src={errorSrc} alt=""/>}
		{boxes}
	</fieldset>);
}

function Checkbox({ value, disabled, name, onChange, checked, label, ...rest }) {
	return (
	<label className="checkbox">
		<input
			{...rest}
			className="checkbox__input"
			type="checkbox"
			name={name}
			value={value}
			disabled={disabled}
			checked={checked}
			onChange={onChange} />
		{label}
	</label>
	);
}
CheckboxGroup.Checkbox = Checkbox;

export default CheckboxGroup;
