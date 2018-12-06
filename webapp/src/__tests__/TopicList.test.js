import React from 'react';
import { shallow } from 'enzyme';

import TopicList from '../TopicList';

describe('TopicList', () => {
	it('shows loading message while waiting fetch result and error when fetch fails', () => {
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({error: 'Failing fetch() mock'})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<TopicList topic='topic'/>);
		expect(wrapper.find('.TopicList').hasClass('Loading')).toBe(true);

		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			expect(wrapper.find('.TopicList').hasClass('Error')).toBe(true);
		});
	});
});
