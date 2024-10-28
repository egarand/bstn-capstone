import { useEffect, useRef } from "react";

// Use in simple guard clauses in asynchronous operations to ensure a component
// is mounted before setting its state.
export default function useIsMounted() {
	const mountStatus = useRef(false);
	useEffect(() => {
		mountStatus.current = true;
		return () => mountStatus.current = false;
	}, []);
	return mountStatus;
}
