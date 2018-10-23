import React from 'react';
import { mount } from 'enzyme';

import CallbackTimer from '../CallbackTimer';

jest.useFakeTimers();

describe('CallbackTimer', () => {
	it('renders without crashing', () => {
		mount(<CallbackTimer/>);
	});
	it('calls callback after time has passed', () => {
		const mock_callback = jest.fn();
		const wrapper = mount(
			<CallbackTimer callback={mock_callback} time={1000}/>
		);
		jest.runTimersToTime(1000);
		expect(mock_callback).toHaveBeenCalled();
		wrapper.unmount();
		expect(clearTimeout).not.toHaveBeenCalled();
	});
	it('goes forward while time passes', () => {
		const wrapper = mount(
			<CallbackTimer time={5000} time_display_divider={1000} update_interval={1000}/>
		);
		for (var i = 4; i >= 0; i--) {
			expect(wrapper.find('.CallbackTimerTimeLeft').text()).toEqual(i.toString());
			jest.runTimersToTime(1000);
		}
	});
	it('allows customized time, display, and updating', () => {
		const wrapper = mount(
			<CallbackTimer time={6000} time_display_divider={2000} update_interval={2000}/>
		);
		for (var i = 5; i >= 0; i--) {
			expect(wrapper.find('.CallbackTimerTimeLeft').text()).toEqual(((i % 2 ? i - 1 : i) / 2).toString());
			jest.runTimersToTime(1000);
		}
	});
	it('clears timers at unmount', () => {
		const wrapper = mount(
			<CallbackTimer/>
		);
		wrapper.unmount();
		expect(clearTimeout).toHaveBeenCalled();
	});
});
