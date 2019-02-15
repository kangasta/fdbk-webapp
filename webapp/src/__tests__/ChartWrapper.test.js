import React from 'react';
import { mount } from 'enzyme';

import ChartWrapper from '../ChartWrapper';

describe('ChartWrapper', () => {
	it('renders without crashing', () => {
		mount(<ChartWrapper/>);
	});
	it('render error if unsupported type or no data', () => {
		[{type: 'unsupported'}, {type: 'line', data: []}].forEach(i => {
			const wrapper = mount(<ChartWrapper {...i}/>);
			expect(wrapper.exists('.Error')).toBe(true);
			expect(wrapper.exists('.VisualizationChart')).toBe(false);
		});
	});
});
