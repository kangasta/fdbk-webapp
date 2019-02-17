import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { CSStatus, CSValidatorChanger } from 'chillisalmon';

import ChartWrapper from './ChartWrapper';
import { capitalize } from './Utils';

import './style/Summary.css';

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

	update() {
		return fetch('/get/summary/' + this.props.topic_id)
			.then((response) => response.json())
			.then((response_json) => {
				if (response_json.hasOwnProperty('error') && response_json.error) {
					throw new Error(response_json.error);
				}
				this.setState({view: response_json});
			})
			.catch(() => {
				this.setState({view: {error: 'Unable to fetch data'}});
			});
	}

	getUnit(field) {
		const unit = this.state.view.units.find(u => (u.field === field));
		return (unit !== undefined) ? unit.unit : undefined;
	}

	getSummaryComponent(summary_item) {
		var intro=null, hilight=null, detail=null;

		switch(summary_item.type) {
		case 'last_truthy':
		case 'last_falsy':
			if (summary_item.value === null) return null;
			intro = 'Last ' + summary_item.field + ' ';
			detail = moment(summary_item.value).fromNow();
			break;
		default:
			intro = capitalize(summary_item.type).replace('_', ' ') + ' ' + summary_item.field;
			hilight = (
				<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{Math.round(summary_item.value * 10) / 10}</span>
			);
			detail = this.getUnit(summary_item.field);
		}
		return (
			<p key={summary_item.type.toString() + summary_item.field.toString()} className='SummaryItem FdbkContainerHighlight'>
				{intro}
				{hilight}
				{detail}
			</p>
		);
	}

	getContent() {
		try {
			return (
				<div className='Content'>
					<p>{this.state.view.description}</p>
					<div className='Summaries'>
						{this.state.view.warnings.map(i => (
							<CSStatus key={i} status={CSStatus.status.WARNING} message={i}/>
						))}
						<p className='SummaryItem FdbkContainerHighlight'>
							<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{this.state.view.num_entries}</span>entries
						</p>
						{this.state.view.summaries.map(i => {
							if (i === null) return null;
							// TODO: Nan warning
							return this.getSummaryComponent(i);
						})}
					</div>
					<div className='Visualizations'>
						{this.state.view.visualizations.map(i => {
							if (i === null) return null;
							return (
								<div key={i.type.toString() + i.field.toString()} className='VisualizationItem'>
									<h2>{capitalize(i.field)}</h2>
									<ChartWrapper {...i}/>
								</div>
							);
						})}
					</div>
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
