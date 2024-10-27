import { Outlet } from "react-router-dom";
import { useAuth } from "../AuthProvider/AuthProvider"
import { AnnouncedNavigate } from "../../navigation-accessibility";

/** Use as the element for a pathless wrapper route around
 * authenticated-only routes to guard them from unauthenticated users. */
function ProtectedRoute() {
	const { token } = useAuth();
	if (!token) {
		return <AnnouncedNavigate to="/login"/>;
	}
	return <Outlet/>;
}

export default ProtectedRoute;
