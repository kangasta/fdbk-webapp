import React from 'react';
import { mount } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Form/>);
		expect(wrapper.find('.Form').hasClass('Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('shows loading message while waiting fetch result', async () => {
		const wrapper = mount(<Form topic='topic'/>);
		expect(wrapper.find('.Form').hasClass('Loading')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
});
