import { anyToString, capitalize } from '../Utils';

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
