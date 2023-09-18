import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({blog, addLike, deleteBlog, addedBy}) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
      setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog' style={blogStyle}>
    <div className='blog-title-author'>
      <h4>{blog.title}</h4>
      <p>author: {blog.author}</p>
      <button onClick={toggleShowDetails}>{showDetails ? 'Hide' : 'View'}</button>
    </div>
    {showDetails && (
      <div className='blog-details'>
        <p>{blog.url}</p>
        <p>
          {blog.likes} likes <button onClick={(e) => {
            e.preventDefault()
            addLike(blog)
          }}>Like</button>
        </p>
        <p>Added by {addedBy}</p>
        <button onClick={(e) => {
          e.preventDefault()
          deleteBlog(blog)
        }}>remove</button>
      </div>
    )}
  </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired
  }).isRequired
}

export default Blog