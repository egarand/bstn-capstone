import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import { polygonCentroid, trycatch } from "../../utils";
import api from "../../utils/api";
import { AnnouncedLink } from "../../navigation-accessibility";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import DocTitle from "../../components/DocTitle/DocTitle";
import SpeciesLink from "../../components/SpeciesLink/SpeciesLink";
import Button from "../../components/Button/Button";
import "./LocationDetailPage.scss";

function LocationDetailPage() {
	const { state } = useLocation();
	const { osm_info } = useParams();
	const isMounted = useIsMounted();

	const [loadingPoi, setLoadingPoi] = useState(true),
		[loadingSpecies, setLoadingSpecies] = useState(true),
		[poi, setPoi] = useState(null),
		[species, setSpecies] = useState(null);

	const [centroid, setCentroid] = useState(null);
	const taxa = useMemo(() =>
		{const val = trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa,
			state?.taxa
		)
		?? []; console.log(val); return val;}
	, [state?.taxa]);

	const currentMonth = useMemo(() => Intl.DateTimeFormat([], { month: "long" }).format(new Date()), []);

	useEffect(() => {
		setLoadingPoi(true);
		setLoadingSpecies(true);
		setPoi(null);
		setSpecies(null);
		(async () => {
			try {
				let poiData = state?.poi;
				if (!state?.poi) {
					const [,type,id] = /([a-z]+)([0-9]+)/i.exec(osm_info);
					poiData = (await api("get", `/pois/${type}/${id}`)).data;
				}

				const flatGeom =
					poiData.osm_type === "relation"
					? poiData.geometry.flat(1)
					: poiData.geometry;
				const middle = polygonCentroid(flatGeom);
				setCentroid(middle);

				if (!isMounted.current) { return; }
				setPoi(() => poiData);
				setLoadingPoi(() => false);

				const params = new URLSearchParams(Object.entries(poiData.bounds));
				params.append("taxa", taxa);
				const { data: lifeData } = await api("get", `/life?${params.toString()}`, null, {
					"axios-retry": { retries: 0 }
				});

				if (!isMounted.current) { return; }
				setSpecies(() => lifeData);
				setLoadingSpecies(() => false);
			} catch {
				// do something
			}
		})();
	}, [osm_info, state, taxa, isMounted]);

	async function paginate(direction) {
		const page = Math.max(1, Math.min(species.page_count, species.page + direction));
		if (page === species.page) { return; }
		setLoadingSpecies(() => true);
		try {
			const params = new URLSearchParams(Object.entries(poi.bounds));
			params.append("taxa", taxa);
			params.append("page", page);
			const { data } = await api("get", `/life?${params.toString()}`, null, {
				"axios-retry": { retries: 0 }
			});
			if (!isMounted.current) { return; }
			setSpecies(() => data);
			setLoadingSpecies(() => false);
		} catch {
			// do something
		}
	}

	return (
	<section aria-busy={loadingPoi}>
		<DocTitle title={poi?.tags?.name} />
		<h1>{poi?.tags?.name || "Loading..."}</h1>

		<section className="location-page__detail-section">
		{!loadingPoi && (<>
			<ExploreMap className="location-page__map" center={centroid}>
				<ExploreMap.CenterOnCoordinate latlon={centroid}/>
				<ExploreMap.Poi poi={poi} noPopup />
			</ExploreMap>
			<dl>
				{poi.tags.description && <p>poi.tags.description</p>}
			</dl>
		<pre style={{whiteSpace: "pre-line", wordWrap: "break-word", wordBreak: "break-word"}}>{JSON.stringify(poi?.tags,null,2)}</pre>
			<h2>Other Tags</h2>

		</>)}
		</section>

		<hr/>
		<h2>Wildlife Spotted Nearby in {currentMonth}</h2>
		{!loadingSpecies && !species.species.length && species.page === 1 && (
			<div className="location-page__no-species">
				<p>None... <em>yet.</em></p>
				<p><AnnouncedLink
					to="/contribute"
					className="location-page__contribute-cta"
				>
					You could go record some observations and change that!
				</AnnouncedLink></p>
			</div>
		)}
		{species?.species.length && (<>
			<p>Click a species to learn more.</p>
			<ul className="location-page__species-list" aria-busy={loadingSpecies}>
			{species.species?.map((s) => (
				<li key={s.id} className="location-page__species-list-item">
					<SpeciesLink species={s}/>
				</li>
			))}
			</ul>
			<nav className="location-page__pagination" aria-label="pagination">
				<Button
					variant="secondary"
					onClick={()=>paginate(-1)}
					disabled={species?.page === 1 || null}
				>Previous</Button>
				<p>Page {species?.page} / {species?.page_count}</p>
				<Button
					variant="secondary"
					onClick={()=>paginate(1)}
					disabled={species?.page === species?.page_count || null}
				>Next</Button>
			</nav>
		</>)}
	</section>);
}

export default LocationDetailPage;
