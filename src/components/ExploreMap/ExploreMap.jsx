import { MapContainer, Polygon, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import "./ExploreMap.scss";
import { Children, useEffect } from "react";

const algonquinCoords = [45.8372, -78.3791];
const tileAttribution =
`&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> \
&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> \
&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`;

const pathOptions = {
	trail: {
		weight: 8,
		color: "purple"
	},
	campground: {
		color: "red"
	},
	reserve: {
		color: "blue"
	}
}

function ExploreMap({ children }) {
	const subcomponentNames = Object.keys(ExploreMap);
	const subcomponents =
		subcomponentNames.map(
			(key) => Children.map(
				children,
				(child) => child.type.name === key ? child : null
			)
		);

	return (
		<MapContainer center={algonquinCoords} zoom={10} scrollWheelZoom={false} className="explore-map">
			<TileLayer
				minZoom={5}
				maxZoom={13}
				attribution={tileAttribution}
				url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
			/>

			{subcomponents.map((sc) => sc)}

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
ExploreMap.CenterOnUserOnMount = CenterOnUserOnMount;

function PoiOverlay({ pois }) {
	return (<>
	{pois.map((p) => {
		const key = `${p.osm_type}${p.osm_id}`;
		const TagName = p.category === "trail"
						? Polyline
						: Polygon;
		return (
		<TagName key={key} pathOptions={pathOptions[p.category]} positions={p.geometry}>
			<Popup>Test Popup for {p.tags.name}</Popup>
		</TagName>
		);
	})}
	</>);
}
ExploreMap.PoiOverlay = PoiOverlay;

export default ExploreMap;
