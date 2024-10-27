import { useEffect, useState } from "react";
import { trycatch } from "../../utils";
import useApi from "../../utils/api";
import Loader from "../../components/Loader/Loader";
import PoiOverview from "../../components/PoiOverview/PoiOverview";
import PaginatedCards from "../../components/PaginatedCards/PaginatedCards";
import "./BookmarksPage.scss";

function BookmarksPage() {
	const [fetchBookmarks, bookmarks, loading, error] = useApi([]);

	const [taxa] = useState(
		trycatch(() =>
			JSON.parse(localStorage.getItem("explore_input")).taxa
		)
		?? []
	);

	useEffect(() => {
		fetchBookmarks("get", "/users/pois");
	}, [fetchBookmarks]);

	return (
	<section className="bookmark-page" aria-busy={loading}>
		<h1 className="bookmark-page__title">Your Bookmarks</h1>
		<Loader isLoading={loading} errorObj={error}/>
		{!loading && !error && (
			<PaginatedCards items={bookmarks?.map((b) => (
				<PoiOverview
					key={`${b.osm_type}${b.osm_id}`}
					poi={b}
					taxa={taxa}
					headingTag="h2"
					headerClassName="bookmark-page__poi-header" />
			))} perPage={16} type="poi"/>
		)}
	</section>);
}

export default BookmarksPage;
