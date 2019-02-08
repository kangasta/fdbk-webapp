import Chart from 'chart.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style/Summary.css';

class Summary extends Component {
	horseshoe_options = {
		circumference: 3 / 2 * Math.PI,
		rotation: -5 / 4 * Math.PI
	};

	line_options = {
		scales: {
			xAxes: [{
				type: 'time',
				display: false
			}]
		},
		legend: {
			display: false
		},
	};

	supported_chart_types = [
		'horseshoe',
		'line'
	];

	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for feedback topic data from server'
			}
		};
	}

	static capitalize(str_in) {
		return (str_in.charAt(0).toUpperCase() + str_in.slice(1));
	}

	getChartObject(chartItem) {
		const id = 'VisualizationChart' + Summary.capitalize(chartItem.field) + Summary.capitalize(chartItem.type);

		if (chartItem.type === 'horseshoe') {
			new Chart(id, {
				type: 'doughnut',
				data: {
					datasets: [{
						data: chartItem.data,
						backgroundColor: ['#300080', '#580080', '#800080', '#800058', '#800030'],
						borderColor: ['#CCC', '#CCC', '#CCC', '#CCC', '#CCC']
					}],
					labels: chartItem.labels
				},
				options: this.horseshoe_options
			});
		} else if(chartItem.type === 'line') {
			new Chart(id, {
				type: 'line',
				data: {
					datasets: [{
						data: chartItem.data,
						label: [Summary.capitalize(chartItem.field)],
						borderColor: ['#800080'],
						fill: false
					}],
					labels: chartItem.labels.map(a => new Date(a))
				},
				options: this.line_options
			});
		}
		return null;
	}

	componentDidMount() {
		if (!this.props.topic_id) {
			this.setState({view: {error: 'Summary created without topic'}});
			return;
		}
		return fetch('/get/summary/' + this.props.topic_id)
			.then((response) => response.json())
			.then((response_json) => {
				if (response_json.hasOwnProperty('error') && response_json.error) {
					throw new Error(response_json.error);
				}
				this.setState({view: response_json});
			})
			.catch((error_msg) => {
				this.setState({view: {error: error_msg.toString()}});
			});
	}

	componentDidUpdate() {
		// TODO, This is for initial demo, please parametrize later
		if (!this.state.view.visualizations) return;
		this.state.view.visualizations.map(i => {
			if (i === null) return null;
			return this.getChartObject(i);
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
			intro = Summary.capitalize(summary_item.type).replace('_', ' ') + ' ' + summary_item.field;
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

	render() {
		if (this.state.view.hasOwnProperty('loading')) {
			return (
				<div className='Summary Loading'>
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty('error')) {
			return (
				<div className='Summary Error'>
					<h1>Error</h1>
					<p>{this.state.view.error.toString()}</p>
				</div>
			);
		}

		// TODO, This is for initial demo, please parametrize later
		return (
			<div className='Summary'>
				<h1>{this.state.view.topic}</h1>
				<p>{this.state.view.description}</p>
				<div className='Summaries'>
					{this.state.view.warnings.map(i => (
						<p key={i} className='SummaryItem FdbkContainerHighlight DarkHighlight'>
							<span className='FdbkContainerHighlightTitle'>Warning!</span><br/>
							{i}
						</p>
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
								<h2>{Summary.capitalize(i.field)}</h2>
								{this.supported_chart_types.includes(i.type)
									? <canvas className='VisualizationChart' id={'VisualizationChart' + Summary.capitalize(i.field) + Summary.capitalize(i.type)} width='800' height='400'></canvas>
									: <p>Chart type {'\'' + i.type.toString() + '\''} not supported by front-end.</p>}
							</div>
						);
					})}
				</div>
				{/* Output current state for debugging: <p className='Code'>{JSON.stringify(this.state, null, 2)}</p> */}
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
Summary.defaultProps = {
	topic_id: '',
};

Summary.propTypes = {
	topic_id: PropTypes.string,
};

export default Summary;
