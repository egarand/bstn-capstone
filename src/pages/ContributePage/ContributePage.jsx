import "./ContributePage.scss";
import inatSrc from "../../assets/logo/inaturalist.svg";
import seekSrc from "../../assets/logo/seek-full.svg";
import osmSrc from "../../assets/logo/osm-full.svg";

const initiatives = [
	{
		name: "iNaturalist",
		logo: inatSrc,
		desc: "iNaturalist is a platform for identifying the plants and animals around you, while generating research data for science and conservation.\nStart recording your observations today to learn about life and help scientists to better understand and protect nature.",
		link: "https://inaturalist.org/",
		cta: "Join the community!"
	},
	{
		name: "Seek",
		logo: seekSrc,
		desc: "Identify wildlife on the go with the Seek app from iNaturalist! Just point your phone camera at the plants, animals, and fungi around you to learn more about them.\nYou can even earn badges for observing different species and participating in challenges!",
		link: "https://inaturalist.org/pages/seek_app",
		cta: "Start seeking today!"
	},
	{
		name: "OpenStreetMap",
		logo: osmSrc,
		desc: "OSM is dedicated to creating the best map dataset in the world, powered by a thriving community of collaborators. Their data is freely available under an open license and anyone can contribute!\nJoin in and map the things you care about to help build a better map for all.",
		link: "https://openstreetmap.org/",
		cta: "Get involved!"
	}
];

function ContributePage() {
	return (<>
	<section className="contribute__intro">
		<h1 className="contribute__title">
			Your Map, Your Observations —&nbsp;
			<span className="contribute__title--hightlight">
				Your Impact
			</span>
		</h1>
		<p className="contribute__intro-body">Hike & Seek is powered by open source databases. These incredible projects thrive on community support and contributions — so while you&apos;re off adventuring, why not dive in, lend a hand, and help them build something amazing?</p>
	</section>
	<div className="contribute__card-wrapper">
		{initiatives.map((init) => (
		<section key={init.name} className="contribute__card">
			<h2 className="contribute__card-header">
				<img className="contribute__card-logo" alt="" src={init.logo}/>
				{init.name}
			</h2>
			{init.desc.split("\n").map((p,i) => (
				<p key={i} className="contribute__card-body">{p}</p>
			))}
			<a className="contribute__card-cta" target="blank" href={init.link}>{init.cta}</a>
		</section>
		))}
	</div>
	</>);
}

export default ContributePage;
