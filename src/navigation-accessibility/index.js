import AccessibleNavProvider, { useAccessibleNav } from "./AccessibleNavProvider/AccessibleNavProvider";
import AnnouncedLink from "./AnnouncedLink/AnnouncedLink";
import AnnouncedNavLink from "./AnnouncedNavLink/AnnouncedNavLink";
import AnnouncedNavigate from "./AnnouncedNavigate/AnnouncedNavigate";
import { useAnnouncedNavigate } from "./hooks/useAnnouncedNavigate";

// barrel module; makes importing these components & hooks less cumbersome

export {
	AccessibleNavProvider,
	AnnouncedLink,
	AnnouncedNavLink,
	AnnouncedNavigate,

	useAccessibleNav,
	useAnnouncedNavigate
};