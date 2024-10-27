import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { polygonCentroid, trycatch } from "../../utils";
import useApi, { api } from "../../utils/api";
import { useAuth } from "../../components/AuthProvider/AuthProvider";

import { AnnouncedLink, useAccessibleNav } from "../../navigation-accessibility";
import DocTitle from "../../components/DocTitle/DocTitle";
import IconButton from "../../components/IconButton/IconButton";
import Loader from "../../components/Loader/Loader";
import LocationTag from "../../components/LocationTag/LocationTag";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import PaginatedCards from "../../components/PaginatedCards/PaginatedCards";
import SpeciesLink from "../../components/SpeciesLink/SpeciesLink";

import "./LocationDetailPage.scss";
import linkSrc from "../../assets/icons/link.svg";
import moneySrc from "../../assets/icons/money.svg";
import pawprintSrc from "../../assets/icons/pawprint.svg";
import wheelchairSrc from "../../assets/icons/wheelchair.svg";
import bookmarkSrc from "../../assets/icons/bookmark.svg";

const primaryListTags = ["website", "wheelchair", "dog", "fee"];
const primaryTags = ["name", "description", ...primaryListTags];

function LocationDetailPage() {
	const { state } = useLocation();
	const { osm_info } = useParams();
	const { refocusPageTop } = useAccessibleNav();
	const { token } = useAuth();

	const
		[fetchPoi, poi, loadingPoi, errorPoi]
			= useApi(state?.poi),
		[fetchSpecies, species, loadingSpecies, errorSpecies]
			= useApi(null, true);
	const [page, setPage] = useState(1);
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

	const centroid = useMemo(() =>
		poi?.tags ? polygonCentroid(poi.geometry.flat()) : [0,0]
	, [poi]);

	const filteredSpecies = useMemo(() =>
		species?.species?.filter((s) => taxa.includes(s.iconic_taxon)) || []
	, [species, taxa]);

	useEffect(() => {
		(async () => {
			if (state?.poi?.tags) { return; }
			const [,type,id] = /([a-z]+)([0-9]+)/i.exec(osm_info);
			await fetchPoi("get", `/pois/${type}/${id}`);
		})();
	}, [osm_info, state, fetchPoi, refocusPageTop]);

	useEffect(() => {
		if (!poi?.tags) { return; }
		const params = new URLSearchParams(Object.entries(poi.bounds));
		fetchSpecies("get", `/life?${params.toString()}`, null, {
			"axios-retry": { retries: 0 }
		});
	}, [poi, fetchSpecies]);

	function handleTaxaChange(ev) {
		const { value } = ev.target;
		setTaxa(value);
		setPage(1);
		trycatch(() => {
			const formInp = JSON.parse(localStorage.getItem("explore_input"));
			formInp.taxa = value;
			localStorage.setItem("explore_input", JSON.stringify(formInp));
		});
	}

	async function handleBookmark() {
		if (!token) { return; }
		try {
			const res = await api("post", "/users/pois",
				{
					osm_type: poi.osm_type,
					osm_id: poi.osm_id,
					name: poi.tags.name
				},
				{ headers: { "Authorization": `Bearer ${token}`} }
			);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	}

	return (
	<section className="location-page" aria-busy={loadingPoi}>
		<DocTitle title={poi?.tags?.name} />
		<Loader isLoading={loadingPoi} errorObj={errorPoi}/>
		<div className="location-page__header-section">
			<h1 className="location-page__title">
				{poi?.tags?.name}
			</h1>
			{token && poi?.tags && (
			<IconButton
				onClick={handleBookmark}
				className="location-page__bookmark-btn"
				iconSrc={bookmarkSrc}
				text="Bookmark location" />)}
		</div>

		{!loadingPoi && poi?.tags && (<>
		<section className="location-page__detail-section">
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
		</section>
		</>)}

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

		<Loader isLoading={loadingSpecies && !species} errorObj={errorSpecies}/>
		{!loadingSpecies && !filteredSpecies?.length && page === 1 && (
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
		{filteredSpecies?.length && (
			<PaginatedCards items={filteredSpecies.map((s) => (
				<SpeciesLink key={s.id} species={s}/>
			))} perPage={16} type="species"/>
		)}
	</section>);
}

export default LocationDetailPage;
