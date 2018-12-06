import React from 'react';
import { mount, shallow } from 'enzyme';

import Form from '../Form';

describe('Form',() => {
	it('shows error when created without topic', async () => {
		const wrapper = mount(<Form/>);
		expect(wrapper.find('.Form').hasClass('Error')).toBe(true);
		await wrapper.instance().componentDidMount();
	});
	it('shows loading message while waiting fetch result and error when fetch fails', () => {
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({error: 'Failing fetch() mock'})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Form topic='topic'/>);
		expect(wrapper.find('.Form').hasClass('Loading')).toBe(true);

		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			expect(wrapper.find('.Form').hasClass('Error')).toBe(true);
		});
	});
	it('generates inputs for all fields in topic', () => {
		const fields = ['Number', 'Letter'];
		const fetch_promise = new Promise((resolve) => setTimeout(() => { resolve({json: () => ({topic: 'topic', fields: fields})}); }), 1000);
		global.fetch = jest.fn(() => fetch_promise);

		const wrapper = shallow(<Form topic='topic'/>);
		jest.runAllTimers();
		return fetch_promise.then(async () => {
			await wrapper.instance().componentDidMount();
			fields.forEach(field => {
				expect(wrapper.exists('.InputRow.' + field)).toBe(true);
				expect(wrapper.find('.InputRow.' + field + ' h2').text()).toEqual(field);
			});
		});
	});
});
