import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSValidatorChanger } from 'chillisalmon';

import { checkJsonForErrors } from './Utils';
import Visualizations from './sub-components/Visualizations';

class Comparison extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for feedback topic data'
			}
		};
	}

	componentDidMount() {
		if (!this.props.topic_ids) {
			this.setState({view: {error: 'Comparison created without topics'}});
			return;
		}
		this.setState({
			updateIntervalId: setInterval(()=>{
				this.update();
			}, this.props.update_interval)});
		return this.update();
	}

	componentWillUnmount() {
		clearInterval(this.state.updateIntervalId);
	}

	update() {
		return fetch('/get/comparison/' + this.props.topic_ids.join(','))
			.then((response) => response.json())
			.then(checkJsonForErrors)
			.then((response_json) => {
				this.setState({view: response_json});
			})
			.catch(() => {
				this.setState({view: {error: 'Unable to fetch data'}});
			});
	}

	getTopicsString() {
		try {
			const topics = this.state.view.topic_names;
			if (topics.length === 1) return topics[0];
			if (topics.length === 2) return topics.join(' and ');
			return topics.slice(0,-1).join(', ') + ', and ' + topics.slice(-1);
		} catch(e) {
			return null;
		}
	}

	getContent() {
		try {
			return (
				<div className='Content'>
					<p>Comparing topics {this.getTopicsString()}</p>
					<Visualizations data={this.state.view.visualizations}/>
					{/* Output current state for debugging: <p className='Code'>{JSON.stringify(this.state, null, 2)}</p> */}
				</div>
			);
		} catch(e) {
			return null;
		}
	}

	getTitle() {
		return 'Topics comparison';
	}

	render() {
		return (
			<div className='Comparison'>
				<h1>{this.getTitle()}</h1>
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getContent()}
				</CSValidatorChanger>
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
Comparison.defaultProps = {
	update_interval: 30e3,
};

Comparison.propTypes = {
	topic_ids: PropTypes.arrayOf(PropTypes.string),
	update_interval: PropTypes.number,
};

export default Comparison;
