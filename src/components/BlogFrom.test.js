import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const url = screen.getByPlaceholderText('write blog url adresse here')
  await user.type(url, 'www.abcd.com')

  const author = screen.getByPlaceholderText('write blog auther name here')
  await user.type(author, 'Misha')

  const title = screen.getByPlaceholderText('write blog title here')
  await user.type(title, 'React it is a library')

  const sendButton = screen.getByText('send')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].url).toBe('www.abcd.com')
  expect(createBlog.mock.calls[0][0].author).toBe('Misha')
  expect(createBlog.mock.calls[0][0].title).toBe('React it is a library')
})

