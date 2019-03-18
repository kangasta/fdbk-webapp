import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSStatus, CSValidatorChanger } from 'chillisalmon';

import { checkJsonForErrors } from './Utils';
import Visualizations from './sub-components/Visualizations';
import Summaries from './sub-components/Summaries';

class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for feedback topic data'
			}
		};
	}

	componentDidMount() {
		if (!this.props.topic_id) {
			this.setState({view: {error: 'Summary created without topic'}});
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
		return fetch('/get/summary/' + this.props.topic_id)
			.then((response) => response.json())
			.then(checkJsonForErrors)
			.then((response_json) => {
				this.setState({view: response_json});
			})
			.catch(() => {
				this.setState({view: {error: 'Unable to fetch data'}});
			});
	}

	getContent() {
		try {
			return (
				<div className='Content'>
					<p>{this.state.view.description}</p>
					{this.state.view.warnings.map(i => (
						<CSStatus key={i} status={CSStatus.status.WARNING} message={i}/>
					))}
					<Summaries data={this.state.view.summaries} numEntries={this.state.view.num_entries} units={this.state.view.units}/>
					<Visualizations data={this.state.view.visualizations}/>
					{/* Output current state for debugging: <p className='Code'>{JSON.stringify(this.state, null, 2)}</p> */}
				</div>
			);
		} catch(e) {
			return null;
		}
	}

	getTitle() {
		return this.state.view.topic || this.props.topic_name;
	}

	render() {
		return (
			<div className='Summary'>
				<h1>{this.getTitle()}</h1>
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getContent()}
				</CSValidatorChanger>
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
Summary.defaultProps = {
	topic_id: '',
	topic_name: 'Summary',
	update_interval: 30e3,
};

Summary.propTypes = {
	topic_id: PropTypes.string,
	topic_name: PropTypes.string,
	update_interval: PropTypes.number,
};

export default Summary;
