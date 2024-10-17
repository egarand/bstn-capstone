import { MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "./ExploreMap.scss";
import { useEffect } from "react";

const algonquinCoords = [45.8372, -78.3791];
const tileAttribution =
`&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> \
&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> \
&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`;


function ExploreMap() {
	return (
		<MapContainer center={algonquinCoords} zoom={10} scrollWheelZoom={false} className="explore-map">
			<TileLayer
				minZoom={5}
				maxZoom={13}
				attribution={tileAttribution}
				url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
			/>

			<CenterOnUserOnMount/>

		</MapContainer>
	);
}

function CenterOnUserOnMount() {
	const map = useMap();
	useEffect(() => {
		map.locate().on("locationfound", function(ev) {
			map.setView(ev.latlng, map.getZoom());
		});
	}, [map]);
	return <></>;
}

export default ExploreMap;
