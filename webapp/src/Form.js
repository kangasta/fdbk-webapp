import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CallbackTimer from './CallbackTimer';

import './style/Form.css';

class Form extends Component {
	constructor(props) {
		super(props);

		const query = document.location.href.match(/\?.*/);
		var token;
		if (query) {
			const params = new URLSearchParams(query[0]);
			token = params.get('token');
		} else {
			token = '';
		}

		this.state = {
			'fields': {},
			'token': token,
			'view': {
				'loading': 'Waiting for feedback topic data from server'
			}
		};

		this.starsOnClick = this.starsOnClick.bind(this);
		this.submitOnClick = this.submitOnClick.bind(this);
		this.textOnChange = this.textOnChange.bind(this);
	}

	componentDidMount() {
		if (!this.props.topic) {
			this.setState({view: {error: 'Form created without topic'}});
			return;
		}
		return fetch('/get/topic/' + this.props.topic)
			.then((response) => response.json())
			.then((response_json) => {
				if (response_json.hasOwnProperty('error') && response_json.error) {
					throw new Error(response_json.error);
				}
				const fields = response_json.fields.reduce((obj, field) => {
					obj[field] = null;
					return obj;
				},{});
				this.setState({
					fields: fields,
					view: response_json
				});
			})
			.catch((error_msg) => {
				this.setState({view: {error: error_msg.toString()}});
			});
	}

	starsOnClick(event) {
		const element = event.target;
		this.setState(old => ({
			fields: Object.assign(old.fields, {'stars': Number(element.value)})
		}));
	}

	textOnChange(event) {
		const element = event.target;
		if (element.type === 'textarea') {
			setTimeout(() => {
				element.style.cssText = 'height: ' + element.scrollHeight + 'px';
			}, 0);
		}
		if (element.name === 'token') {
			this.setState({token: element.value});
			return;
		}
		this.setState(old => ({
			fields: Object.assign(old.fields, {[element.name]: element.value})
		}));
	}

	submitOnClick(/*event*/) {
		const token_parameter = this.state.token ? '?token=' + this.state.token : '';
		const url = '/add/data/' + this.state.view.topic + token_parameter;

		this.setState({
			'view': {
				'loading': 'Submitting feedback to server'
			}
		});

		fetch(url, {
			method: 'POST',
			body: JSON.stringify(this.state.fields),
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((response_json) => {
				if (response_json.hasOwnProperty('error') && response_json.error) {
					throw new Error(response_json.error);
				}
				this.setState({
					'view': {
						'success': 'Data submitted successfully'
					}
				});
			})
			.catch((error_msg) => {
				this.setState({view: {error: error_msg.toString()}});
			});
	}

	getInputForField(field) {
		if (!this.state.view.hasOwnProperty('topic')) return undefined;

		const capitalize = (str) => {
			return (str.charAt(0).toUpperCase() + str.slice(1));
		};

		const unit_obj = this.state.view.hasOwnProperty('units') ? this.state.view.units.find(i => (i.field === field)) : undefined;
		if (unit_obj) {
			switch (unit_obj.unit) {
			case 'stars':
				return (
					<div key={field} className='InputRow Stars'>
						<h2>Stars</h2>
						{[...Array(5).keys()].map(i => (
							<span key={i} className='Star'>
								<input
									key={i+1}
									type='radio'
									name='stars'
									onClick={this.starsOnClick}
									value={i+1}
								/>
								<label htmlFor={i+1}>{i+1}</label>
							</span>
						))}
					</div>
				);
			case 'text':
				return (
					<div key={field} className='InputRow Text'>
						<h2>Text</h2>
						<textarea
							name='text'
							onChange={this.textOnChange}
							placeholder='Write your input here'
							rows='1'></textarea>
					</div>
				);
			}
		}
		return (
			<div key={field} className={'InputRow ' + capitalize(field)}>
				<h2>{capitalize(field)}</h2>
				<input
					type='text'
					name={field}
					onChange={this.textOnChange}
					placeholder='Write your input here'></input>
			</div>
		);
	}

	render() {
		if (this.state.view.hasOwnProperty('loading')) {
			return (
				<div className='Form Loading'>
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty('error')) {
			return (
				<div className='Form Error'>
					<h1>Error</h1>
					<p>{this.state.view.error.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty('success')) {
			return (
				<div className='Form Success'>
					<h1>Success</h1>
					<p>{this.state.view.success.toString()}</p>
					<CallbackTimer
						callback={()=>{this.props.navigate('/#/summary/' + this.props.topic);}}
						time={5000}
						time_className='FdbkContainerHighlightKeyNumeric'
						text='Redirecting to results summary in '
						text_className='FdbkContainerHighlight'/>
				</div>
			);
		}

		// TODO, This is for initial demo, please parametrize later
		return (
			<div className='Form'>
				<h1>{this.state.view.topic}</h1>
				<p>{this.state.view.description}</p>
				{this.state.view.fields.map(field => this.getInputForField(field))}
				{this.props.requires_token ?
					<div className='Token'>
						<h2>Pre-shared token</h2>
						<input
							type='text'
							name='token'
							onChange={this.textOnChange}
							value={this.state.token}
						/>
					</div> : null}
				<div className='Submit'>
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
