import React from 'react';
import { mount, shallow } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Form/>);
		expect(wrapper.exists('.Form .Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('generates inputs for all fields in topic', () => {
		const fields = ['Number', 'Letter'];
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({topic: 'topic', id: '123', fields: fields})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Form topic_id='topic'/>);
		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			fields.forEach(field => {
				expect(wrapper.exists('.InputRow.' + field)).toBe(true);
				expect(wrapper.find('.InputRow.' + field + ' h2').text()).toEqual(field);
			});
		});
	});
	it('generates suitable POST request on submit', () => {
		const topic_id = '123';
		const fields = ['Number1', 'Number2'];
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({topic: 'topic', id: topic_id, fields: fields})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Form topic_id='topic'/>);
		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			fields.forEach(field => {
				wrapper.find('.InputRow.' + field + ' input').simulate('change', {
					target: {
						value: 3,
						type: 'text',
						name: field
					}
				});
			});
			wrapper.find('.Submit button').simulate('click');
			wrapper.update();
			expect(global.fetch).toBeCalledWith('/topics/' + topic_id + '/data', {
				'body': JSON.stringify({Number1: 3,Number2: 3}),
				'headers': {
					'Content-Type': 'application/json'
				},
				'method': 'POST'
			});
		});
	});
});
