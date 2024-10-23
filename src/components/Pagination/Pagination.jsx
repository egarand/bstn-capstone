import Button from "../Button/Button";
import "./Pagination.scss";

function Pagination({ currentPage, totalPages, onPrev, onNext }) {
	return (
		<nav className="pagination" aria-label="pagination">
			<Button
				variant="secondary"
				onClick={onPrev}
				disabled={currentPage === 1 || null}
			>Previous</Button>
			<p>Page {currentPage} / {totalPages}</p>
			<Button
				variant="secondary"
				onClick={onNext}
				disabled={currentPage === totalPages || null}
			>Next</Button>
		</nav>
	);
}

export default Pagination;
