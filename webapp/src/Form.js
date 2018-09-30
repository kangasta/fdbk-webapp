import React, { Component } from 'react';
import './Form.css';

class Form extends Component {
	constructor(props) {
		super(props);

		this.state = {
			"stars": null,
			"text": ""
		};

		this.starsOnClick = this.starsOnClick.bind(this);
		this.textOnChange = this.textOnChange.bind(this);
	}

	starsOnClick(event) {
		this.setState({
			"stars": event.target.value
		});
	}

	textOnChange(event) {
		this.setState({
			"text": event.target.value,
		});
	}

	render() {
		return (
			<div className="Form">
				<h1>Title</h1>
				<p>Description</p>
				<h2>Stars</h2>
				<div className="Stars">
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
				<h2>Text</h2>
				<textarea name="text" cols="50" onChange={this.textOnChange}></textarea>
				</div>
				<button>Submit</button>
				<p>{JSON.stringify(this.state, null, 2)}</p>
			</div>
		);
	}
}

export default Form;
