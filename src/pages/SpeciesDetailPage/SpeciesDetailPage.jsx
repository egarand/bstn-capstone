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
