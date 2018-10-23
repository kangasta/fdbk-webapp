import React from 'react';
import { mount } from 'enzyme';

import Summary from '../Summary';

describe('Summary',() => {
	it('renders without crashing', () => {
		mount(<Summary/>)
	});
});
