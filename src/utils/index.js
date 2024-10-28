
/** Get the centroid of a polygon.
 * https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
 * @returns {number[]} */
export function polygonCentroid(points) {
	// close the polygon if it's not already closed - required for the formula
	const first = points[0], last = points[points.length - 1];
	if (first.lat !== last.lat || first.lon !== last.lon) {
		points.push(first);
	}

	let areaX2 = 0, lat = 0, lon = 0;
	for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
		let p1 = points[i], p2 = points[j],
			f = (p1.lat * p2.lon) - (p2.lat * p1.lon);
		areaX2 += f;
		lat += (p1.lat + p2.lat) * f;
		lon += (p1.lon + p2.lon) * f;
	}

	return {
		lat: lat / (areaX2 * 3),
		lon: lon / (areaX2 * 3)
	};
}

/** Round a number to a certain amount of decimal places.
 * @returns {number} */
export function round(num, decimals) {
	const mult = Number(String(1).padEnd(decimals, 0));
	return Math.round((num + Number.EPSILON) * mult) / mult;
}

/** Ternary operator for try-catch blocks. */
export function trycatch(fn, errorVal = null) {
	try {
		return fn();
	}
	catch {
		return errorVal;
	}
}

/** Extracts a more human-readable error message out of an error object */
export function errorMessage(errorObj) {
	if (errorObj?.response) {
		const { data } = errorObj.response;
		if (typeof data === "string" && !data.startsWith("<!DOCTYPE")) {
			return data;
		} else if (typeof data === "object") {
			if (data.errors) {
				return data.errors.map((e) => `${e.path}: ${e.msg}`);
			} else if (data.message) {
				return data.message;
			}
		} else if (errorObj.message) {
			return errorObj.message;
		}
		return data;
	}
	return errorObj?.message || "Unknown error";
}
