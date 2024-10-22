import { useEffect, useState } from "react";
import useIsMounted from "../../hooks/useIsMounted";
import { round, trycatch } from "../../utils";
import api from "../../utils/api";

import ExploreMap from "../../components/ExploreMap/ExploreMap";
import Input from "../../components/Input/Input";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import Button from "../../components/Button/Button";
import PoiOverview from "../../components/PoiOverview/PoiOverview";

import "./ExplorePage.scss";

const initialValues = {
	lat: 0,
	lon: 0,
	radius: 5,
	types: [],
	taxa: []
};

function ExplorePage() {
	const [isLoading, setIsLoading] = useState(false);
	const [pois, setPois] = useState([]);
	const [values, setValues] =
		useState(
			trycatch(() =>
				JSON.parse(localStorage.getItem("explore_input")),
				initialValues
			)
			?? initialValues
		);
	const isMounted = useIsMounted();

	async function handleSubmit(ev) {
		ev.preventDefault();
		setIsLoading(true);
		setPois([]);
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
		} catch {
			// do something
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

	useEffect(fillCurrentLocation, []);

	return (<>
		<h1 className="explore-page__title">ExplorePage</h1>

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

			<hr/>

			<Button disabled={isLoading || null}>
				Submit
			</Button>
		</form>

		<section aria-busy={isLoading}>
			<h2>Results</h2>
			<p>Select a place on the map, or browse the list below, for more details.</p>
			<ExploreMap className="explore-page__map">
				<ExploreMap.CenterOnUserOnMount/>
				<ExploreMap.VisualizeRadius
					center={[values.lat, values.lon]}
					radius={Number(values.radius) * 1000}/>
				<ExploreMap.PoiOverlay
					pois={pois}
					taxa={values.taxa}/>
			</ExploreMap>

			<ul className="explore-page__pois-wrapper">
			{pois.map((p) => (
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
		</section>

	</>);
}

export default ExplorePage;
