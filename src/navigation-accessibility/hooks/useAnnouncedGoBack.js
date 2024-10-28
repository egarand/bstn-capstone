import { useCallback } from "react";
import { useNavigate } from "./useNavigate";
import { useAccessibleNav } from "../AccessibleNavProvider/AccessibleNavProvider";

/** A hook that returns a function which can be used to navigate to the
 * previous page.
 * @param {string} fallbackRoute (Default: "/") A fallback route to use if
 *   there's no page on our website in the browser history to go back to.
 * @returns A function that can be called to navigate to the previous page. */
export function useAnnouncedGoBack(fallbackRoute = "/") {
	const { canGoBack } = useAccessibleNav();
	const navigate = useNavigate();

	return useCallback(() => {
		if (canGoBack) {
			navigate(-1, { replace: true });
		} else {
			navigate(fallbackRoute, { replace: true });
		}
	}, [canGoBack, fallbackRoute, navigate]);
}
