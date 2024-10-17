import "./Announcement.scss";

/** Visually hidden live region for making announcements to assistive technology - primarily page navigation. */
function Announcement({ children }) {
	return (
		<span
			className={`sr-announcement`}
			aria-live="assertive"
			aria-atomic
		>
			{children}
		</span>
	);
}

export default Announcement;
