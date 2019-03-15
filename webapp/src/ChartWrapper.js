import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';

import { anyToString, capitalize } from './Utils';

import './style/ChartWrapper.css';

class ChartWrapper extends Component {
	horseshoe_options = {
		circumference: 3 / 2 * Math.PI,
		rotation: -5 / 4 * Math.PI,
		elements: {
			arc: {
				borderWidth: 0
			}
		}
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

	line_colors = [
		'#800080',
		'#300080',
		'#800030',
		'#580080',
		'#800058',
	]

	constructor(props) {
		super(props);

		this.chart = undefined;

		this.renderChart = this.renderChart.bind(this);
	}

	componentDidUpdate() {
		if (!this.chart) return;
		this.getDatasets().forEach((dataset, i) => {
			this.chart.data.datasets[i].data = dataset.data;
		})
		if (this.props.labels) {
			this.chart.data.labels = this.props.labels;
		}
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

	getDatasets() {
		var datas, fields;

		if (!Array.isArray(this.props.field)) {
			datas = [this.props.data];
			fields = [this.props.field];
		} else {
			datas = this.props.data;
			fields = this.props.field;
		}

		return fields.map((field, i) => {
			if (this.props.type === 'horseshoe') return {
				data: datas[i],
				backgroundColor: ['#300080', '#580080', '#800080', '#800058', '#800030'],
			}
			if (this.props.type === 'line') return {
				data: datas[i],
				label: [capitalize(field)],
				borderColor: this.line_colors[i % 5],
				fill: false
			}
			return null;
		});
	}

	renderChart() {
		const id = 'VisualizationChart' + capitalize(this.props.title) + capitalize(this.props.type);

		if (this.chart !== undefined) return;

		if (this.props.type === 'horseshoe') {
			this.chart = new Chart(id, {
				type: 'doughnut',
				data: {
					datasets: this.getDatasets(),
					labels: this.props.labels
				},
				options: this.horseshoe_options
			});
		} else if(this.props.type === 'line') {
			this.chart = new Chart(id, {
				type: 'line',
				data: {
					datasets: this.getDatasets(),
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
				<canvas className='VisualizationChart' id={'VisualizationChart' + capitalize(this.props.title) + capitalize(this.props.type)} width='800' height='400'></canvas>
			</div>
		);
	}
}

ChartWrapper.defaultProps = {
};

ChartWrapper.propTypes = {
	data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.array), PropTypes.array]),
	labels: PropTypes.array,
	field: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
	type: PropTypes.string,
	title: PropTypes.string,
};

export default ChartWrapper;
