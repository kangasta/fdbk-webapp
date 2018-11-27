import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FdbkContainer.css';

class FdbkContainer extends Component {
	render() {
		return (
			<div data-footer-text={this.props.footer_text} className="FdbkContainer">
				{this.props.children}
				<div className='FdbkContainerFooter Link' onClick={() => { this.props.navigate('/#/'); }}>{this.props.footer_text}</div>
			</div>
		);
	}
}

FdbkContainer.defaultProps = {
	children: null,
	footer_text: 'fdbk',
	navigate: () => undefined
};

FdbkContainer.propTypes = {
	children: PropTypes.node,
	footer_text: PropTypes.string,
	navigate: PropTypes.func
};

export default FdbkContainer;
