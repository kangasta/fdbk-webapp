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

function anyToString(any) {
	try {
		return any.toString();
	} catch(e) {
		return '';
	}
}

export { anyToString, checkJsonForErrors, capitalize };