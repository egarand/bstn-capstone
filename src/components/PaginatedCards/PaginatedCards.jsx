import { useEffect, useMemo, useState } from "react";
import Pagination from "../Pagination/Pagination";
import "./PaginatedCards.scss";

/** `type` can be "poi" (default) or "species"  */
function PaginatedCards({ items, perPage, type = "poi" }) {
	const [page, setPage] = useState(1);
	const [pageTotal, random] = useMemo(() => { return [
		Math.ceil((items?.length ?? 1) / perPage),
		Date.now()
	]}, [items, perPage]);

	useEffect(() => setPage(1), [items]);

	function paginate(direction) {
		setPage(Math.max(1, Math.min(pageTotal, page + direction)));
	}

	return (<>
		<Pagination
			currentPage={page}
			totalPages={pageTotal}
			onPrev={() => paginate(-1)}
			onNext={() => paginate(1)} />
		<ul className={`paged-cards__list paged-cards__list--${type}`}>
			{items
				?.slice(
					(page - 1) * perPage,
					(page - 1) * perPage + perPage
				).map((i, idx) => (
				<li
					key={`${idx}-${random}`}
					className="paged-cards__item"
				>
					{i}
				</li>
			))}
		</ul>
		<Pagination
			currentPage={page}
			totalPages={pageTotal}
			onPrev={() => paginate(-1)}
			onNext={() => paginate(1)} />
	</>)
}

export default PaginatedCards;
