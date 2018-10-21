import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CallbackTimer from './CallbackTimer';

import './Form.css';

class Form extends Component {
	constructor(props) {
		super(props);

		const query = document.location.href.match(/\?.*/);
		var token;
		if (query) {
			const params = new URLSearchParams(query[0]);
			token = params.get("token");
		} else {
			token = "";
		}

		this.state = {
			"stars": null,
			"text": "",
			"token": token,
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
		if (!this.props.topic) {
			this.setState({view: {error: "Form created without topic"}})
			return;
		}
		fetch('/get/topic/' + this.props.topic)
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
		.then((response) => response.json())
		.then((response_json) => {
			if (response_json.hasOwnProperty('error') && response_json.error) {
				throw new Error(response_json.error);
			}
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
					<CallbackTimer
						callback={()=>{this.props.navigate('/#/summary/' + this.props.topic)}}
						time={5000}
						time_className='FdbkContainerHighlightKeyNumeric'
						text='Redirecting to results summary in '
						text_className='FdbkContainerHighlight'/>
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
					<textarea name="text" onChange={this.textOnChange}></textarea>
				</div>
				{this.props.requires_token ?
					<div className="Token">
						<h2>Pre-shared token</h2>
						<input
							type="text"
							name="token"
							onChange={this.tokenOnChange}
							value={this.state.token}
						/>
					</div> : null}
				<div className="Submit">
					<button onClick={this.submitOnClick}>Submit</button>
				</div>
				{/* Output current state for debugging: <p>{JSON.stringify(this.state, null, 2)}</p> */}
			</div>
		);
	}
}

// TODO: This is for initial demo, please remove later
Form.defaultProps = {
	navigate: ()=>undefined,
	topic: '',
	requires_token: false
};

Form.propTypes = {
	navigate: PropTypes.func,
	topic: PropTypes.string,
	requires_token: PropTypes.bool
};

export default Form;
