import React from 'react';
import { mount } from 'enzyme';

import CallbackTimer from '../CallbackTimer';

jest.useFakeTimers();

describe('CallbackTimer', () => {
	it('renders without crashing', () => {
		mount(<CallbackTimer/>);
	});
});
