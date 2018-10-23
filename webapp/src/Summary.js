import Chart from 'chart.js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Summary.css';

class Summary extends Component {
	horseshoe_options = {
		circumference: 3 / 2 * Math.PI,
		rotation: -5 / 4 * Math.PI
	};

	supported_chart_types = [
		'horseshoe'
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
		if (chartItem.type == 'horseshoe') {
			const id = 'VisualizationChart' + Summary.capitalize(chartItem.field);

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
		}
		return null;
	}

	componentDidMount() {
		if (!this.props.topic) {
			this.setState({view: {error: 'Summary created without topic'}});
			return;
		}
		return fetch('/get/summary/' + this.props.topic)
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

	render() {
		if (this.state.view.hasOwnProperty('loading')) {
			return (
				<div className='Summary'>
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty('error')) {
			return (
				<div className='Summary'>
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
					<p className='SummaryItem FdbkContainerHighlight'>
						<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{this.state.view.num_entries}</span>entries
					</p>
					{this.state.view.summaries.map(i => {
						if (i === null) return null;
						return (
							<p key={i} className='SummaryItem FdbkContainerHighlight'>
								{Summary.capitalize(i.type)}<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{Math.round(i.value * 10) / 10}</span>{i.field}
							</p>
						);
					})}
				</div>
				<div className='Visualizations'>
					{this.state.view.visualizations.map(i => {
						if (i === null) return null;
						return (
							<div key={i} className='VisualizationItem'>
								<h2>{Summary.capitalize(i.field)}</h2>
								{this.supported_chart_types.includes(i.type)
									? <canvas className='VisualizationChart' id={'VisualizationChart' + Summary.capitalize(i.field)} width='800' height='400'></canvas>
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
	topic: '',
};

Summary.propTypes = {
	topic: PropTypes.string,
};

export default Summary;
