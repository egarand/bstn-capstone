import { useEffect, useMemo, useRef, useState } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import { round, trycatch } from "../../utils";
import api from "../../utils/api";

import DocTitle from "../../components/DocTitle/DocTitle";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import Input from "../../components/Input/Input";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import Button from "../../components/Button/Button";
import PoiOverview from "../../components/PoiOverview/PoiOverview";

import "./ExplorePage.scss";
import Loader from "../../components/Loader/Loader";
import Pagination from "../../components/Pagination/Pagination";

const perPage = 15;
const initialValues = {
	lat: 0,
	lon: 0,
	radius: 5,
	types: [],
	taxa: []
};

function ExplorePage() {
	const [isLoading, setIsLoading] = useState(false),
		[error, setError] = useState(false),
		[pois, setPois] = useState([]),
		[poiPage, setPoiPage] = useState(1);
	const [values, setValues] =
		useState(
			trycatch(() =>
				JSON.parse(localStorage.getItem("explore_input")),
				initialValues
			)
			|| initialValues
		);
	const resultsRef = useRef(null);
	const isMounted = useIsMounted();

	const poiPageTotal = useMemo(() =>
		Math.ceil(pois?.length / perPage)
	, [pois]);

	async function handleSubmit(ev) {
		ev.preventDefault();
		setError(false);
		setIsLoading(true);
		setPois([]);
		setPoiPage(1);
		try {
			const submitValues = {...values, radius: values.radius*1000};
			delete submitValues.taxa;
			const params = new URLSearchParams(Object.entries(submitValues));
			const { data } = await api("get", `/pois?${params.toString()}`, null, {
				timeout: 30_000,
				"axios-retry": { retries: 0 }
			});
			if (!isMounted.current) { return; }
			setPois(data);
			setIsLoading(false);
			requestAnimationFrame(() => resultsRef.current.focus());
		} catch (error) {
			console.error(error);
			if (error.name !== "CanceledError" && isMounted.current) {
				setIsLoading(false);
				setError(error);
			}
		}
	}

	function handleInputChange(ev) {
		const { name, value } = ev.target;
		const newValues = { ...values, [name]: value }

		setValues(newValues);
		trycatch(()=>
			localStorage.setItem("explore_input", JSON.stringify(newValues))
		);
	}

	function fillCurrentLocation(ev) {
		ev?.preventDefault();
		navigator?.geolocation?.getCurrentPosition((pos) => {
			setValues(v => {
				const newV = {
					...v,
					lat: round(pos.coords.latitude, 5),
					lon: round(pos.coords.longitude, 5)
				};
				trycatch(()=>
					localStorage.setItem("explore_input", JSON.stringify(newV))
				);
				return newV;
			});

		}, null);
	}

	useEffect(() => {
		if (values.lat !== 0) { return; }
		fillCurrentLocation();
	}, [values.lat]);

	function paginate(direction) {
		const page = Math.max(1, Math.min(poiPageTotal, poiPage + direction));
		setPoiPage(page);
	}

	return (<>
		<DocTitle title="Explore" />
		<h1 className="explore-page__title">Explore</h1>
		<p className="explore-page__description">Fill the form to search for outdoor spots to visit.</p>

		<form className="explore-page__form" onSubmit={handleSubmit}>
			<h2 className="explore-page__form-heading">What Are You Looking For?</h2>

			<CheckboxGroup
				className="explore-page__fieldset explore-page__type-group"
				label="location types"
				name="types"
				required={true}
				values={values.types} onChange={handleInputChange}
				disabled={isLoading || null}
			>
				<CheckboxGroup.Checkbox value="t" label="Hiking trails"/>
				<CheckboxGroup.Checkbox value="c" label="Campgrounds"/>
				<CheckboxGroup.Checkbox value="r" label="Nature Reserves"/>
			</CheckboxGroup>

			<h2 className="explore-page__form-heading">What Wildlife Are You Interested In?</h2>

			<CheckboxGroup
				className="explore-page__fieldset explore-page__taxa-group"
				label="wildlife types"
				name="taxa"
				required={true}
				values={values.taxa} onChange={handleInputChange}
				disabled={isLoading || null}
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

			<h2 className="explore-page__form-heading">Where Should We Look?</h2>

			<fieldset className="explore-page__fieldset explore-page__coord-group" disabled={isLoading || null}>
				{[["lat", "Latitude", -90, 90, 0.0001],
				["lon", "Longitude", -180, 180, 0.0001],
				["radius", "Radius (kilometers)", 0, 30, 0.1]]
				.map(([name, label, min, max, step]) => (
					<Input key={name}
						className="explore-page__coord-input"
						label={label}
						type="number"
						name={name}
						value={values[name]}
						onChange={handleInputChange}
						min={min} max={max} step={step} />
				))}
				<Button className="explore-page__current-loc-btn" variant="secondary" onClick={fillCurrentLocation}>Use Your Location</Button>
			</fieldset>

			<Button className="explore-page__submit-btn" disabled={isLoading || null}>
				Submit
			</Button>
		</form>

		<section className="explore-page__results" aria-busy={isLoading}>
			<h2 className="explore-page__heading" tabIndex={-1} ref={resultsRef}>Results</h2>
			<p>
			{pois.length
				? "Select a place on the map, or browse the list below the map, for more details."
				: "Nothing here yet."}
			</p>
			<ExploreMap className="explore-page__map">
				<ExploreMap.CenterOnUserOnMount/>
				<ExploreMap.VisualizeRadius
					center={[values.lat, values.lon]}
					radius={Number(values.radius) * 1000}/>
				<ExploreMap.PoiOverlay
					pois={pois}
					taxa={values.taxa}/>
			</ExploreMap>

			{!!pois.length && (
			<Pagination
				currentPage={poiPage}
				totalPages={poiPageTotal}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
			)}
			<ul className="explore-page__pois-wrapper">
			{pois
				.slice(
					(poiPage - 1) * perPage,
					(poiPage - 1) * perPage + perPage
				).map((p) => (
				<li
					key={`${p.osm_type}${p.osm_id}`}
					className={`explore-page__poi explore-page__poi--${p.category}`}
				>
					<PoiOverview
						poi={p}
						taxa={values.taxa}
						headingTag="h3"
						headerClassName="explore-page__poi-header"/>
				</li>
			))}
			</ul>
			{!!pois.length && (
			<Pagination
				currentPage={poiPage}
				totalPages={poiPageTotal}
				onPrev={()=>paginate(-1)} onNext={()=>paginate(1)}/>
			)}

			<Loader className="explore-page__loader" isLoading={isLoading} errorObj={error}/>
		</section>

	</>);
}

export default ExplorePage;
