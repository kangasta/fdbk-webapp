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
	footer_text: "fdbk"
};

FdbkContainer.propTypes = {
	footer_text: PropTypes.string
};

export default FdbkContainer;
