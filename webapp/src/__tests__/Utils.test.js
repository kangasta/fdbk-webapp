import { _sToSpaces, anyToString, checkJsonForErrors, capitalize } from '../Utils';

describe('Utils._sToSpaces', () => {
	it('converts underscores to spaces', () => {
		expect(_sToSpaces('Hello_underscore!')).toEqual('Hello underscore!');
		expect(_sToSpaces('m_u_l_t_i')).toEqual('m u l t i');
	});
	it('does no throw on invalid input', () => {
		[null, undefined, 123].forEach(_sToSpaces);
	});
});

describe('Utils.anyToString', () => {
	it('converts valid inputs to string', () => {
		expect(anyToString(123)).toEqual('123');
	});
	it('does not crash on invalid inputs', () => {
		[null, undefined].forEach(i => {
			expect(anyToString(i)).toEqual('');
		});
	});
});

describe('Utils.capitalize', () => {
	it('capitalizes the input string', () => {
		expect(capitalize('asd')).toEqual('Asd');
	});
	it('does not crash on non string inputs', () => {
		[null, undefined].forEach(i => {
			expect(capitalize(i)).toEqual('');
		});
	});
});

describe('Utils.checkJsonForErrors', () => {
	it('passes through the input json if no errors found', () => {
		[
			{valid: 'input'},
			{error: null}
		].forEach(input => {
			expect(checkJsonForErrors(input)).toEqual(input);
		});
	});
	it('throws error if non empty error field present in input json', () => {
		[
			{error: 'test'},
			{errors: 'test'}
		].forEach(input => {
			expect(() => checkJsonForErrors(input)).toThrow();
		});
	});
});
