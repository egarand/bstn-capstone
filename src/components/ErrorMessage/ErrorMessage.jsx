import { useMemo } from "react";
import Icon from "../Icon/Icon";
import "./ErrorMessage.scss";
import errorSrc from "../../assets/icons/error.svg";
import { errorMessage } from "../../utils";

function ErrorMessage({ errorObj }) {
	const error = useMemo(() =>
		!!errorObj && errorMessage(errorObj)
	, [errorObj]);

	return (
		<div className="error-message" role="alert">
			<Icon className="error-message__icon" src={errorSrc} alt=""/>
			<div className="error-message__body">
				{error && <><strong>Error:</strong> {error}</>}
			</div>

		</div>
	);
}

export default ErrorMessage;
