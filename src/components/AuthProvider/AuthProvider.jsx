import { createContext, useContext, useState } from "react"
import { useAnnouncedNavigate } from "../../navigation-accessibility";
import { trycatch } from "../../utils";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
	const navigate = useAnnouncedNavigate();
	const [user, setUser] = useState(null),
		[token, setToken] = useState(null);

	async function login(credentials) {
		try {
			setUser(credentials);
			// localStorage.setItem("user_token", token);
			navigate("/bookmarks");
		} catch (error) {
			throw new Error(error.statusText || error.message);
		}
	}

	function logout() {
		setUser(null);
		setToken("");
		trycatch(() => localStorage.removeItem("user_token"));
		navigate("/");
	}

	return (
	<AuthContext.Provider value={{ token, user, login, logout }}>
		{children}
	</AuthContext.Provider>);
}

export default AuthProvider;

export function useAuth() {
	return useContext(AuthContext);
}
