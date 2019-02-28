import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSValidatorChanger } from 'chillisalmon';

import { checkJsonForErrors } from './Utils';
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
				'loading': 'Waiting for feedback topic data'
			}
		};

		this.starsOnClick = this.starsOnClick.bind(this);
		this.submitOnClick = this.submitOnClick.bind(this);
		this.textOnChange = this.textOnChange.bind(this);
	}

	componentDidMount() {
		if (!this.props.topic_id) {
			this.setState({view: {error: 'Form created without topic'}});
			return;
		}
		return fetch('/get/topic/' + this.props.topic_id)
			.then((response) => response.json())
			.then(checkJsonForErrors)
			.then((response_json) => {
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
		const url = '/add/data/' + this.state.view.id + token_parameter;

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
			.then(checkJsonForErrors)
			.then(() => {
				this.setState({
					'view': {
						'success': 'Data submitted successfully'
					}
				});
			})
			.catch(() => {
				this.setState({view: {error: 'Unable to fetch data'}});
			});
	}

	getInputForField(field) {
		if (!this.state.view.hasOwnProperty('id')) return undefined;

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
						<div className='FdbkContainerHighlight'>
							{[...Array(5).keys()].map(i => (
								<span key={i} className='Star FdbkContainerHighlightKeyNumeric'>
									<input
										key={i+1}
										id={i+1}
										type='radio'
										name='stars'
										onClick={this.starsOnClick}
										value={i+1}
									/>
									<label
										htmlFor={i+1}>{i+1}</label>
								</span>
							))}
						</div>
					</div>
				);
			case 'text':
				return (
					<div key={field} className='InputRow Text'>
						<h2>Text</h2>
						<div className='FdbkContainerHighlight'>
							<textarea
								name='text'
								onChange={this.textOnChange}
								placeholder='Write your input here'
								rows='1'></textarea>
						</div>
					</div>
				);
			default:
			}
		}
		return (
			<div key={field} className={'InputRow ' + capitalize(field)}>
				<h2>{capitalize(field)}</h2>
				<div className='FdbkContainerHighlight'>
					<input
						type='text'
						name={field}
						onChange={this.textOnChange}
						placeholder='Write your input here'></input>
				</div>
			</div>
		);
	}

	getContent() {
		try {
			return (
				<div className='Content'>
					<p>{this.state.view.description}</p>
					{this.state.view.fields.map(field => this.getInputForField(field))}
					{this.props.requires_token ?
						<div className='Token'>
							<h2>Pre-shared token</h2>
							<div className='FdbkContainerHighlight'>
								<input
									type='text'
									name='token'
									onChange={this.textOnChange}
									value={this.state.token}
								/>
							</div>
						</div> : null}
					<div className='Submit'>
						<button className='Link' onClick={this.submitOnClick}>Submit</button>
					</div>
					{/* Output current state for debugging: <p>{JSON.stringify(this.state, null, 2)}</p> */}
				</div>
			);
		} catch(e) {
			return null;
		}
	}

	getTitle() {
		return this.state.view.name || this.props.topic_name;
	}

	render() {
		return (
			<div className='Form'>
				<h1>{this.getTitle()}</h1>
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading} success={this.state.view.success}>
					{this.getContent()}
				</CSValidatorChanger>
				{this.state.view.success === undefined ? null : <CallbackTimer
					callback={()=>{this.props.navigate('/#/summary/' + this.props.topic_id);}}
					time={5000}
					time_className='FdbkContainerHighlightKeyNumeric'
					text='Redirecting to results summary in '
					text_className='FdbkContainerHighlight'/>}
			</div>
		);
	}
}

Form.defaultProps = {
	navigate: ()=>undefined,
	topic_id: '',
	topic_name: 'Form',
	requires_token: false
};

Form.propTypes = {
	navigate: PropTypes.func,
	topic_id: PropTypes.string,
	topic_name: PropTypes.string,
	requires_token: PropTypes.bool
};

export default Form;
