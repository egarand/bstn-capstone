import Icon from '../Icon/Icon';
import { AnnouncedLink } from '../../navigation-accessibility';

import "./PoiOverview.scss";
import hikingSrc from "../../assets/icons/hiking.svg";
import campingSrc from "../../assets/icons/camping.svg";
import forestSrc from "../../assets/icons/forest.svg";
import { useMemo } from 'react';

/** Minimally styled component that provides a name and icon for a given PoI,
 * as well as a link to the page with full details on the PoI.
 *
 * The `taxa` prop is used to provide the details page with data on the user's
 * preferred taxa the case that the user has disabled local storage. */
function PoiOverview({ poi, taxa, headingTag: Htag = "span", headerClassName = "", linkClassName = "" }) {
	const src = useMemo(()=>
		poi?.category==="trail"
		? hikingSrc
		: poi?.category==="campground"
			? campingSrc
			: forestSrc
	, [poi]);
	const alt = useMemo(() =>
		poi?.category === "reserve"
		? "nature reserve"
		: poi?.category
	, [poi]);
	return (
		<article className="poi-overview">
			<Htag className={`poi-overview__header ${headerClassName}`}>
				<Icon
					className="poi-overview__icon"
					src={src}
					alt={alt}/>
				{poi?.tags?.name || poi?.name}
			</Htag>
			<AnnouncedLink
				className={`poi-overview__link ${linkClassName}`}
				to={`/location/${poi?.osm_type}${poi?.osm_id}`}
				state={{ poi: poi.tags ? poi : null, taxa }}
			>More Details</AnnouncedLink>
		</article>
	);
}

export default PoiOverview;
