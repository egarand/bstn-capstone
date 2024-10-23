import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import { polygonCentroid, trycatch } from "../../utils";
import api from "../../utils/api";

import { AnnouncedLink } from "../../navigation-accessibility";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import DocTitle from "../../components/DocTitle/DocTitle";
import SpeciesLink from "../../components/SpeciesLink/SpeciesLink";
import Pagination from "../../components/Pagination/Pagination";
import Icon from "../../components/Icon/Icon";

import "./LocationDetailPage.scss";
import linkSrc from "../../assets/icons/link.svg";
import moneySrc from "../../assets/icons/money.svg";
import pawprintSrc from "../../assets/icons/pawprint.svg";
import wheelchairSrc from "../../assets/icons/wheelchair.svg";

const perPage = 16;
const primaryListTags = ["website", "wheelchair", "dog", "fee"];
const primaryTags = ["name", "description", ...primaryListTags];

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
		trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa,
			state?.taxa
		)
		?? []
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
				lifeData.page = 1;
				lifeData.total_pages = Math.ceil(Number(lifeData.total) / perPage);

				if (!isMounted.current) { return; }
				setSpecies(() => lifeData);
				setLoadingSpecies(() => false);
			} catch {
				// do something
			}
		})();
	}, [osm_info, state, taxa, isMounted]);

	function paginate(direction) {
		const page = Math.max(1, Math.min(species.total_pages, species.page + direction));
		setSpecies({ ...species, page });
		if (page === species.page) { return; }
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
			{poi.tags.description && (
				<p className="location-page__description">
					{poi.tags.description}
				</p>
			)}
			<dl className="location-page__tag-list">
				{poi.tags.website && (<div className="location-page__tag">
					<dt className="location-page__tag-title">
						<Icon className="location-page__tag-icon" src={linkSrc} alt=""/>
						Website
					</dt>
					<dd className="location-page__tag-content">
						<a className="location-page__link" target="blank" href={poi.tags.website}>Go to External Site</a>
					</dd>
				</div>)}
				<div className="location-page__tag">
					<dt className="location-page__tag-title">
						<Icon className="location-page__tag-icon" src={moneySrc} alt=""/>
						Entry Fee?
					</dt>
					<dd>{(()=>{switch (poi.tags.fee) {
						case "yes":
							return "Yes";
						case "no":
							return "No";
						default:
							return "Unknown";
					}})()}</dd>
				</div>
				<div className="location-page__tag">
					<dt className="location-page__tag-title">
						<Icon className="location-page__tag-icon" src={wheelchairSrc} alt=""/>
						Wheelchair Accessible?
					</dt>
					<dd>{(()=>{switch (poi.tags.wheelchair) {
						case "yes":
							return "Yes; fully accessible";
						case "limited":
							return "Yes; partial access";
						case "no":
							return "No";
						default:
							return "Unknown";
					}})()}</dd>
				</div>
				<div className="location-page__tag">
					<dt className="location-page__tag-title">
						<Icon className="location-page__tag-icon" src={pawprintSrc} alt=""/>
						Dogs Allowed?
					</dt>
					<dd>{(()=>{switch (poi.tags.dog) {
						case "yes":
						case "unleashed":
							return "Yes; follow local leashing laws";
						case "leashed":
							return "Yes; must be leashed";
						case "outside":
							return "Only in outside areas";
						case "no":
							return "No";
						default:
							return "Unknown; most likely yes, but check";
					}})()}</dd>
				</div>
			</dl>

			{Object.entries(poi.tags).filter(([t]) => !primaryTags.includes(t)).length && (
				<details className="location-page__tag-list-collapsible-wrapper">
				<summary className="location-page__tag-list-collapsible-header">Other Tags</summary>
				<dl className="location-page__tag-list">
					{Object.entries(poi.tags).filter(([t]) => !primaryTags.includes(t)).map(([t,v]) => (
					<div key={t} className="location-page__tag">
						<dt className="location-page__tag-title">{t}</dt>
						<dd className="location-page__tag-content">{v}</dd>
					</div>))}
				</dl>
				</details>
			)}
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
			<Pagination
				currentPage={species?.page}
				totalPages={species?.total_pages}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
			<ul className="location-page__species-list" aria-busy={loadingSpecies}>
			{species.species?.reduce((arr, s, i) => {
				const start = (Number(species.page) - 1) * perPage;
				if (i >= start && i < Math.min(start + perPage, species.species.length)) {
					arr.push(<li key={s.id} className="location-page__species-list-item">
						<SpeciesLink species={s}/>
					</li>);
				}
				return arr;
			},[])}
			</ul>
			<Pagination
				currentPage={species?.page}
				totalPages={species?.total_pages}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
		</>)}
	</section>);
}

export default LocationDetailPage;
