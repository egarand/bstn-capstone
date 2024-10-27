import { createContext, useContext, useEffect, useState } from "react";
import { useAnnouncedNavigate } from "../../navigation-accessibility";
import { trycatch } from "../../utils";
import { api } from "../../utils/api";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
	const navigate = useAnnouncedNavigate();
	const [token, setToken] = useState(null);

	useEffect(() => {
		const oldToken = trycatch(() =>
			localStorage.getItem("user_token")
		);
		if (oldToken) {
			const decoded = JSON.parse(atob(oldToken.split(".")[1]));
			const now = Date.now() / 1000;
			if (decoded.exp > now) {
				setToken(oldToken);
			}
		}
	}, []);

	async function login(credentials) {
		const { data } = await api("post", "/users/login", credentials);
		setToken(data.token);
		localStorage.setItem("user_token", data.token);
		navigate("/bookmarks");
	}

	function logout() {
		setToken(null);
		trycatch(() => localStorage.removeItem("user_token"));
		navigate("/login");
	}

	return (
	<AuthContext.Provider value={{ token, login, logout }}>
		{children}
	</AuthContext.Provider>);
}

export default AuthProvider;

export function useAuth() {
	return useContext(AuthContext);
}
