import React, { Component } from 'react';

import Form from './Form';
import TopicList from './TopicList';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = this.parseURL();

		this.navigate = this.navigate.bind(this);
	}

	getActiveView() {
		if (this.state.view.hasOwnProperty("topic")) {
			return (
				<Form topic={this.state.view.topic}/>
			);
		} else {
			return (
				<TopicList navigate={this.navigate}/>
			)
		}
	}

	parseURL(url=document.location.href) {
		var match;
		if (match = url.match(/#\/topic\/([^/]*)/)) {
			return {
				"view": {
					"topic": match[1]
				}
			};
		} else {
			return {
				"view": {
					"topics": null
				}
			};
		}
	}

	navigate(url) {
		this.setState(this.parseURL(url));
	}

	render() {
		return (
			<div className="App">
				{this.getActiveView()}
			</div>
		);
	}
}

export default App;
