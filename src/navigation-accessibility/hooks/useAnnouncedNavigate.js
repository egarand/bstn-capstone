import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessibleNav } from "../AccessibleNavProvider/AccessibleNavProvider";

/** An extension of react router's `useNavigate` which will load the chosen route, while also announcing the reload to screen reader users.
 * @see `useNavigate` from react-router-dom */
export function useAnnouncedNavigate() {
	const {setAnnouncement, userHasNavigated} = useAccessibleNav();
	const navigate = useNavigate();

	return useCallback((to, options = {}) => {
		userHasNavigated();
		setAnnouncement("Loading new page...");
		navigate(to, options);
	}, [setAnnouncement, userHasNavigated, navigate]);
}