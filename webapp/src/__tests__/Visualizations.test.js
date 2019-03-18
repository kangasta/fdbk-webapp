import React from 'react';
import { mount } from 'enzyme';

import Visualizations from '../sub-components/Visualizations';

describe('Visualizations', () => {
	it('renders without crashing', () => {
		mount(<Visualizations/>);
	});
	it('renders empty div when no data given', () => {
		const wrapper = mount(<Visualizations data={[]}/>);
		expect(wrapper.find('.Visualizations').children()).toHaveLength(0);
	});
});
