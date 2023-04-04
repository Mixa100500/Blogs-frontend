import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`login ${username}`)
    } catch (error) {
      setErrorMessage('wrond username or password')
    }
  }

  const setErrorMessage = (error) => {
    setInfo({ 
      message: error,
      type: 'error' 
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const setNotification = (message) => {
    setInfo({
      message: message,
      type: 'notificition'
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const addBlog = async ({
    title,
    author,
    url
  }) => {
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      })

      setNotification(`a new blog ${title} ${author} added`)

      setBlogs(blogs.concat(newBlog))
    } catch (error) {
      setErrorMessage(error)
    }
  }

  const LoginForm = () => {

    return (
      <form onSubmit={handleLogin}>
        <h2>Log in to application</h2>
        <Notification info={info}/>
        <div>
          username
          <input 
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input 
          type="text" 
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          />
          <button type='submit'>login</button>
        </div>
      </form>
    )
  }

  if (user === null) {
    return LoginForm()
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <p>{user.name} logged in 
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='new Blog'>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App