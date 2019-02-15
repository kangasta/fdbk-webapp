function capitalize(str_in) {
	try {
		return str_in.charAt(0).toUpperCase() + str_in.slice(1);
	} catch(e) {
		return '';
	}
}

function anyToString(any) {
	try {
		return any.toString();
	} catch(e) {
		return '';
	}
}

export { anyToString, capitalize };