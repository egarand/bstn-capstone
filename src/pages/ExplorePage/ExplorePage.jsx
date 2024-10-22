import { useEffect, useState } from "react";
import { Circle } from "react-leaflet";
import api from "../../utils/api";
import useIsMounted from "../../hooks/useIsMounted";
import { round, trycatch } from "../../utils";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import Input from "../../components/Input/Input";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import Button from "../../components/Button/Button";
import "./ExplorePage.scss";
import { AnnouncedLink } from "../../navigation-accessibility";
import Icon from "../../components/Icon/Icon";
import hikingSrc from "../../assets/icons/hiking.svg";
import campingSrc from "../../assets/icons/camping.svg";
import forestSrc from "../../assets/icons/forest.svg";

const initialValues = {
	lat: 0,
	lon: 0,
	radius: 5,
	types: [],
	taxa: []
};

function ExplorePage() {
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
		ev.target.setAttribute("disabled", true);
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

			<CheckboxGroup className="explore-page__fieldset explore-page__type-group" label="location types" required={true} values={values.types} onChange={handleInputChange} name="types">
				<CheckboxGroup.Checkbox value="t" label="Hiking trails"/>
				<CheckboxGroup.Checkbox value="c" label="Campgrounds"/>
				<CheckboxGroup.Checkbox value="r" label="Nature Reserves"/>
			</CheckboxGroup>

			<h2 className="explore-page__form-heading">What Wildlife Are You Interested In?</h2>

			<CheckboxGroup className="explore-page__fieldset explore-page__taxa-group" label="wildlife types" required={true} values={values.taxa} onChange={handleInputChange} name="taxa">
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

			<fieldset className="explore-page__fieldset explore-page__coord-group">
				<Input className="explore-page__coord-input" type="number" name="lat" value={values.lat} onChange={handleInputChange} label="Latitude" min={-90} max={90} step={0.0001}/>
				<Input className="explore-page__coord-input" type="number" name="lon" value={values.lon} onChange={handleInputChange} label="Longitude" min={-180} max={180} step={0.0001}/>
				<Input className="explore-page__coord-input" type="number" name="radius" value={values.radius} onChange={handleInputChange} label="Radius (kilometers)" min={0} max={30} step={0.1}/>
				<Button className="explore-page__current-loc-btn" variant="secondary" onClick={fillCurrentLocation}>Use Your Location</Button>
			</fieldset>

			<hr/>

			<Button>Submit</Button>
		</form>

		<h2>Results</h2>
		<p>Select a place on the map, or browse the list below, for more details.</p>
		<ExploreMap className="explore-page__map">
			<ExploreMap.CenterOnUserOnMount/>
			<Circle className="explore-page__search-area" center={[values.lat, values.lon]} radius={Number(values.radius) * 1000}/>
			<ExploreMap.PoiOverlay pois={pois} taxa={values.taxa}/>
		</ExploreMap>

		<ul className="explore-page__pois-wrapper">
		{pois.map((p) => {
			const key = `${p.osm_type}${p.osm_id}`;
			return (
				<li key={key} className={`explore-page__poi-card explore-page__poi-card--${p.category}`}>
					<span className="explore-page__poi-header"><Icon src={p.category==="trail" ? hikingSrc : p.category==="campground" ? campingSrc : forestSrc} alt={p.category} className="explore-page__poi-icon"/> {p.tags.name}&nbsp;</span>
					<AnnouncedLink className="explore-page__poi-link" to={`/location/${key}`} state={{ poi: p, taxa: values.taxa }}>More Details</AnnouncedLink>
				</li>
			)
		})}
		</ul>
	</>);
}

export default ExplorePage;
