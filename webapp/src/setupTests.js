import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Fail tests on any warning
console.error = message => { // eslint-disable-line no-console
	throw new Error(message);
};
