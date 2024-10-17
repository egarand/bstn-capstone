import { useState } from "react";
import ExploreMap from "../../components/ExploreMap/ExploreMap";
import "./ExplorePage.scss";
import axios from "axios";

function ExplorePage() {
	const [pois, setPois] = useState([]);

	function handleSubmit() {
		axios.get("http://localhost:5050/pois")
			.then(({ data }) => setPois(data));
	};

	return (
		<div>
			<h1>ExplorePage</h1>

			<button onClick={handleSubmit}>Get Data</button>

			<ExploreMap>
				<ExploreMap.CenterOnUserOnMount/>
				<ExploreMap.PoiOverlay pois={pois}/>
			</ExploreMap>

		</div>
	);
}

export default ExplorePage;
