import React from 'react';
import { mount } from 'enzyme';

import Summaries from '../sub-components/Summaries';

describe('Summaries', () => {
	it('renders without crashing', () => {
		mount(<Summaries/>);
	});
	it('renders empty div when no data given', () => {
		const wrapper = mount(<Summaries data={[]}/>);
		expect(wrapper.find('.Summaries').children()).toHaveLength(0);
	});
});
