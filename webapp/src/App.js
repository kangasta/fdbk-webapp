import React, { Component } from 'react';

import FdbkContainer from './FdbkContainer';
import Form from './Form';
import Summary from './Summary';
import TopicList from './TopicList';

import './App.css';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = this.parseURL();
		window.history.replaceState(this.state, 'fdbk', this.state.url);
		window.onpopstate = (event) => {
			this.setState(event.state);
		};

		this.navigate = this.navigate.bind(this);
	}

	getActiveView() {
		if (this.state.view.hasOwnProperty('form')) {
			return (
				<Form navigate={this.navigate} topic={this.state.view.form}/>
			);
		} else if (this.state.view.hasOwnProperty('summary')) {
			return (
				<Summary topic={this.state.view.summary}/>
			);
		} else {
			return (
				<TopicList navigate={this.navigate}/>
			);
		}
	}

	parseURL(url=document.location.href) {
		var match;
		/* eslint-disable no-cond-assign */
		if (match = url.match(/#\/form\/([^/]*)/)) {
			return {
				'view': {
					'form': match[1]
				},
				'url': match[0]
			};
		} else if (match = url.match(/#\/summary\/([^/]*)/)) {
			return {
				'view': {
					'summary': match[1]
				},
				'url': match[0]
			};
		} else {
			return {
				'view': {
					'topics': null
				},
				'url': '/#/'
			};
		}
		/* eslint-enable no-cond-assign */
	}

	navigate(url) {
		this.setState(this.parseURL(url), ()=>{
			window.history.pushState(this.state, 'fdbk', this.state.url);
		});
	}

	render() {
		return (
			<div className='App'>
				<div className='Center'>
					<FdbkContainer navigate={this.navigate}>
						{this.getActiveView()}
					</FdbkContainer>
				</div>
				<div className='Background'/>
			</div>
		);
	}
}

export default App;
