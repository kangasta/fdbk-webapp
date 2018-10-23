import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TopicList.css';

class TopicList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for feedback topic data from server'
			}
		};
	}

	componentDidMount() {
		return fetch('/get/topics')
			//.then((response) => {console.log(response);return response.json()})
			.then((response) => response.json())
			.then((response_json) => {
				if (response_json.hasOwnProperty('error') && response_json.error) {
					throw new Error(response_json.error);
				}
				this.setState({
					'view': {
						'topics': response_json
					}
				});
			})
			.catch((error_msg) => {
				this.setState({'view': {'error': error_msg.toString()}});
			});
	}

	render() {
		if (this.state.view.hasOwnProperty('loading')) {
			return (
				<div className="TopicList">
					<h1>Loading</h1>
					<p>{this.state.view.loading.toString()}</p>
				</div>
			);
		}

		if (this.state.view.hasOwnProperty('error')) {
			return (
				<div className="TopicList">
					<h1>Error</h1>
					<p>{this.state.view.error.toString()}</p>
				</div>
			);
		}

		return (
			<div className="TopicList">
				<h1>Topics</h1>
				<ul>
					{this.state.view.topics.map(topic => (
						<li key={topic} className="Topic">
							{topic.topic} | <span className="Link" onClick={()=>{this.props.navigate('/#/form/' + topic.topic);}}>Form</span> | <span className="Link" onClick={()=>{this.props.navigate('/#/summary/' + topic.topic);}}>Summary</span>
						</li>
					))}
				</ul>
			</div>
		);
	}
}

TopicList.defaultProps = {
	navigate: ()=>undefined
};

TopicList.propTypes = {
	navigate: PropTypes.func
};

export default TopicList;
