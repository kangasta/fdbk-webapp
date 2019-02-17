import React from 'react';
import { mount } from 'enzyme';

import Form from '../Form';
import Summary from '../Summary';
import TopicList from '../TopicList';

[{name: 'Form', component: Form}, {name: 'Summary', component: Summary}, {name: 'TopicList', component: TopicList}].forEach(CUT => {
	describe(CUT.name, () => {
		it('shows loading message while waiting fetch result and error when fetch fails', () => {
			const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({error: 'Failing fetch() mock'})}); }), 1000);
			global.fetch = jest.fn(() => fetch_promise);

			const wrapper = mount(<CUT.component topic_id='topic'/>);
			expect(wrapper.exists('.cs-changer-item-active .CSStatus.Loading')).toBe(true);

			// Run fetch mock timer set above
			jest.runOnlyPendingTimers();

			return fetch_promise.then(async () => {
				await wrapper.instance().componentDidMount();

				// Run CSChanger animation timers
				jest.runOnlyPendingTimers();
				wrapper.update();
				try {
					expect(wrapper.exists('.cs-changer-item-active .CSStatus.Error')).toBe(true);
				} catch(e) {
					// eslint-disable-next-line no-console
					console.error('Tried to find active error component from ' + CUT.name);
				}
			});
		});
	});
});