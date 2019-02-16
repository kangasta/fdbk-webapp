import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CSValidatorChanger } from 'chillisalmon';

import './style/TopicList.css';

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
		const topics = this.state.view.topics || [];

		return (
			<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
				<div className="TopicList">
					<h1>Topics</h1>
					<ul className='TopicList'>
						{topics.map(topic => (
							<li key={topic} className="Topic FdbkContainerHighlight">
								<span className="Right Link" onClick={()=>{this.props.navigate('/#/summary/' + topic.id);}}>summary</span>
								{topic.form_submissions ? <span className="Right Link" onClick={()=>{this.props.navigate('/#/form/' + topic.id);}}>form</span> : null}
								<div className='Topic'>{topic.name}</div>
								<div className='Description'>{topic.description ? topic.description : 'No description available'}</div>
							</li>
						))}
					</ul>
				</div>
			</CSValidatorChanger>
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
