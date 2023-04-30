import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let updateBlog

  beforeEach(() => {
    updateBlog = jest.fn()
    const blog = {
      author: 'Tester',
      title: 'React its a library',
      url: 'www.somwherereelse',
      likes: 0
    }
    container = render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
      />
    ).container
  })

  test('at start the title and auther displayed without url and likes', () => {
    const div = container.querySelector('.previewBlog')

    expect(div).not.toHaveStyle('display: none')

    const content = container.querySelector('.blogContent')
    expect(content).toHaveStyle('display: none')
  })

  test('after clicking the button, url and likes are dsiplayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const content = container.querySelector('.blogContent')
    expect(content).not.toHaveStyle('display: none')
  })

  test('after double clicking like the event handler is called twice', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.buttonLike')
    await user.dblClick(button)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
