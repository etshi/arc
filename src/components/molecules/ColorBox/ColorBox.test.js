import React from 'react'
import { shallow } from 'enzyme'

const copy = jest.fn()
jest.setMock('copy-to-clipboard', copy)

const ColorBox = require('./ColorBox').default
const wrap = (props = {}) => shallow(<ColorBox hex="#000" {...props} />).dive()

it('renders hex', () => {
  const wrapper = wrap()
  expect(wrapper.contains('#000')).toBe(true)
})

it('renders props when passed in', () => {
  const wrapper = wrap({ id: 'foo' })
  expect(wrapper.find({ id: 'foo' }).length).toBeGreaterThan(0)
})

it('copies hex to clipboard', () => {
  const wrapper = wrap()
  wrapper.simulate('click')
  expect(copy).toBeCalledWith('#000')
})

it('sets state when hex has been succesfully copied', () => {
  const wrapper = shallow(<ColorBox hex="#fff" />)
  jest.useFakeTimers()
  copy.mockReturnValue(true)

  expect(wrapper.state('copied')).toBeFalsy()
  expect(wrapper.contains('Copied')).toBe(false)

  wrapper.simulate('click')

  expect(wrapper.state('copied')).toBe(true)
  expect(wrapper.contains('Copied')).toBe(true)

  jest.runAllTimers()
  wrapper.update()
  expect(wrapper.state('copied')).toBe(false)
  expect(wrapper.contains('Copied')).toBe(false)
})