import Button from "../../components/Button/Button";

import "./HomePage.scss";
import sandpiperSrc from "../../assets/icons/sandpiper.svg";
import compassSrc from "../../assets/icons/compass.svg";
import frogSrc from "../../assets/icons/frogprints.svg";
import Icon from "../../components/Icon/Icon";
import DocTitle from "../../components/DocTitle/DocTitle";

function HomePage() {
	return (<article className="home-page">
		<section className="home-page__hero">
			<DocTitle title="Home"/>
			<h1 className="home-page__title">
				Discover Your<br/>
				Next Adventure
			</h1>
			<div className="home-page__hero-body">
				<p className="home-page__hero-copy">The great outdoors is right in your backyard — what will you find out there?</p>
				<Button className="home-page__hero-btn" to="/explore">
					Explore
				</Button>
			</div>

		</section>
		<section className="home-page__section">
			<div className="home-page__img-wrapper">
				<Icon className="home-page__img" src={compassSrc} alt="compass" />
			</div>
			<div className="home-page__section-body">
				<h2 className="home-page__subheading">Find Your Next Favourite Trail</h2>
				<p className="home-page__copy">
					Whether you&apos;re a seasoned hiker or just looking for a place
					to unwind, we&apos;ll help you find the perfect spot to relax
					and reconnect with nature. Search for local hiking trails, campgrounds, and nature reserves, all in one place.
				</p>
			</div>
		</section>
		<section className="home-page__section">
			<div className="home-page__img-wrapper">
				<Icon className="home-page__img" src={sandpiperSrc} alt="sandpiper"/>
			</div>
			<div className="home-page__section-body">
				<h2 className="home-page__subheading">Learn About Wildlife Along The Way</h2>
				<p className="home-page__copy">
					Select a location and find out what critters you can see in the
					area. When you go there, keep your eyes peeled! Every
					outing is an opportunity to see something new.
				</p>
			</div>
		</section>
		<section className="home-page__section">
			<div className="home-page__img-wrapper">
				<Icon className="home-page__img" src={frogSrc} alt="frog footprints"/>
			</div>
			<div className="home-page__section-body">
				<h2 className="home-page__subheading">Never Lose Track Of Your Best Finds</h2>
				<p className="home-page__copy">
					If you sign up for an account, you can easily bookmark your
					favourite locations. Curate your own list of scenic spots and
					hidden wildlife havens, and check back later to see what animals
					and plants you can find there at different times of year.
				</p>
			</div>
		</section>
	</article>);
}

export default HomePage;
