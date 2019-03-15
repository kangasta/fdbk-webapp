import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ChartWrapper from './ChartWrapper';
import { _sToSpaces, capitalize } from './Utils';

//import './style/Visualizations.css';

class Visualizations extends Component {
	render() {
		return (
			<div className='Visualizations'>
				{this.props.data.map(i => {
					if (i === null) return null;
					return (
						<div key={i.type.toString() + i.field.toString()} className='VisualizationItem'>
							<h2>{capitalize(_sToSpaces(i.field))}</h2>
							<ChartWrapper {...i}/>
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
