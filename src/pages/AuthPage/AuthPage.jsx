import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/AuthProvider";
import { AnnouncedLink, useAnnouncedNavigate } from "../../navigation-accessibility";
import api from "../../utils/api";
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
	const navigate = useAnnouncedNavigate();
	const { login } = useAuth();

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
		} catch {
			// do something
		}
	}

	async function handleRegister(ev) {
		ev.preventDefault();
		try {
			const { data } = await api("post", "/users/register", values);
			// TODO store the JWT token, etc
			navigate("/explore");
		} catch {
			// do something
		}
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
