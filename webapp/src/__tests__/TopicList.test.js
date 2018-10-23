import React from 'react';
import { mount } from 'enzyme';

import TopicList from '../TopicList';

describe('TopicList', () => {
	it('shows loading message while waiting fetch result', async () => {
		const wrapper = await mount(<TopicList/>);
		expect(wrapper.find('.TopicList').hasClass('Loading')).toBe(true);
	});
});
