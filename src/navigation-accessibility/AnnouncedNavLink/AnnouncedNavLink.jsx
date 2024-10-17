import { useMatch } from "react-router-dom";
import AnnouncedLink from "../AnnouncedLink/AnnouncedLink";

/** An extension of `<AnnouncedLink>` which knows if the current route is a
 * match to it, and can be styled based on that state. It also informs screen
 * reader users of impending page navigation.
 *
 * By default, its classes are "navlink" for the regular state, and
 * "navlink navlink--active" for when the link goes to the current route.
 * You can change this by passing a callback function with one parameter
 * named `isActive` to the `className` prop; this function should return a
 * different string of class name(s) based on whether `isActive` is true or false. */
function AnnouncedNavLink({
	to,
	className = (isActive) => `navlink ${isActive ? "navlink--active" : ""}`,
	mustBeExact = false,
	"aria-current": ariaCurrentProp = "page",
	children,
	...rest
}) {
	const match = useMatch({
		path: to,
		caseSensitive: false,
		end: mustBeExact
	});
	const ariaCurrent = (match ? ariaCurrentProp : undefined);

	return (
		<AnnouncedLink {...rest} to={to} className={className(match)} aria-current={ariaCurrent}>
			{children}
		</AnnouncedLink>
	);
}

export default AnnouncedNavLink;
