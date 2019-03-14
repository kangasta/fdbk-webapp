import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { checkJsonForErrors } from './Utils';
import { CSValidatorChanger, CSStatus } from 'chillisalmon';

import './style/TopicList.css';

class TopicList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'view': {
				'loading': 'Waiting for feedback topic data'
			}
		};

		this.getTopicItem = this.getTopicItem.bind(this);
	}

	componentDidMount() {
		return fetch('/get/topics')
			.then((response) => response.json())
			.then(checkJsonForErrors)
			.then((response_json) => {
				this.setState({
					'view': {
						'topics': response_json
					}
				});
			})
			.catch(() => {
				this.setState({'view': {'error': 'Unable to fetch data'}});
			});
	}

	getTopics() {
		const topics = this.state.view.topics || [];
		switch (this.props.listType) {
		case 'form':
			return topics.filter(topic => topic.form_submissions);
		case 'summary':
		default:
			return topics;
		}
	}

	getTopicItem(topic) {
		const getOnClick = item => {
			if (this.props.listType === undefined && item !== 'topic') {
				return () => {
					this.props.navigate('/#/' + item + '/' + topic.id);
				};
			}
			if (this.props.listType !== undefined && item === 'topic') {
				return () => {
					this.props.navigate('/#/' + this.props.listType + '/' + topic.id);
				};
			}
			return undefined;
		};

		return (
			<li key={topic.id} className={'Topic FdbkContainerHighlight ' + (this.props.listType !== undefined ? 'Link' : '')} onClick={getOnClick('topic')}>
				<span className='Right Link' onClick={getOnClick('summary')}>summary</span>
				{topic.form_submissions ? <span className='Right Link' onClick={getOnClick('form')}>form</span> : null}
				<div className='Topic'>{topic.name}</div>
				<div className='Description'>{topic.description ? topic.description : 'No description available'}</div>
			</li>
		);
	}

	getTitleText() {
		switch(this.props.listType) {
		case 'summary':
			return 'Summaries';
		case 'form':
			return 'Forms';
		default:
			return 'All topics';
		}
	}

	getTopicList() {
		const topics = this.getTopics();
		if (topics.length === 0) {
			return (
				<CSStatus status={CSStatus.status.MESSAGE} message='No matching topics available.'/>
			);
		}

		return (
			<ul className='TopicList'>
				{topics.map(this.getTopicItem)}
			</ul>
		);
	}

	render() {
		return (
			<div className='TopicList'>
				<h1>{this.getTitleText()}</h1>
				<CSValidatorChanger error={this.state.view.error} loading={this.state.view.loading}>
					{this.getTopicList()}
				</CSValidatorChanger>
			</div>
		);
	}
}

TopicList.defaultProps = {
	navigate: ()=>undefined
};

TopicList.propTypes = {
	navigate: PropTypes.func,
	listType: PropTypes.oneOf([undefined, 'summary', 'form'])
};

export default TopicList;
