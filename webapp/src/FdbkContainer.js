import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FdbkContainer.css';

class FdbkContainer extends Component {
	render() {
		return (
			<div data-footer-text={this.props.footer_text} className="FdbkContainer">
				{this.props.children}
			</div>
		);
	}
}

FdbkContainer.defaultProps = {
	children: null,
	footer_text: 'fdbk'
};

FdbkContainer.propTypes = {
	children: PropTypes.node,
	footer_text: PropTypes.string
};

export default FdbkContainer;
