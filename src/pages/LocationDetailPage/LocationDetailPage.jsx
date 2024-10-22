import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import { trycatch } from "../../utils";
import api from "../../utils/api";
import { AnnouncedLink } from "../../navigation-accessibility";
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
				const roughMiddle = flatGeom[Math.floor(flatGeom.length/2)];

				const params = new URLSearchParams(Object.entries(roughMiddle));
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
		<h1>{poi?.tags?.name || "Loading..."}</h1>
		<pre>{JSON.stringify(poi?.tags,null,2)}</pre>
		<hr/>
		{species?.map((s) => (<div key={s.id}>
			<pre>{JSON.stringify(s,null,2)}</pre>
			<AnnouncedLink to={`/species/${s.id}`}>Learn More</AnnouncedLink>
			<hr/>
		</div>)) || "Loading..."}
	</section>);
}

export default LocationDetailPage;
