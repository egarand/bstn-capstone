import { useState } from "react";
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
	const [values, setValues] = useState(initialValues);

	async function handleSubmit(ev) {
		ev.preventDefault();
		console.log("subvals", values);
	}

	function handleInputChange(ev) {
		const { name, value } = ev.target;
		setValues({ ...values, [name]: value });
	}

	return (
		<div>
			<h1>ExplorePage</h1>

			<form onSubmit={handleSubmit}>
				<h2>What Are You Looking For?</h2>

				<CheckboxGroup values={values.types} required={true} onChange={handleInputChange} name="types">
					<CheckboxGroup.Checkbox value="t" label="Hiking trails"/>
					<CheckboxGroup.Checkbox value="c" label="Campgrounds"/>
					<CheckboxGroup.Checkbox value="r" label="Nature Reserves"/>
				</CheckboxGroup>

				<h2>What Wildlife Are You Interested In?</h2>

				<CheckboxGroup name="taxa">
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

				<h2>Where Should We Look?</h2>

				<Button variant="secondary">Use Your Location</Button>
				<Input type="number" name="lat" value={values.lat} onChange={handleInputChange} label="Latitude" min={-90} max={90} step={0.000001}/>
				<Input type="number" name="lon" value={values.lon} onChange={handleInputChange} label="Longitude" min={-180} max={180} step={0.000001}/>
				<Input type="number" name="radius" value={values.radius} onChange={handleInputChange} label="Radius (kilometers)" min={0} max={10} step={0.1}/>

				<Button>Submit</Button>
			</form>

			<h2>Results</h2>
			<p>Select a place on the map, or browse the list below, for more details.</p>
			<ExploreMap>
				<ExploreMap.CenterOnUserOnMount/>
				<ExploreMap.PoiOverlay pois={[]}/>
			</ExploreMap>
		</div>
	);
}

export default ExplorePage;
