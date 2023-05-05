import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import storageService from './services/storage'

import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import LoginForm from './components/LoginFrom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compareLikes))
    )
  }, [])

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  useEffect(() => {
    const user = storageService.loadUser()
    setUser(user)
  }, [])

  const logout = async (event) => {
    event.preventDefault()

    storageService.removeUser()
    setUser(null)
  }

  const remove = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(a => a.id !== id))
      setNotification('delete blog', 'message')
    } catch (error) {
      setNotification(error)
    }
  }

  const login = async ({ username, password }) => {

    try {
      const user = await loginService.login({
        username, password,
      })
      storageService.saveUser(user)
      setUser(user)
      setNotification(`login ${username}`, 'message')
    } catch (error) {
      setNotification('wrong username or password')
    }
  }

  const setNotification = (message, type='error') => {
    setInfo({
      message: message,
      type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 5000)
  }

  const create = async (blog) => {
    try {
      const newBlog = await blogService.create(blog)

      setNotification(`a new blog ${blog.title} ${blog.author} added`, 'message')

      setBlogs(blogs.concat(newBlog))
    } catch (error) {
      setNotification(error)
    }
  }

  const like = async (newBlog) => {
    try {
      const returnedBlog = await blogService
        .update(
          {
            ...newBlog,
            user: newBlog.user.id,
            likes: newBlog.likes + 1,
          }
        )
      setBlogs(blogs.map(blog => blog.id !== newBlog.id ? blog : returnedBlog))
    } catch (error) {
      setNotification(error)
    }
  }


  if (!user) {
    return (
      <>
        <h2>Log in to application</h2>
        <Notification info={info}/>
        <LoginForm login={login}/>
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={info} />
      <div>
        {user.name} logged in
        <button onClick={logout}>logout</button>
      </div>
      <Togglable buttonLabel='create a new Blog'>
        <BlogForm
          createBlog={create}
        />
      </Togglable>
      {blogs.map(blog =>
        <Blog
          own={user.username === blog.user.username}
          key={blog.id}
          handleDeleteBlog={() => remove(blog.id)}
          blog={blog}
          like={(newBlog) => { like(newBlog) }}
        />
      )}
    </div>
  )
}

export default App