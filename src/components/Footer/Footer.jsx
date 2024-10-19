import Logo from "../Logo/Logo";
import Icon from "../Icon/Icon";
import "./Footer.scss";
import githubSrc from "../../assets/icons/github.svg";
import linkedinSrc from "../../assets/icons/linkedin.svg";
import mailSrc from "../../assets/icons/mail.svg";
import inatSrc from "../../assets/icons/inaturalist.svg";
import seekSrc from "../../assets/icons/seek.svg";
import osmSrc from "../../assets/icons/osm-mono.svg";

function Footer() {
	return (
	<footer className="footer">
		<div className="footer__sections-wrapper">
			<section className="footer__section footer__section--first">
				<Logo className="footer__logo"/>
				<small className="footer__copyright">&copy; E. Garand {(new Date()).getFullYear()}</small>
			</section>
			<section className="footer__section">
				<h2 className="footer__subheading">Get in Touch</h2>
				<a className="footer__link" target="blank" href="https://github.com/egarand">
					<Icon className="footer__icon" alt="" src={githubSrc}/>
					Github
				</a>
				<a className="footer__link" target="blank" href="https://linkedin.com/in/erica-garand">
					<Icon className="footer__icon" alt="" src={linkedinSrc}/>
					LinkedIn
				</a>
				<a className="footer__link" target="blank" href="mailto:egarand13@outlook.com">
					<Icon className="footer__icon" alt="" src={mailSrc}/>
					Email
				</a>
			</section>

			<section className="footer__section">
				<h2 className="footer__subheading">Get Involved</h2>
				<a className="footer__link" target="blank" href="https://inaturalist.org/">
					<Icon src={inatSrc} className="footer__icon" alt="" />
					iNaturalist
				</a>
				<a className="footer__link" target="blank" href="https://www.inaturalist.org/pages/seek_app">
					<Icon src={seekSrc} className="footer__icon" alt="" />
					Seek
				</a>
				<a className="footer__link" target="blank" href="https://openstreetmap.org/">
					<Icon src={osmSrc} className="footer__icon" alt="" />
					OpenStreetMap
				</a>
			</section>
		</div>
	</footer>
	);
}

export default Footer;
