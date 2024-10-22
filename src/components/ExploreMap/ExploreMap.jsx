import { MapContainer, Polygon, Polyline, Popup as BasePopup, TileLayer, useMap, Circle } from "react-leaflet";
import "./ExploreMap.scss";
import { useEffect } from "react";
import { AnnouncedLink } from "../../navigation-accessibility";
import Icon from "../../components/Icon/Icon";
import hikingSrc from "../../assets/icons/hiking.svg";
import campingSrc from "../../assets/icons/camping.svg";
import forestSrc from "../../assets/icons/forest.svg";

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

function Poi({ poiData: p, taxaData: taxa }) {
	const TagName =
		p.category === "trail"
		? Polyline
		: Polygon;
	const src =
		p.category==="trail"
		? hikingSrc
		: p.category==="campground"
			? campingSrc
			: forestSrc;
	return (
	<TagName
		className={`explore-map-poi explore-map-poi--${p.category}`}
		positions={p.geometry}
	>
		<ExploreMap.Popup
			title={<>
				<Icon
					className="explore-map-poi__icon"
					src={src}
					alt={p.category === "reserve" ? "nature reserve" : p.category}/>
				{p.tags.name}
			</>}
			content={(
				<AnnouncedLink
					to={`/location/${p.osm_type}${p.osm_id}`}
					state={{ poi: p, taxa }}
				>More Details</AnnouncedLink>
			)}/>
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
		<Poi key={`${p.osm_type}${p.osm_id}`} poiData={p} taxaData={taxa}/>
	)}
	</>);
}
ExploreMap.PoiOverlay = PoiOverlay;

function Popup({ title, content }) {
	return (
		<BasePopup className="explore-map-popup">
			{title && <div className="explore-map-popup__title">{title}</div>}
			{content && <div className="explore-map-popup__content">{content}</div>}
		</BasePopup>
	);
}
ExploreMap.Popup = Popup;

export default ExploreMap;
