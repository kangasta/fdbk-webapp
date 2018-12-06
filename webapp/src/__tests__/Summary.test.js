import React from 'react';
import { mount, shallow } from 'enzyme';

import Summary from '../Summary';

describe('Summary',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Summary/>);
		expect(wrapper.find('.Summary').hasClass('Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('shows loading message while waiting fetch result and error when fetch fails', () => {
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({error: 'Failing fetch() mock'})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Summary topic='topic'/>);
		expect(wrapper.find('.Summary').hasClass('Loading')).toBe(true);

		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			expect(wrapper.find('.Summary').hasClass('Error')).toBe(true);
		});
	});
});
