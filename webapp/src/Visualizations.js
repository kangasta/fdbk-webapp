import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChartWrapper from './ChartWrapper';
import { _sToSpaces, capitalize } from './Utils';

//import './style/Visualizations.css';

class Visualizations extends Component {
	getProcessedCharts() {
		var charts = {};
		const add_key = (key, type, title) => {
			charts[key] = {
				data: [],
				labels: undefined,
				field: [],
				type: type,
				title: title
			};
		};

		this.props.data.forEach(i => {
			const key = i.type.toString() + i.field.toString();
			if (!charts.hasOwnProperty(key)) add_key(key, i.type, i.field);

			charts[key].labels = i.labels;
			charts[key].data.push(i.data);
			charts[key].field.push(i.topic_name);
		});

		return charts;
	}

	render() {
		const charts = this.getProcessedCharts();
		return (
			<div className='Visualizations'>
				{Object.keys(charts).map(i => {
					if (i === null) return null;
					return (
						<div key={i} className='VisualizationItem'>
							<h2>{capitalize(_sToSpaces(charts[i].title))}</h2>
							<ChartWrapper {...charts[i]}/>
						</div>
					);
				})}
			</div>
		);
	}
}

Visualizations.defaultProps = {
	data: [],
};

Visualizations.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
};

export default Visualizations;
