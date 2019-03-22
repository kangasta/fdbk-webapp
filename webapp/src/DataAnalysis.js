import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSStatus, CSValidatorChanger } from 'chillisalmon';

import { checkJsonForErrors } from './Utils';
import Visualizations from './sub-components/Visualizations';
import Summaries from './sub-components/Summaries';

class DataAnalysis extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for ' + props.type + ' data'
			}
		};
	}

	getUrl() {
		try {
			const type = this.props.type;
			switch(type) {
			case 'comparison':
				if (this.props.topic_ids.length < 1) throw new Error();
				return '/comparison/' + this.props.topic_ids.join(',');
			case 'overview':
				return '/overview';
			case 'summary':
				if (!this.props.topic_id) throw new Error();
				return '/topics/' + this.props.topic_id + '/summary';
			default:
				throw new Error();
			}
		} catch(e) {/* eslint-disable-line no-empty */}
		return null;
	}

	validate() {
		const valid = !!this.getUrl();

		if (!valid) {
			this.setState({view: {error: 'DataAnalysis created with invalid parameters'}});
		}

		return valid;
	}

	componentDidMount() {
		if (!this.validate()) return;
		this.setState({
			updateIntervalId: setInterval(()=>{
				this.update();
			}, this.props.update_interval)});
		return this.update();
	}

	componentWillUnmount() {
		clearInterval(this.state.updateIntervalId);
	}

	componentDidUpdate(prevProps) {
		const newType = prevProps.type !== this.props.type;
		if (newType) {
			this.setState({
				'view': {
					'loading': 'Waiting for ' + this.props.type + ' data'
				}
			});
			return this.update();
		}
	}

	update() {
		if (!this.validate()) return;
		return fetch(this.getUrl())
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

	getDescription() {
		const type = this.props.type;
		switch(type) {
		case 'comparison':
			return 'Comparing topics ' + this.getTopicsString();
		case 'overview':
			return 'Overviewing topics ' + this.getTopicsString();
		case 'summary':
			return this.state.view.description;
		default:
			return null;
		}
	}

	getContent() {
		try {
			return (
				<div className='Content'>
					<p>{this.getDescription()}</p>
					{this.state.view.warnings.map(i => (
						<CSStatus key={i} status={CSStatus.status.WARNING} message={i}/>
					))}
					<Summaries data={this.state.view.summaries} numEntries={this.state.view.num_entries} showTitle={this.props.type === 'overview'}/>
					<Visualizations data={this.state.view.visualizations}/>
					{/* Output current state for debugging: <p className='Code'>{JSON.stringify(this.state, null, 2)}</p> */}
				</div>
			);
		} catch(e) {
			return null;
		}
	}

	getTitle() {
		const plural = ['comparison', 'overview'].includes(this.props.type) ? 's' : '';
		const defaultTitle = 'Topic' + plural + ' ' + this.props.type;

		return this.state.view.topic || defaultTitle;
	}

	render() {
		return (
			<div className='DataAnalysis'>
				<h1>{this.getTitle()}</h1>
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getContent()}
				</CSValidatorChanger>
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
DataAnalysis.defaultProps = {
	type: 'summary',
	update_interval: 30e3,
};

DataAnalysis.propTypes = {
	topic_id: PropTypes.string,
	topic_ids: PropTypes.arrayOf(PropTypes.string),
	type: PropTypes.oneOf(['comparison', 'overview', 'summary']),
	update_interval: PropTypes.number,
};

export default DataAnalysis;
