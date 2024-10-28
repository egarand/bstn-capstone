import { useMemo } from "react";
import { AnnouncedLink } from "../../navigation-accessibility";
import "./SpeciesLink.scss";

function SpeciesLink({ species }) {
	const attribution = useMemo(() => {
		let ogAttr = species.photo.attribution;
		if (ogAttr.startsWith("(c)")) {
			return ogAttr
				.replace("(c)", "©")
				.replace(/(?:, )?(some|no) rights reserved(?:, )?/i, "")
				.replace(/(?:, )?uploaded by .+/i, "");
		} else {
			return ogAttr.split(", ").toReversed().join(", ").replace("uploaded by ", "");
		}
	}, [species.photo.attribution]);

	return (
	<AnnouncedLink className="species-link" to={`/species/${species.id}`}>
		<span className="species-link__name">{species.common_name}</span>
		<figure className="species-link__figure" role="img" aria-label="">
			<img className="species-link__thumbnail" loading="lazy" alt="" src={species.photo.square_url}/>
			<figcaption className="species-link__caption">
				{attribution}
			</figcaption>
		</figure>
	</AnnouncedLink>
	);
}

export default SpeciesLink;
