import React from 'react';
import { mount } from 'enzyme';

import TopicList from '../TopicList';

describe('TopicList', () => {
	it('renders without crashing', () => {
		mount(<TopicList/>)
	});
});
