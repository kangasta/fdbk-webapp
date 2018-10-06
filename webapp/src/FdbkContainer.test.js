import React from 'react';
import ReactDOM from 'react-dom';
import FdbkContainer from './FdbkContainer';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<FdbkContainer/>, div);
	ReactDOM.unmountComponentAtNode(div);
});
