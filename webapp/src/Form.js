import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Form.css';

class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"stars": null,
			"text": "",
			"token": "",
			"view": {
				"loading": "Waiting for feedback topic data from server"
			}
		};

		this.starsOnClick = this.starsOnClick.bind(this);
		this.submitOnClick = this.submitOnClick.bind(this);
		this.textOnChange = this.textOnChange.bind(this);
		this.tokenOnChange = this.tokenOnChange.bind(this);
	}

	componentDidMount() {
		fetch('/get/topic/' + this.props.topic)
			.then((response) => response.json())
			.then((response_json) => {
				this.setState({view: response_json});
			})
			.catch((error_msg) => {
				this.setState({view: {error: error_msg.toString()}});
			});
	}

	starsOnClick(event) {
		this.setState({
			"stars": Number(event.target.value)
		});
	}

	textOnChange(event) {
		this.setState({
			"text": event.target.value,
		});
	}

	tokenOnChange(event) {
		this.setState({
			"token": event.target.value,
		});
	}

	submitOnClick(event) {
		this.setState({
			"view": {
				"loading": "Submitting feedback to server"
			}
		})

		fetch("/add/data/" + this.state.view.topic + "?token=" + this.state.token, {
			method: 'POST',
			// TODO, This is for initial demo, please parametrize later
			body: JSON.stringify({
				stars: this.state.stars,
				text: this.state.text
			}),
			headers:{
				'Content-Type': 'application/json'
			}
		})
		// TODO: should chacnge api to return JSON later
		//.then(() => res.json())
		.then(() => {
			this.setState({
				"view": {
					"success": "Data submitted successfully"
				}
			});
		})
		.catch((error_msg) => {
			this.setState({view: {error: error_msg.toString()}});
		});
	}

	render() {
		if (this.state.view.hasOwnProperty("loading")) {
			return (
				<div className="Form">
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty("error")) {
			return (
				<div className="Form">
					<h1>Error</h1>
					<p>{this.state.view.error.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty("success")) {
			return (
				<div className="Form">
					<h1>Success</h1>
					<p>{this.state.view.success.toString()}</p>
				</div>
			);
		}

		// TODO, This is for initial demo, please parametrize later
		return (
			<div className="Form">
				<h1>{this.state.view.topic}</h1>
				<p>{this.state.view.description}</p>
				<div className="Stars">
					<h2>Stars</h2>
						{/* TODO: https://codepen.io/jamesbarnett/pen/vlpkh */}
						{[...Array(5).keys()].map(i => (
							<span className="Star">
								<input
									key={i+1}
									type="radio"
									name="stars"
									onClick={this.starsOnClick}
									value={i+1}
								/>
								<label for={i+1}>{i+1}</label>
							</span>
						))}
				</div>
				<div className="Stars">
				<h2>Text</h2>
				<textarea name="text" cols="50" onChange={this.textOnChange}></textarea>
				</div>
				<div className="Stars">
				<h2>Pre-shared token</h2>
				<input type="text" name="token" cols="50" onChange={this.tokenOnChange}></input>
				</div>
				<button onClick={this.submitOnClick}>Submit</button>
				<p>{JSON.stringify(this.state, null, 2)}</p>
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
Form.defaultProps = {
	topic: 'IPA'
};

Form.propTypes = {
	topic: PropTypes.string
};

export default Form;
