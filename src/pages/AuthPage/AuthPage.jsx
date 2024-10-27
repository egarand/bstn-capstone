import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { AnnouncedLink, AnnouncedNavigate } from "../../navigation-accessibility";
import DocTitle from "../../components/DocTitle/DocTitle";
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

	const [values, setValues] = useState(initialValues);
	const isRegisterPage = useMemo(() =>
		pathname.includes("/register")
	, [pathname]);

	useEffect(() => setValues(initialValues), [pathname]);

	function handleInputChange(ev) {
		const { name, value } = ev.target;
		setValues({ ...values, [name]: value });
	}

	async function handleLogin(ev) {
		ev.preventDefault();
		try {
			login(values);
		} catch (error) {
			console.error(error);
		}
	}

	async function handleRegister(ev) {
		ev.preventDefault();
		try {
			register(values);
		} catch (error) {
			console.error(error);
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
