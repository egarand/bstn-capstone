import { useLayoutEffect } from "react";

/** Prefixes the default document title (determined by index.html) with a custom string. */
function DocTitle({ title }) {
	useLayoutEffect(() => {
		const prevTitle = document.title;
		document.title = `${title} - ${prevTitle}`;
		return () => { document.title = prevTitle; }
	}, [title]);
	return <></>;
}

export default DocTitle;
