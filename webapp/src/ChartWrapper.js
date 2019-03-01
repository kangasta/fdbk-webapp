import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

import { anyToString, capitalize } from './Utils';

//import './style/Chart.css';

class ChartWrapper extends Component {
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

	constructor(props) {
		super(props);

		this.chart = undefined;

		this.renderChart = this.renderChart.bind(this);
	}

	componentDidUpdate() {
		if (!this.chart) return;
		this.chart.data.datasets[0].data = this.props.data;
		this.chart.data.labels = this.props.labels;
		this.chart.update();
	}

	isTypeSupported() {
		switch(this.props.type) {
		case 'horseshoe':
		case 'line':
			return true;
		default:
			return false;
		}
	}

	renderChart() {
		const id = 'VisualizationChart' + capitalize(this.props.field) + capitalize(this.props.type);

		if (this.chart !== undefined) return;

		if (this.props.type === 'horseshoe') {
			this.chart = new Chart(id, {
				type: 'doughnut',
				data: {
					datasets: [{
						data: this.props.data,
						backgroundColor: ['#300080', '#580080', '#800080', '#800058', '#800030'],
						borderColor: ['#CCC', '#CCC', '#CCC', '#CCC', '#CCC']
					}],
					labels: this.props.labels
				},
				options: this.horseshoe_options
			});
		} else if(this.props.type === 'line') {
			this.chart = new Chart(id, {
				type: 'line',
				data: {
					datasets: [{
						data: this.props.data,
						label: [capitalize(this.props.field)],
						borderColor: ['#800080'],
						fill: false
					}],
					labels: this.props.labels.map(a => new Date(a))
				},
				options: this.line_options
			});
		}
	}

	render() {
		if (!this.isTypeSupported()) {
			return (
				<p className='FdbkContainerHighlight DarkHighlight Error'>
					Chart type {'\'' + anyToString(this.props.type) + '\''} not supported by this version of webapp.
				</p>
			);
		}
		if (this.props.data.length === 0) {
			return (
				<p className='FdbkContainerHighlight DarkHighlight Error'>
					No valid data provided for the chart.
				</p>
			);
		}

		setTimeout(this.renderChart, 0);

		return (
			<div className="Chart">
				<canvas className='VisualizationChart' id={'VisualizationChart' + capitalize(this.props.field) + capitalize(this.props.type)} width='800' height='400'></canvas>
			</div>
		);
	}
}

ChartWrapper.defaultProps = {
};

ChartWrapper.propTypes = {
	data: PropTypes.array,
	labels: PropTypes.array,
	field: PropTypes.string,
	type: PropTypes.string,
};

export default ChartWrapper;
