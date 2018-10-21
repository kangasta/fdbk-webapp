import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CallbackTimer.css';

class CallbackTimer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			time_left: this.props.time,
			timer: undefined
		};
	}

	progressTimer() {
		this.setState(prev => {
			const time_left = prev.time_left - this.props.update_interval;
			if (prev.time_left <= 0) {
				this.props.callback();
				return {
					time_left: 0,
					timer: undefined
				};
			}

			return {
				time_left: time_left,
				timer: setTimeout(()=>{
					this.progressTimer();
				}, this.props.update_interval)}
			}
		);
	}

	componentDidMount() {
		this.progressTimer();
	}

	componentWillUnmount() {
		if (this.state.timer) clearTimeout(this.state.timer);
	}

	render() {
		return (
			<div className="CallbackTimer">
				<p>
					{this.props.text} <span className='CallbackTimerTimeLeft'>
						{Math.round(this.state.time_left / this.props.time_display_divider)}
					</span>
				</p>
			</div>
		);
	}
}

CallbackTimer.defaultProps = {
	callback: () => undefined,
	text: "fdbk",
	time: 5000,
	time_display_divider: 1000,
	update_interval: 1000
};

CallbackTimer.propTypes = {
	callback: PropTypes.func,
	text: PropTypes.node,
	time: PropTypes.number,
	time_display_divider: PropTypes.number,
	update_interval: PropTypes.number
};

export default CallbackTimer;