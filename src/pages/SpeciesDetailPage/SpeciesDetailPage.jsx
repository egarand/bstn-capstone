import { createElement, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import api from "../../utils/api";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import { TileLayer } from "react-leaflet";
import DocTitle from "../../components/DocTitle/DocTitle";
import Button from "../../components/Button/Button";
import "./SpeciesDetailPage.scss";

function SpeciesDetailPage() {
	const { inat_id } = useParams();
	const isMounted = useIsMounted();

	const [species, setSpecies] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const { data: speciesData } = await api("get", `/life/${inat_id}`);
				if (!isMounted.current) { return; }
				setSpecies(() => speciesData);
			} catch {
				// do something
			}
		})();
	}, [inat_id, isMounted]);

	return (
	<section className="species-page" aria-busy={!species}>
		<DocTitle title={species?.common_name || species?.scientific_name}/>
		<div className="species-page__title-wrapper">
			<h1 className="species-page__title">{species?.common_name || species?.scientific_name}</h1>
			{species?.common_name ? <p className="species-page__subtitle">{species?.scientific_name}</p> : null}
		</div>

		<figure className="species-page__photo">
			<img className="species-page__photo-img"
				alt={`A ${species?.common_name}`}
				src={species?.photo.medium_url}/>
			<figcaption className="species-page__photo-caption">
				{species?.photo.attribution.replace("(c)", "©")}
			</figcaption>
		</figure>
		<figure className="species-page__range">
			<ExploreMap className="species-page__range-map" zoom={3} minz={2} maxz={6}>
				<ExploreMap.CenterOnUserOnMount/>
				<TileLayer
					attribution='&copy; <a target="blank" href="https://inaturalist.org/">iNaturalist</a> contributers'
					url={`https://api.inaturalist.org/v1/grid/{z}/{x}/{y}.png?ttl=${86_400}&verifiable=true&taxon_id=${species?.id}`}
					minZoom={2}
					maxZoom={6}
					updateInterval={2000}
					keepBuffer={8}/>
					{/* Settings intended to minimize requests to iNat's API. */}
			</ExploreMap>
			<figcaption className="species-page__range-caption">
				Places the {species?.common_name} has been observed
			</figcaption>
		</figure>
		<p className="species-page__wiki-excerpt">
			<WikiExcerpt
				wiki={species?.wikipedia_excerpt}
				speciesId={species?.id}/>
		</p>
		<Button className="species-page__wiki-link" href={species?.wikipedia_url}>
			Read more on Wikipedia
		</Button>
	</section>);
}

export default SpeciesDetailPage;

/** Parses HTML-string wikipedia excerpts into JSX, keeping the formatting of
 * the `<b>` and `<i>` tags.
 *
 * A library would be overkill since its fairly simple and only done here,
 * and other options could leave XSS loopholes. */
function WikiExcerpt({ wiki, speciesId }) {
	if (!wiki) { return null; }
	const parser = new DOMParser();
	let wikiTree = parser.parseFromString(wiki, "text/html");
	let count = 0;

	/** Traverse an HTML tree and convert it to JSX; only `<b>` and
	 * `<i>` tags are kept, other tags are removed. */
	function createJSX(el) {
		if (el.nodeType === Node.TEXT_NODE || el.childNodes.length === 0) {
			return el.textContent;
		}

		let childJSX = [];
		for (const child of el.childNodes) {
			childJSX.push(createJSX(child));
		}

		if (["B", "I"].includes(el.tagName)) {
			return createElement(
				el.tagName.toLowerCase(),
				{ key: `${speciesId}_${count++}` },
				...childJSX
			);
		}
		return <>{childJSX}</>;
	}

	return createJSX(wikiTree.body);
}
