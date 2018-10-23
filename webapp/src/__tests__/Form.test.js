import React from 'react';
import { mount } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('renders without crashing', () => {
		mount(<Form/>);
	});
});
