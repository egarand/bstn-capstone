import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Announcement from "../Announcement/Announcement";
import "./AccessibleNavProvider.scss";

const AccessibleNavContext = createContext(null);

/** When used as the root for an app:
 * - Creates a skip-to-main content link as the first element in the page
 * - Enables the announcement of navigation events to assistive technology
 * - Sets focus to an element at the top of the page after navigation
 *
 * @typedef AccessibleNavProviderProps
 * @property {React.JSX.Element} children
 * @property {string} pageTopID (optional) The ID which will be used to manually
 *   override which element in a page should be treated as the top. By default,
 *   the first `<h1>` is assumed to be the page top, so use of this is optional.
 * @property {string} skipLinkClass (optional) A set of css class names to pass
 *   to the skip-to-main link to customize its look. */
export default function AccessibleNavProvider({ children, pageTopID = "main", skipLinkClass = "" }) {
	const [announcement, setAnnouncement] = useState("");
	const isFirstLoad = useRef(true),
		skipLinkRef = useRef(null);
	const location = useLocation();

	function userHasNavigated() {
		isFirstLoad.current = false;
	}

	const refocusPageTop = useCallback(() => {
		const focusEl =
			document.querySelector(`#${pageTopID}`)
			?? document.querySelector("h1")
			?? skipLinkRef.current;
		focusEl.focus();
		if (focusEl !== document.activeElement){
			focusEl.setAttribute("tabindex", "-1");
			focusEl.focus();
		}
	}, [pageTopID]);

	useEffect(() => {
		// ensure skip-to-main link goes somewhere useful
		document.querySelector("main").removeAttribute("id");
		const mainEl =
			document.querySelector(`#${pageTopID}`)
			?? document.querySelector("h1")
			?? document.querySelector("main");
		mainEl.setAttribute("id", pageTopID);

		// only manage focus & announcement if we've internally navigated
		if (!isFirstLoad.current) {
			refocusPageTop();
			setAnnouncement("");
		}
	}, [location, setAnnouncement, pageTopID, refocusPageTop]);

	return (<>
		<a className={`skip-link ${skipLinkClass}`} href={`#${pageTopID}`} ref={skipLinkRef}>Skip to Main Content</a>
		<AccessibleNavContext.Provider value={{
			setAnnouncement,
			refocusPageTop,
			userHasNavigated,
			get canGoBack(){ return !isFirstLoad.current }
		}}>
			{children}
		</AccessibleNavContext.Provider>
		<Announcement>{announcement}</Announcement>
	</>);
}

/** Used to access the tools from the Accessible Nav Context.
 * - `setAnnouncement`: send an immediate announcement to assistive technology.
 * - `refocusPageTop`: reset keyboard focus to the top of the page.
 * - `userHasNavigated`: flip a switch that tracks if this is the app's first load or not.
 * - `canGoBack`: true if the user has navigated, ie if this is not the first load.
 */
export function useAccessibleNav() {
	const context = useContext(AccessibleNavContext);

	if (context === undefined) {
		throw new Error("useAccessibleNav must be used within an AccessibleNavProvider");
	}

	return context;
}
