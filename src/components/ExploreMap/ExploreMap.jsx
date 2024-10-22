import { MapContainer, Polygon, Polyline, Popup as BasePopup, TileLayer, useMap, Circle } from "react-leaflet";
import "./ExploreMap.scss";
import { useEffect } from "react";
import PoiOverview from "../PoiOverview/PoiOverview";

const algonquinCoords = [45.8372, -78.3791];
const tileAttribution =
`&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> \
&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> \
&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`;

function ExploreMap({ className, children }) {
	return (
		<MapContainer center={algonquinCoords} zoom={10} scrollWheelZoom={false} className={`explore-map ${className}`}>
			<TileLayer
				minZoom={6}
				maxZoom={14}
				attribution={tileAttribution}
				url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
			/>

			{children}

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

function VisualizeRadius({ center, radius }) {
	return (
	<Circle
		className="explore-map-radius"
		center={center}
		radius={radius}/>
	);
}
ExploreMap.VisualizeRadius = VisualizeRadius;

function Poi({ poi, taxa }) {
	const TagName =
		poi.category === "trail"
		? Polyline
		: Polygon;
	return (
	<TagName
		className={`explore-map-poi explore-map-poi--${poi.category}`}
		positions={poi.geometry}
	>
		<Popup>
			<PoiOverview
			poi={poi}
			taxa={taxa}
			headingTag="span"
			headerClassName="explore-map-poi__title" linkClassName="explore-map-poi__content"/>
		</Popup>

	</TagName>
	);
}
ExploreMap.Poi = Poi;

function PoiOverlay({ pois = [], taxa = [] }) {
	// larger polygons layered below smaller polygons layered below polylines
	pois.sort((a, b) => {
		const ranks = { reserve: 1, campground: 2, trail: 3 };
		return ranks[a.category] - ranks[b.category];
	})
	return (<>
	{pois.map((p) =>
		<Poi key={`${p.osm_type}${p.osm_id}`} poi={p} taxa={taxa}/>
	)}
	</>);
}
ExploreMap.PoiOverlay = PoiOverlay;

function Popup({ children }) {
	return (
		<BasePopup className="explore-map-popup">
			{children}
		</BasePopup>
	);
}
ExploreMap.Popup = Popup;

export default ExploreMap;
