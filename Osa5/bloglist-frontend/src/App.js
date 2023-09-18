import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './notifications.css'
import axios from 'axios'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const sortedBlogs = [...blogs]
  sortedBlogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
  
      blogService.getAll().then(blogs => {
        const filteredBlogs = blogs.filter(blog => {
          if (blog.user && user && blog.user.username === user.username) {
            return true
          }
          return false
        })
        setBlogs(filteredBlogs)
      })
    }  
  }, [])

  const handleLikeBtn = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
  
    try {
      const response = await axios.put(`/api/blogs/${blog.id}`, updatedBlog)
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) => (b.id === blog.id ? response.data : b))
      )
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const handleDeleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      }

      try {
        await axios.delete(`/api/blogs/${blog.id}`, config);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
        setNotificationMessage(`Blog ${blog.title} removed`);
        setNotificationType('success');
        setTimeout(() => {
          setNotificationMessage(null);
          setNotificationType(null);
        }, 5000)
      } catch (error) {
        setNotificationMessage('Error deleting blog');
        setNotificationType('error');
        setTimeout(() => {
          setNotificationMessage(null);
          setNotificationType(null);
        }, 5000)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`Logged in as ${user.name}`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage('Wrong username/password')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog, user.token)
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    } catch (exception) {
      setNotificationMessage(exception.response.data.error)
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
          <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">login</button>
    </form>      
  )

  return (
    <div>
    {notificationMessage && (
      <Notification message={notificationMessage} type={notificationType} />
    )}
    {user === null && loginForm()}
    {user !== null && (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="new blog">
          <BlogForm createBlog={handleCreateBlog}/>
        </Togglable>

        {sortedBlogs.map((blog) => (
          <Blog
          key={blog.id}
          blog={blog}
          addLike={() => handleLikeBtn(blog)}
          deleteBlog={() => handleDeleteBlog(blog)}
          addedBy={user.name}
        />
        ))}
      </div>
    )}
  </div>
  )
}

export default App