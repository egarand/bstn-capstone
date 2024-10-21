import { Children, cloneElement } from "react";
import "./CheckboxGroup.scss";

function CheckboxGroup({ name, values, onChange, children }) {

	function onCheckboxChange(val, ev) {
		ev.target.checked
		? onChange(values.concat(val))
		: onChange(values.filter(v => v !== val));
	}

	// This is passing the name, onChange, and selected state of the group down
	// to its child components so that they can be controlled
	const boxes = Children.map(
		children,
		(child) => cloneElement(
			child, {
				...child.props,
				name,
				onChange: onCheckboxChange.bind(null, child.props.value),
				checked: values ? values.indexOf(child.props.value) >= 0 : false
			}
		)
	);

	return <>{boxes}</>;
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
