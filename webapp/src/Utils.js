function _sToSpaces(str_in) {
	return anyToString(str_in).replace(/_/g, ' ');
}

function anyToString(any) {
	try {
		return any.toString();
	} catch(e) {
		return '';
	}
}

function capitalize(str_in) {
	try {
		return str_in.charAt(0).toUpperCase() + str_in.slice(1);
	} catch(e) {
		return '';
	}
}

function checkJsonForErrors(input_json) {
	['error', 'errors'].forEach(error => {
		if (input_json.hasOwnProperty(error) && input_json[error]) {
			throw new Error(input_json[error]);
		}
	});
	return input_json;
}

export { _sToSpaces, anyToString, checkJsonForErrors, capitalize };