import React from 'react';
import { mount } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Form/>);
		expect(wrapper.find('.Form').hasClass('Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('shows loading message while waiting fetch result and error when fetch fails', () => {
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({error: 'Failing fetch() mock'})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = mount(<Form topic='topic'/>);
		expect(wrapper.find('.Form').hasClass('Loading')).toBe(true);

		jest.runAllTimers();
		fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			expect(wrapper.find('.Form').hasClass('Error')).toBe(true);
		});
	});
});
