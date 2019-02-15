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

		const wrapper = shallow(<Summary topic_id='topic'/>);
		expect(wrapper.find('.Summary').hasClass('Loading')).toBe(true);

		jest.runOnlyPendingTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			expect(wrapper.find('.Summary').hasClass('Error')).toBe(true);
		});
	});
	it('automatically updates on specified interval', () => {
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({topic: 'topic'})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Summary topic_id='topic' update_interval={1000}/>);
		expect(wrapper.find('.Summary').hasClass('Loading')).toBe(true);

		jest.runOnlyPendingTimers();
		const n_calls = global.fetch.mock.calls.length;
		[1, 2, 3, 4].map(i => i + n_calls).forEach(i => {
			jest.runTimersToTime(1000);
			expect(global.fetch).toHaveBeenCalledTimes(i);
		});
	});
});
