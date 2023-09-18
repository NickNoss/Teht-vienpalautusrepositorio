import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogAuthor, setNewBlogAuthor] = useState('')
    const [newBlogUrl, setNewBlogUrl] = useState('')
  
    const handleCreateBlog = (event) => {
      event.preventDefault()
      createBlog({
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl
      })
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
    }
  
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            title:
            <input
              id="titleinput"
              type="text"
              value={newBlogTitle}
              onChange={({ target }) => setNewBlogTitle(target.value)}
              placeholder={"Enter title"}
            />
          </div>
          <div>
            author:
            <input
              id="authorinput"
              type="text"
              value={newBlogAuthor}
              onChange={({ target }) => setNewBlogAuthor(target.value)}
              placeholder={"Enter author"}
            />
          </div>
          <div>
            url:
            <input
              id="urlinput"
              type="text"
              value={newBlogUrl}
              onChange={({ target }) => setNewBlogUrl(target.value)}
              placeholder={"Enter URL"}
            />
          </div>
          <button id="submitbutton" type="submit">create</button>
        </form>
      </div>
    )
  }
  
  export default BlogForm