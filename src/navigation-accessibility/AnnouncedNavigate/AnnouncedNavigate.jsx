import { useEffect } from "react";
import { useAnnouncedNavigate } from "../hooks/useAnnouncedNavigate";

function AnnouncedNavigate({ to, options }) {
	const navigate = useAnnouncedNavigate();
	useEffect(() => navigate(to, options));
	return <></>;
}

export default AnnouncedNavigate;
