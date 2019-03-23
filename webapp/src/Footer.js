import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style/Footer.css';

class Footer extends Component {
	render() {
		return (
			<div className='Footer'>
				<a href='https://github.com/kangasta/fdbk-webapp'>WebUI Source code</a>
				<a href='https://github.com/kangasta/fdbk'>Back-end Source code</a>
				<a href='https://github.com/kangasta/fdbk-webapp/blob/master/webapp/package-lock.json'>Used open-source software</a>
			</div>
		);
	}
}

Footer.defaultProps = {
	navigate: () => undefined,
	links: [],
};

Footer.propTypes = {
	links: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string,
		target: PropTypes.string,
	})),
	navigate: PropTypes.func,
	title: PropTypes.node,
};

export default Footer;
