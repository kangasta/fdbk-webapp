import React from 'react';
import { mount } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('renders without crashing', async () => {
		const wrapper = mount(<Form/>);
		await wrapper.instance().componentDidMount();
	});
});
