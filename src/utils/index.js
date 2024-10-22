
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

