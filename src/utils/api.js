import axios from "axios";
import axiosRetry from "axios-retry";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useIsMounted from "../hooks/useIsMounted";

// Module for making requests to the Hike & Seek API - includes tools for
// automatic request cancellation when the user navigates.

let previousPath = "", currentPath = "";
const axiosInstances = {};

function createAxiosInstance() {
	const controller = new AbortController();
	const customAxios = {
		controller,
		instance: axios.create({
			baseURL: import.meta.env.VITE_API_URL,
			timeout: 15_000,
			signal: controller.signal
		})
	};
	return customAxios;
}

function getAxiosInstance(path) {
	if (axiosInstances[path] && !axiosInstances[path].controller.signal.aborted) {
		return axiosInstances[path].instance;
	} else {
		axiosInstances[path] = createAxiosInstance();
		axiosRetry(axiosInstances[path].instance, { retries: 3, shouldResetTimeout: true });
		return axiosInstances[path].instance;
	}
}

/** Use to cancel all api requests which were started by the given path (`useLocation().pathname`) */
export function cancelAllPageRequests(path) {
	axiosInstances[path]?.controller.abort();
}

/** Can be used to make API calls - but consider using `useApi` if you need
 * to manage data/load/error states for an api call.
 *
 * Requests will be canceled if the user navigates to a new page; handle
 * `CanceledError` appropriately. Change axios-retry config with an
 * `'axios-retry'` key in the `config` object. */
export async function api(method, path, data = null, config = null) {
	const axios = getAxiosInstance(window.location.pathname);
	return await axios({
		method,
		url: path,
		data,
		...config
	});
}

/** Use in App.jsx to enable automatic cancellation of pending requests when
 * the user navigates to a new page. */
export function useRequestCancellationOnNav() {
	const location = useLocation();
	useEffect(() => {
		if (!previousPath && !currentPath) {
			previousPath = currentPath = location.pathname;
		} else {
			previousPath = currentPath;
			currentPath = location.pathname;
		}
		if (previousPath !== currentPath) {
			cancelAllPageRequests(previousPath);
		}
	}, [location.pathname]);
}

/** Reusable data/loading/error states and a function for fetching API data
 * with built-in error catching. */
export default function useApi(initialData = null, startInLoadState = false) {
	const isMounted = useIsMounted();
	const [data, setData] = useState(initialData),
		[loading, setLoading] = useState(startInLoadState),
		[error, setError] = useState(null);

	const fetchData = useCallback(async (method, path, data = null, config = null) => {
		setData(null);
		setError(null);
		setLoading(true);
		try {
			const response = await api(method, path, data, config);
			if (!isMounted.current) { return; }
			setLoading(false);
			setData(response.data);
		} catch (error) {
			console.error(error);
			if (!isMounted.current) { return; }
			setLoading(false);
			if (error.name !== "CanceledError") {
				setError(error);
			}
		}
	}, [isMounted]);

	return [ fetchData, data, loading, error ];
}
