import { forwardRef } from "react";
import { useHref, useLinkClickHandler } from "react-router-dom";
import { useAccessibleNav } from "../AccessibleNavProvider/AccessibleNavProvider";

/** An extension of react router's `<Link>` which informs screen reader users
 * of impending page navigation. */
const AnnouncedLink = forwardRef(({
	to,
	onClick,
	target,
	replace = false,
	state,
	preventScrollReset,
	children,
	...rest
}, ref) => {
	const href = useHref(to);
	const handleClick = useLinkClickHandler(to, { replace, state, target, preventScrollReset });
	const {setAnnouncement, userHasNavigated} = useAccessibleNav();

	return (
		<a
			{...rest}
			href={href}
			ref={ref}
			target={target}
			onClick={(ev) => {
				ev.preventDefault();
				userHasNavigated();
				setAnnouncement("Loading new page...");
				onClick?.(ev);
				handleClick(ev);
			}}
		>{children}</a>
	);
});
AnnouncedLink.displayName = "AnnouncedLink";

export default AnnouncedLink;
