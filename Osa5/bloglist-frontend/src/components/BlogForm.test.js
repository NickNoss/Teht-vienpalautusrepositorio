import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm', () => {
  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByPlaceholderText('Enter title')
    const authorInput = screen.getByPlaceholderText('Enter author')
    const urlInput = screen.getByPlaceholderText('Enter URL')
    const submitButton = screen.getByText('create')

    const newBlog = {
      title: 'FormTest',
      author: 'TestaajaNik',
      url: 'testausta.fi'
    }

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog).toHaveBeenCalledWith(newBlog)
  })
})
npå