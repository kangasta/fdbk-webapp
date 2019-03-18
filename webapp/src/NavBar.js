import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style/NavBar.css';

class NavBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false
		};

		this.toggleOpen = this.toggleOpen.bind(this);
	}

	toggleOpen() {
		this.setState(prev => ({
			open: !prev.open
		}));
	}

	render() {
		const targetOnClick = link => (() => {
			this.toggleOpen();
			this.props.navigate(link.target);
		});

		return (
			<div className={'NavBar ' + (this.state.open ? 'Open' : '')}>
				<ul>
					<li className='Title Link' onClick={this.toggleOpen}>{this.props.title}</li>
					{this.props.links.map(link => (
						<li key={link.target} className='Target Link' onClick={targetOnClick(link)}>{link.text}</li>
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
