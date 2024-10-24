import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import { polygonCentroid, trycatch } from "../../utils";
import api from "../../utils/api";

import { AnnouncedLink } from "../../navigation-accessibility";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import DocTitle from "../../components/DocTitle/DocTitle";
import SpeciesLink from "../../components/SpeciesLink/SpeciesLink";
import Pagination from "../../components/Pagination/Pagination";
import LocationTag from "../../components/LocationTag/LocationTag";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import Button from "../../components/Button/Button";

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
	const [taxa, setTaxa] = useState(
		state?.taxa
		?? trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa
		)
		?? []
	);

	const currentMonth = useMemo(() => Intl.DateTimeFormat([], { month: "long" }).format(new Date()), []);

	const reloadSpecies = useCallback(async (bounds, taxas) => {
		setLoadingSpecies(true);

		const params = new URLSearchParams(Object.entries(bounds));
		params.append("taxa", taxas);
		const { data: lifeData } = await api("get", `/life?${params.toString()}`, null, {
			"axios-retry": { retries: 0 }
		});
		lifeData.page = 1;
		lifeData.total_pages = Math.ceil(Number(lifeData.total) / perPage);

		if (!isMounted.current) { return; }
		setSpecies(() => lifeData);
		setLoadingSpecies(() => false);
	}, [isMounted]);

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

				reloadSpecies(poiData.bounds, taxa);
			} catch {
				// do something
			}
		})();
	// technically `taxa` should be a dep; but if it is, all the fetches run
	// again when the user checks/unchecks a single checkbox, which is not the
	// desired behaviour.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [osm_info, state, reloadSpecies, isMounted]);

	function paginate(direction) {
		const page = Math.max(1, Math.min(species.total_pages, species.page + direction));
		setSpecies({ ...species, page });
		if (page === species.page) { return; }
	}

	function handleTaxaChange(ev) {
		const { value } = ev.target;
		setTaxa(value);
		trycatch(()=> {
			const formInp = JSON.parse(localStorage.getItem("explore_input"));
			formInp.taxa = value;
			localStorage.setItem("explore_input", JSON.stringify(formInp));
		});
	}

	function handleTaxaSubmit(ev) {
		ev.preventDefault();
		reloadSpecies(poi.bounds, taxa);
	}

	return (
	<section className="location-page" aria-busy={loadingPoi}>
		<DocTitle title={poi?.tags?.name} />
		<h1 className="location-page__title">{poi?.tags?.name || "Loading..."}</h1>

		<section className="location-page__detail-section">
		{!loadingPoi && (<>
			{poi.tags.description && (
				<p className="location-page__description">
					{poi.tags.description}
				</p>
			)}
			{poi.tags.note && (
				<p className="location-page__description">
					{poi.tags.note}
				</p>
			)}
			<dl className="location-page__tag-list">
				{poi.tags.website &&
					<LocationTag
						name="website" value={poi.tags.website} icon={linkSrc}/>
				}
				<LocationTag
					name="fee" value={poi.tags.fee} icon={moneySrc}/>
				<LocationTag
					name="wheelchair" value={poi.tags.wheelchair} icon={wheelchairSrc}/>
				<LocationTag
					name="dog" value={poi.tags.dog} icon={pawprintSrc}/>
			</dl>

			<details className="location-page__collapsible-wrapper">
				<summary className="location-page__collapsible-header">
					Other Tags
				</summary>
				<dl className="location-page__tag-list">
					{Object.entries(poi.tags)
						.filter(([t]) => !primaryTags.includes(t))
						.map(([t,v]) =>
							<LocationTag key={t} name={t} value={v}/>
						)
					}
				</dl>
			</details>
			<span className="location-page__column-breaker"></span>
			<ExploreMap className="location-page__map" center={centroid}>
				<ExploreMap.CenterOnCoordinate latlon={centroid}/>
				<ExploreMap.Poi poi={poi} noPopup />
			</ExploreMap>
		</>)}
		</section>

		<h2 className="location-page__heading">Wildlife Spotted Nearby in {currentMonth}</h2>
		<details className="location-page__collapsible-wrapper">
			<summary className="location-page__collapsible-header">
				Edit Wildlife Type Choices
			</summary>
			<form className="location-page__taxa-form" onSubmit={handleTaxaSubmit}>
				<CheckboxGroup
					className="location-page__taxa-group"
					label="wildlife types"
					name="taxa"
					required={true}
					values={taxa} onChange={handleTaxaChange}
					disabled={loadingSpecies || null}
				>
					<CheckboxGroup.Checkbox value="Mammalia" label="Mammals"/>
					<CheckboxGroup.Checkbox value="Aves" label="Birds"/>
					<CheckboxGroup.Checkbox value="Reptilia" label="Reptiles"/>

					<CheckboxGroup.Checkbox value="Amphibia" label="Amphibians"/>
					<CheckboxGroup.Checkbox value="Actinopterygii" label="Fish"/>
					<CheckboxGroup.Checkbox value="Insecta" label="Insects"/>

					<CheckboxGroup.Checkbox value="Arachnida" label="Arachnids"/>
					<CheckboxGroup.Checkbox value="Fungi" label="Fungi"/>
					<CheckboxGroup.Checkbox value="Plantae" label="Plants"/>
				</CheckboxGroup>
				<Button variant="secondary">Refresh Wildlife</Button>
			</form>
		</details>
		{!loadingSpecies && species.species.length && species.page === 1 && (
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
