import React from 'react';
import { mount } from 'enzyme';

import Summary from '../Summary';

describe('Summary',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Summary/>);
		expect(wrapper.find('.Summary').hasClass('Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('shows loading message while waiting fetch result', async () => {
		const wrapper = mount(<Summary topic='topic'/>);
		expect(wrapper.find('.Summary').hasClass('Loading')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
});
