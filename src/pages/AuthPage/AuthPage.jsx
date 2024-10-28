import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import useIsMounted from "../../hooks/useIsMounted";
import { AnnouncedLink, AnnouncedNavigate } from "../../navigation-accessibility";
import DocTitle from "../../components/DocTitle/DocTitle";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import "./AuthPage.scss";

const initialValues = {
	email: "",
	password: ""
}

function AuthPage() {
	const { pathname } = useLocation();
	const { token, login, register } = useAuth();
	const isMounted = useIsMounted();

	const [values, setValues] = useState(initialValues),
		[error, setError] = useState(null);
	const isRegisterPage = useMemo(() =>
		pathname.includes("/register")
	, [pathname]);

	useEffect(() => {
		setValues(initialValues);
		setError(null);
	}, [pathname]);

	function handleInputChange(ev) {
		setError(null);
		const { name, value } = ev.target;
		setValues({ ...values, [name]: value });
	}

	async function handleLogin(ev) {
		ev.preventDefault();
		try {
			await login(values);
		} catch (error) {
			console.error(error);
			if (isMounted.current) {
				setError(error);
			}
		}
	}

	async function handleRegister(ev) {
		ev.preventDefault();
		try {
			await register(values);
		} catch (error) {
			console.error(error);
			if (isMounted.current) {
				setError(error);
			}
		}
	}

	if (token) {
		return <AnnouncedNavigate to="/bookmarks" />;
	}

	return (<section className="auth-page">
		<DocTitle title={isRegisterPage ? "Register" : "Log In"}/>
		<h1 className="auth-page__title">
			{isRegisterPage ? "Register" : "Log In"}
		</h1>

		<ErrorMessage errorObj={error}/>
		<form
			className="auth-page__form"
			onSubmit={isRegisterPage ? handleRegister : handleLogin}
		>
			<Input
				type="email"
				name="email"
				value={values.email}
				onChange={handleInputChange}
				required={true}
				placeholder="Email"
				label="Email"/>
			<Input
				type="password"
				name="password"
				value={values.password}
				onChange={handleInputChange}
				required={true}
				pattern={isRegisterPage ? "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$" : null}
				description={isRegisterPage ? "Must be between 8 and 32 characters and contain 1 number, 1 uppercase letter, and 1 lowercase letter." : null}
				placeholder="Password"
				label="Password"/>

			<p className="auth-page__link-wrapper">
				{isRegisterPage
				? "Already have an account?"
				: "Don't have an account?"}&nbsp;
				<AnnouncedLink
					className="auth-page__link"
					to={isRegisterPage ? "/login" : "/register"}
				>
					{isRegisterPage ? "Log in here." : "Sign up here."}
				</AnnouncedLink>
			</p>

			<Button className="auth-page__submit-btn">Submit</Button>
		</form>
	</section>);
}

export default AuthPage;
