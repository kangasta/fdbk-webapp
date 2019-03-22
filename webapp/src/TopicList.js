import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { checkJsonForErrors } from './Utils';
import { CSValidatorChanger, CSStatus } from 'chillisalmon';

import './style/TopicList.css';

class TopicList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			view: {
				'loading': 'Waiting for feedback topic data'
			},
			selected: [],
		};

		this.getTopicItem = this.getTopicItem.bind(this);
		this.toggleSelected = this.toggleSelected.bind(this);
	}

	componentDidMount() {
		return fetch('/topics')
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

	toggleSelected(topic_id) {
		if (this.state.selected.includes(topic_id)) {
			this.setState(prev => ({
				selected: prev.selected.filter(id => (id !== topic_id))
			}));
		} else {
			this.setState(prev => ({
				selected: prev.selected.concat(topic_id)
			}));
		}
	}

	getTopics() {
		const topics = this.state.view.topics || [];
		switch (this.props.listType) {
		case 'form':
			return topics.filter(topic => topic.form_submissions);
		case 'summary':
		case 'select':
		default:
			return topics;
		}
	}

	getIncludedFloat(topic_id) {
		const text = this.state.selected.includes(topic_id) ? 'in' : 'out';
		return (
			<span className='Right Link'>{text}</span>
		);
	}

	getTopicItem(topic) {
		const listType = this.props.listType;
		const getOnClick = item => {
			if (listType === undefined && item !== 'topic') {
				return () => {
					this.props.navigate('/#/' + item + '/' + topic.id);
				};
			}
			if (![undefined, 'select'].includes(listType) && item === 'topic') {
				return () => {
					this.props.navigate('/#/' + listType + '/' + topic.id);
				};
			}
			if (listType === 'select' && item === 'topic') {
				return () => { this.toggleSelected(topic.id); };
			}
			return undefined;
		};
		const isVisible = item => (listType === undefined || listType === item);
		const includedClass = (this.state.selected.includes(topic.id) || listType !== 'select') ? '' : 'DarkHighlight ';

		return (
			<li key={topic.id} className={'Topic FdbkContainerHighlight ' + includedClass + (listType !== undefined ? 'Link' : '')} onClick={getOnClick('topic')}>
				{isVisible('summary') ? <span className='Right Link' onClick={getOnClick('summary')}>summary</span> : null}
				{topic.form_submissions && isVisible('form') ? <span className='Right Link' onClick={getOnClick('form')}>form</span> : null}
				{listType === 'select' ? this.getIncludedFloat(topic.id) : null}
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
		case 'select':
			return 'Select topics';
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
				{this.props.listType === 'select' ? <div className='Submit'>
					<button className='Link' onClick={() => { this.props.select(this.state.selected); }}>Select</button>
				</div> : null}
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
	navigate: ()=>undefined,
	select: ()=>undefined,
};

TopicList.propTypes = {
	navigate: PropTypes.func,
	listType: PropTypes.oneOf([undefined, 'select', 'summary', 'form']),
	select: PropTypes.func,
};

export default TopicList;
