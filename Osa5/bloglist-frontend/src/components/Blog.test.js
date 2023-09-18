import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
        const blog = {
          title: 'Testiblogi',
          author: 'Testaaja',
          url: 'testi.fi',
          likes: 10
        }

    test('renders title and author but not url or likes by default', async () => {
  
      render(<Blog blog={blog} />)
  
      const title = screen.getByText('Testiblogi')
      const author = screen.getByText(/Testaaja/)
      const url = screen.queryByText('testi.fi')
      const likes = screen.queryByText('10')
  
      expect(title).toBeDefined()
      expect(author).toBeDefined()
      expect(url).toBeNull()
      expect(likes).toBeNull()
    })

    test('renders all information after clicking the view button', async () => {
        const component = render(<Blog blog={blog} />)
        const button = component.getByText('View')
        fireEvent.click(button)
    
        expect(component.container).toHaveTextContent('Testiblogi')
        expect(component.container).toHaveTextContent('Testaaja')
        expect(component.container).toHaveTextContent('testi.fi')
        expect(component.container).toHaveTextContent('10')
        expect(component.container).toHaveTextContent('Added by')
      })

      test('like button handler is called twice when button is clicked twice', async () => {
        const mockHandler = jest.fn()
        
        render(<Blog blog={blog} addLike={mockHandler}/>)

        const user = userEvent.setup()
        const viewButton = screen.getByText('View')
        await user.click(viewButton)
        const likeButton = screen.getByText('Like')
        console.log(likeButton)
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)

      })
  })