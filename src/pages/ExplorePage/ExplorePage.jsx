import ExploreMap from "../../components/ExploreMap/ExploreMap";
import "./ExplorePage.scss";

function ExplorePage() {
	return (
		<div>
			<h1>ExplorePage</h1>

			<ExploreMap>
				<ExploreMap.CenterOnUserOnMount/>
				<ExploreMap.PoiOverlay pois={[]}/>
			</ExploreMap>
		</div>
	);
}

export default ExplorePage;
