import { MapContainer, Polygon, Polyline, Popup as BasePopup, TileLayer, useMap } from "react-leaflet";
import "./ExploreMap.scss";
import { useEffect } from "react";
import { AnnouncedLink } from "../../navigation-accessibility";

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

function PoiOverlay({ pois = [] }) {
	return (<>
	{pois.map((p) => {
		const key = `${p.osm_type}${p.osm_id}`;
		const TagName =
			p.category === "trail"
			? Polyline : Polygon;
		console.log(p);

		return (
		<TagName key={key} pathOptions={pathOptions[p.category]} positions={p.geometry}>
			<ExploreMap.Popup title={p.tags.name} content={(
				<AnnouncedLink to={`/location/${p.osm_type}${p.osm_id}`} state={p}>More Details</AnnouncedLink>
			)}/>
		</TagName>
		);
	})}
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
