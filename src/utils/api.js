import axios from "axios";
import axiosRetry from "axios-retry";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

/** Use to make API calls. All requests made with this function will be canceled
 * if the user navigates to a new page. Always wrap in a try-catch and suppress `CanceledError`.
 *
 * Change axios-retry config with an `'axios-retry'` key in the `config` object. */
export default async function api(method, path, data = null, config = null) {
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
