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
import LocationTag from "../../components/LocationTag/LocationTag";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";

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

	const [taxa, setTaxa] = useState(
		state?.taxa
		?? trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa
		)
		?? []
	);

	const currentMonth = useMemo(() =>
		Intl.DateTimeFormat([], { month: "long" }).format(new Date())
	, []);

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
				poiData.centroid = polygonCentroid(poiData.geometry.flat());

				if (!isMounted.current) { return; }
				setPoi(() => poiData);
				setLoadingPoi(() => false);

				const params = new URLSearchParams(Object.entries(poiData.bounds));
				const { data: lifeData } = await api("get", `/life?${params.toString()}`, null, {
					"axios-retry": { retries: 0 }
				});
				lifeData.page = 1;

				if (!isMounted.current) { return; }
				setSpecies(() => lifeData);
				setLoadingSpecies(() => false);
			} catch {
				// do something
			}
		})();
	}, [osm_info, state, isMounted]);

	const [filteredSpecies, speciesPageTotal] = useMemo(() => {
		const specs =
			species?.species?.filter((s) => taxa.includes(s.iconic_taxon));
		const pages =
			specs ? Math.ceil(specs.length / perPage) : 0;
		return [specs, pages];
	}, [species, taxa]);

	function paginate(direction) {
		const page = Math.max(1, Math.min(speciesPageTotal, species.page + direction));
		setSpecies({ ...species, page });
	}

	function handleTaxaChange(ev) {
		const { value } = ev.target;
		setTaxa(value);
		setSpecies({ ...species, page: 1 });
		trycatch(() => {
			const formInp = JSON.parse(localStorage.getItem("explore_input"));
			formInp.taxa = value;
			localStorage.setItem("explore_input", JSON.stringify(formInp));
		});
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
			<ExploreMap className="location-page__map" center={poi?.centroid}>
				<ExploreMap.CenterOnCoordinate latlon={poi?.centroid}/>
				<ExploreMap.Poi poi={poi} noPopup />
			</ExploreMap>
		</>)}
		</section>

		<h2 className="location-page__heading">Wildlife Spotted Nearby in {currentMonth}</h2>
		<details className="location-page__collapsible-wrapper">
			<summary className="location-page__collapsible-header">
				Edit Wildlife Type Choices
			</summary>
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
		</details>

		{!loadingSpecies && !filteredSpecies.length && species.page === 1 && (
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
		{filteredSpecies?.length && (<>
			<Pagination
				currentPage={species?.page}
				totalPages={speciesPageTotal}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
			<ul className="location-page__species-list">
			{filteredSpecies
				.slice(
					(species.page - 1) * perPage,
					(species.page - 1) * perPage + perPage
				).map((s) => (
					<li key={s.id} className="location-page__species-list-item">
						<SpeciesLink species={s}/>
					</li>
				)
			)}
			</ul>
			<Pagination
				currentPage={species?.page}
				totalPages={speciesPageTotal}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
		</>)}
	</section>);
}

export default LocationDetailPage;
