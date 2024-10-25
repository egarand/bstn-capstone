import { AnnouncedLink } from '../../navigation-accessibility';
import Button from '../Button/Button';
import Input from '../Input/Input';
import "./AuthForm.scss";

function AuthForm({ forSignup = false, values, onInputChange, onSubmit }) {
	return (
	<form className="auth-form" onSubmit={onSubmit}>
		<Input
			type="email"
			name="email"
			value={values.email}
			onChange={onInputChange}
			required={true}
			placeholder="Email"
			label="Email"/>
		<Input
			type="password"
			name="password"
			value={values.password}
			onChange={onInputChange}
			required={true}
			placeholder="Password"
			label="Password"/>

		{forSignup || (
		<p className="auth-form__register">
			Don&apos;t have an account?&nbsp;
			<AnnouncedLink
				className="auth-form__register-link"
				to="/register"
			>
				Sign up here.
			</AnnouncedLink>
		</p>)}

		<Button className="auth-form__submit-btn">Submit</Button>
	</form>
	);
}

export default AuthForm;
