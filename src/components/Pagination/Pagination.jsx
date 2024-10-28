import Button from "../Button/Button";
import "./Pagination.scss";

function Pagination({ currentPage, totalPages, onPrev, onNext }) {
	return (
		<nav className="pagination" aria-label="pagination">
			<Button
				className="pagination__button"
				variant="secondary"
				textSize="small"
				onClick={onPrev}
				disabled={currentPage === 1 || null}
			>Previous</Button>
			<p className="pagination__text">Page {currentPage} / {totalPages}</p>
			<Button
				className="pagination__button"
				variant="secondary"
				textSize="small"
				onClick={onNext}
				disabled={currentPage === totalPages || null}
			>Next</Button>
		</nav>
	);
}

export default Pagination;
