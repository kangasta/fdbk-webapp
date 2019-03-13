import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style/NavBar.css';

class NavBar extends Component {
	render() {
		return (
			<div className="NavBar">
				<ul>
					<li className='Title' onClick={() => {this.props.navigate('/');}}>{this.props.title}</li>
					{this.props.links.map(link => (
						<li key={link.target} className='Target' onClick={() => {this.props.navigate(link.target);}}>{link.text}</li>
					))}
				</ul>
			</div>
		);
	}
}

NavBar.defaultProps = {
	navigate: () => undefined,
	links: [],
};

NavBar.propTypes = {
	links: PropTypes.arrayOf(PropTypes.shape({
		text: PropTypes.string,
		target: PropTypes.string,
	})),
	navigate: PropTypes.func,
	title: PropTypes.node,
};

export default NavBar;
