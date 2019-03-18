import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { _sToSpaces, capitalize } from '../Utils';

class Summaries extends Component {
	getSummaryComponent(summary_item) {
		var intro=null, hilight=null, detail=null;

		switch(summary_item.type) {
		case 'last_truthy':
		case 'last_falsy':
			if (summary_item.value === null) return null;
			intro = 'Last ' + _sToSpaces(summary_item.field) + ' ';
			detail = moment(summary_item.value).fromNow();
			break;
		default:
			intro = capitalize(summary_item.type).replace('_', ' ') + ' ' + _sToSpaces(summary_item.field);
			hilight = (
				<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{Math.round(summary_item.value * 10) / 10}</span>
			);
			detail = summary_item.unit;
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
		return (
			<div className='Summaries'>
				{this.props.numEntries ? <p className='SummaryItem FdbkContainerHighlight'>
					<span className="SummaryItemKeyNumeric FdbkContainerHighlightKeyNumeric">{this.props.numEntries}</span>entries
				</p> : null}
				{this.props.data.map(i => {
					if (i === null) return null;
					// TODO: Nan warning
					return this.getSummaryComponent(i);
				})}
			</div>
		);
	}
}

Summaries.defaultProps = {
	data: [],
};

Summaries.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	numEntries: PropTypes.number,
};

export default Summaries;
