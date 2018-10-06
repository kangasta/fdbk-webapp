import React, { Component } from 'react';

import FdbkContainer from './FdbkContainer';
import Form from './Form';
import TopicList from './TopicList';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = this.parseURL();
		window.history.replaceState(this.state, "fdbk", this.state.url);
		window.onpopstate = (event) => {
			this.setState(event.state);
		};

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
				},
				"url": match[0]
			};
		} else {
			return {
				"view": {
					"topics": null
				},
				"url": "/#/"
			};
		}
	}

	navigate(url) {
		this.setState(this.parseURL(url), ()=>{
			window.history.pushState(this.state, "fdbk", this.state.url);
		});
	}

	render() {
		return (
			<div className="App">
				<FdbkContainer>
					{this.getActiveView()}
				</FdbkContainer>
			</div>
		);
	}
}

export default App;
