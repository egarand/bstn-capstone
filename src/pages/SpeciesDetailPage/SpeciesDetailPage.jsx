import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useIsMounted from "../../hooks/useIsMounted";
import api from "../../utils/api";
import "./SpeciesDetailPage.scss";

function SpeciesDetailPage() {
	const { inat_id } = useParams();
	const isMounted = useIsMounted();

	const [species, setSpecies] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const { data: speciesData } = await api("get", `/life/${inat_id}`);
				if (!isMounted.current) { return; }

				speciesData.wikipedia_excerpt =
					wikiExcerptToJSX(speciesData.wikipedia_excerpt);
				setSpecies(() => speciesData);
			} catch {
				// do something
			}
		})();
	}, [inat_id, isMounted]);

	return (<>
		<h1>{species?.common_name}</h1>
		<p>{species?.scientific_name}</p>
		<figure>
			<img alt="" src={species?.photo.medium_url}/>
			<figcaption>
				{species?.photo.attribution.replace("(c)", "©")}
			</figcaption>
		</figure>
		<p>
			{species?.wikipedia_excerpt}
		</p>
		<p><a target="blank" href={species?.wikipedia_url}>
			Read more on Wikipedia
		</a></p>

		<pre style={{wordWrap: "break-word", wordBreak: "break-word", whiteSpace: "break-spaces", maxWidth: "100%"}}>{JSON.stringify(species,null,2)}</pre>
	</>);
}

export default SpeciesDetailPage;

/** Parses HTML-string wikipedia excerpts into JSX, keeping the formatting of
 * the <b> and <i> tags.
 *
 * A library would be overkill since its fairly simple and only done here,
 * and other options could leave XSS loopholes. */
function wikiExcerptToJSX(wiki) {
	const wikiStrs = wiki
		// trim enclosing paragraph tag
		.replaceAll(/<\/?p>/g, "")
		// mark what tags we're about to lose in the split
		.replaceAll(/<(b|i)>/g, "<$1>{{$1}}")
		// split on the tags
		.split(/<\/?(?:b|i)>/g);
	return (<>
		{wikiStrs.map((s,i) => {
			// even indexes in the arrays were wrapped with b/i tags
			if (i % 2) {
				let Tag = /\{\{(b|i)\}\}/.exec(s)[1];
				return <Tag key={i}>{s.substring(5)}</Tag>
			} else {
				return s;
			}
		})}
	</>);
}
