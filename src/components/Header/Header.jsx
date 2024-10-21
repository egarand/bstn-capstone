import { useState } from "react";
import { AnnouncedLink, AnnouncedNavLink } from "../../navigation-accessibility";
import Logo from "../Logo/Logo";
import IconButton from "../IconButton/IconButton";
import Button from "../Button/Button";

import "./Header.scss";
import menuSrc from "../../assets/icons/menu.svg";
import closeSrc from "../../assets/icons/close.svg";

function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const base = "header__navlink";
	const navLinkClasses =
		(active) => `${base} ${active ? `${base}--active` : ""}`;

	function toggleMobileNav() {
		setMobileMenuOpen(!mobileMenuOpen);
	}

	return (
	<header className="header">
		<AnnouncedLink to="/" className="header__logo">
			<Logo alt="Hike & Seek home"/>
		</AnnouncedLink>
		<IconButton
			iconSrc={mobileMenuOpen ? closeSrc : menuSrc}
			className="header__menu-btn"
			text={`${mobileMenuOpen ? "Close" : "Open"} main menu`}
			title={`${mobileMenuOpen ? "Close" : "Open"} main menu`}
			aria-haspopup="menu"
			aria-expanded={mobileMenuOpen}
			onClick={toggleMobileNav}/>
		<nav className={`header__nav ${mobileMenuOpen ? "header__nav--mobile-open" : ""}`}>
			<AnnouncedNavLink to="/explore" className={navLinkClasses}>
				Explore
			</AnnouncedNavLink>
			<AnnouncedNavLink to="/contribute" className={navLinkClasses}>
				Contribute
			</AnnouncedNavLink>
			<Button to="/login" className="header__login">Log In</Button>
		</nav>
	</header>
	);
}

export default Header;
