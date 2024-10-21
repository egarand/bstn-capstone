import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import "./ExplorePage.scss";
import Input from "../../components/Input/Input";
import CheckboxGroup from "../../components/CheckboxGroup/CheckboxGroup";
import Button from "../../components/Button/Button";

const initialValues = {
	lat: 0,
	lon: 0,
	radius: 5,
	types: [],
	taxa: []
};

function ExplorePage() {
	const [pois, setPois] = useState([]);
	const [values, setValues] = useState(initialValues);

	async function handleSubmit(ev) {
		ev.preventDefault();
		console.log("subvals", values);
	}

	function handleInputChange(ev) {
		const { name, value } = ev.target;
		setValues({ ...values, [name]: value });
	}

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
				<Input className="explore-page__coord-input" type="number" name="lat" value={values.lat} onChange={handleInputChange} label="Latitude" min={-90} max={90} step={0.000001}/>
				<Input className="explore-page__coord-input" type="number" name="lon" value={values.lon} onChange={handleInputChange} label="Longitude" min={-180} max={180} step={0.000001}/>
				<Input className="explore-page__coord-input" type="number" name="radius" value={values.radius} onChange={handleInputChange} label="Radius (kilometers)" min={0} max={10} step={0.1}/>
				<Button className="explore-page__current-loc-btn" variant="secondary">Use Your Location</Button>
			</fieldset>

			<Button>Submit</Button>
		</form>

		<h2>Results</h2>
		<p>Select a place on the map, or browse the list below, for more details.</p>
		<ExploreMap className="explore-page__map">
			<ExploreMap.CenterOnUserOnMount/>
			<Marker position={[values.lat, values.lon]}>
				<Popup content="Your search location"/>
			</Marker>
			<ExploreMap.PoiOverlay pois={pois}/>
		</ExploreMap>
	</>);
}

export default ExplorePage;
