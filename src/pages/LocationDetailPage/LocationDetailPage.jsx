import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import { trycatch } from "../../utils";
import api from "../../utils/api";
import { AnnouncedLink } from "../../navigation-accessibility";
import DocTitle from "../../components/DocTitle/DocTitle";
import SpeciesLink from "../../components/SpeciesLink/SpeciesLink";
import "./LocationDetailPage.scss";

function LocationDetailPage() {
	const { state } = useLocation();
	const { osm_info } = useParams();
	const isMounted = useIsMounted();

	const [isLoading, setIsLoading] = useState(true),
		[poi, setPoi] = useState(null),
		[species, setSpecies] = useState(null);

	const taxa = useMemo(() =>
		{const val = trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa,
			state?.taxa
		)
		?? []; console.log(val); return val;}
	, [state?.taxa]);
	const roughMiddle = useRef(null);

	const currentMonth = useMemo(() => Intl.DateTimeFormat([], { month: "long" }).format(new Date()), []);

	useEffect(() => {
		setIsLoading(true);
		setPoi(null);
		setSpecies(null);
		(async () => {
			try {
				let poiData = state?.poi;
				if (!state?.poi) {
					const [,type,id] = /([a-z]+)([0-9]+)/g.exec(osm_info);
					poiData = (await api("get", `/pois/${type}/${id}`)).data;
				}
				if (!isMounted.current) { return; }
				setPoi(() => poiData);

				const flatGeom =
					poiData.osm_type === "relation"
					? poiData.geometry.flat(1)
					: poiData.geometry;
				roughMiddle.current = flatGeom[Math.floor(flatGeom.length/2)];

				const params = new URLSearchParams(Object.entries(roughMiddle.current));
				params.append("taxa", taxa);
				const { data: lifeData } = await api("get", `/life?${params.toString()}`);

				if (!isMounted.current) { return; }
				setSpecies(lifeData);
				setIsLoading(false);
			} catch {
				// do something
			}
		})();
	}, [osm_info, state, taxa, isMounted]);

	return (
	<section aria-busy={isLoading}>
		<DocTitle title={poi?.tags?.name} />
		<h1>{poi?.tags?.name || "Loading..."}</h1>
		<pre style={{whiteSpace: "pre-line", wordWrap: "break-word", wordBreak: "break-word"}}>{JSON.stringify(poi?.tags,null,2)}</pre>
		<hr/>
		<h2>Wildlife Spotted Nearby in {currentMonth}</h2>
		{!isLoading && !species.length && (
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
		{!isLoading && species.length && (<>
			<p>Click a species to learn more.</p>
			<ul className="location-page__species-list">
			{species?.map((s) => (
				<li key={s.id} className="location-page__species-list-item">
					<SpeciesLink species={s}/>
				</li>
			))}
			</ul>
		</>)}
	</section>);
}

export default LocationDetailPage;
