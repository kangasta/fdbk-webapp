import React from 'react';
import ReactDOM from 'react-dom';
import CallbackTimer from './CallbackTimer';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<CallbackTimer/>, div);
	ReactDOM.unmountComponentAtNode(div);
});
