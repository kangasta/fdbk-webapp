import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FdbkContainer.css';

class FdbkContainer extends Component {
	render() {
		return (
			<div className="FdbkContainer">
				{this.props.children}
			</div>
		);
	}
}

export default FdbkContainer;
