import React from 'react';
import { mount } from 'enzyme';

import DataAnalysis from '../DataAnalysis';

const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({topic: 'topic'})}); }), 1000);

describe('DataAnalysis',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<DataAnalysis/>);

		// Run CSChanger animation timers
		jest.runOnlyPendingTimers();
		wrapper.update();

		expect(wrapper.exists('.cs-changer-item-active .Error')).toBe(true);
	});
	it('automatically updates on specified interval', () => {
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = mount(<DataAnalysis topic_id='topic' update_interval={1000}/>);

		jest.runOnlyPendingTimers();
		wrapper.update();
		expect(wrapper.exists('.cs-changer-item-active .Loading')).toBe(true);

		jest.runOnlyPendingTimers();
		const n_calls = global.fetch.mock.calls.length;
		[1, 2, 3, 4].map(i => i + n_calls).forEach(i => {
			jest.runTimersToTime(1000);
			expect(global.fetch).toHaveBeenCalledTimes(i);
		});
	});
	it('clears timers at unmount', () => {
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = mount(<DataAnalysis topic_id='topic'/>);
		wrapper.unmount();
		expect(clearInterval).toHaveBeenCalled();
	});
});
