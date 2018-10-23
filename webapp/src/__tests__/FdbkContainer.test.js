import React from 'react';
import { mount } from 'enzyme';

import FdbkContainer from '../FdbkContainer';

describe('FdbkContainer', () => {
	it('renders without crashing', () => {
		mount(<FdbkContainer/>);
	});
});
