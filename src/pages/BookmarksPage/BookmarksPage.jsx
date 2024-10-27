import { useEffect, useState } from "react";
import { useAccessibleNav } from "../../navigation-accessibility";
import { trycatch } from "../../utils";
import useApi, { api } from "../../utils/api";

import Loader from "../../components/Loader/Loader";
import PaginatedCards from "../../components/PaginatedCards/PaginatedCards";
import PoiOverview from "../../components/PoiOverview/PoiOverview";
import Icon from "../../components/Icon/Icon";

import "./BookmarksPage.scss";
import closeSrc from "../../assets/icons/close.svg";

function BookmarksPage() {
	const { refocusPageTop } = useAccessibleNav();
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

	async function deleteBookmark(id) {
		await api("delete", `/users/pois/${id}`);
		await fetchBookmarks("get", "/users/pois");
		refocusPageTop();
	}

	return (
	<section className="bookmark-page" aria-busy={loading}>
		<h1 className="bookmark-page__title">Your Bookmarks</h1>
		<Loader isLoading={loading} errorObj={error}/>
		{!loading && !error && (
			<PaginatedCards items={bookmarks?.map((b) => (<>
				<PoiOverview
					key={`${b.osm_type}${b.osm_id}`}
					poi={b}
					taxa={taxa}
					headingTag="h2"
					headerClassName="bookmark-page__poi-header" />
				<button
					className="bookmark-page__delete-btn"
					onClick={() => deleteBookmark(b.id)}
				>
					<Icon src={closeSrc} alt="Delete bookmark" />
				</button>
			</>))} perPage={16} type="poi"/>
		)}
	</section>);
}

export default BookmarksPage;
