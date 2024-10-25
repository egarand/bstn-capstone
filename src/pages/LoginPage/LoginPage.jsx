import { useState } from "react";
import { useAnnouncedNavigate } from "../../navigation-accessibility";
import api from "../../utils/api";
import DocTitle from "../../components/DocTitle/DocTitle";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./LoginPage.scss";

const initialValues = {
	email: "",
	password: ""
}

function LoginPage() {
	const navigate = useAnnouncedNavigate();
	const [values, setValues] = useState(initialValues);

	function handleInputChange(ev) {
		const { name, value } = ev.target;
		setValues({ ...values, [name]: value });
	}

	async function handleLogin(ev) {
		ev.preventDefault();
		try {
			console.log("loggin away");
			const { data } = await api("post", "/users/login", values);

			// TODO store the JWT token, etc
			navigate("/bookmarks");
		} catch {
			// do something
		}
	}
	return (<section className="login-page">
		<DocTitle title="Log In"/>
		<h1 className="login-page__title">Log In</h1>

		<AuthForm
			values={values}
			onInputChange={handleInputChange}
			onSubmit={handleLogin}/>
	</section>);
}

export default LoginPage;
