import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Summary.css';

class Summary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"view": {
				"loading": "Waiting for feedback topic data from server"
			}
		};
	}

	componentDidMount() {
		if (!this.props.topic) {
			this.setState({view: {error: "Summary created without topic"}})
			return;
		}
		fetch('/get/summary/' + this.props.topic)
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

	render() {
		if (this.state.view.hasOwnProperty("loading")) {
			return (
				<div className="Summary">
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty("error")) {
			return (
				<div className="Summary">
					<h1>Error</h1>
					<p>{this.state.view.error.toString()}</p>
				</div>
			);
		}

		// TODO, This is for initial demo, please parametrize later
		return (
			<div className="Summary">
				<h1>{this.state.view.topic}</h1>
				<p>{this.state.view.description}</p>
				<p className="Code">{JSON.stringify(this.state, null, 2)}</p>
				{/* Output current state for debugging: <p>{JSON.stringify(this.state, null, 2)}</p> */}
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
