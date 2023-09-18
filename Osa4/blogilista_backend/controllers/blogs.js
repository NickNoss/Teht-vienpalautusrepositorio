const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name id')
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  console.log(request.user)
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'User not found' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  
  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    if (savedBlog) response.status(201).json(savedBlog)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  }
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', 'username name id')
  if (blog) {
      response.json(blog)
  } else {
      response.status(404).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (!user) return response.sendStatus(401)
  if (!blog) return response.sendStatus(204)

  if (!blog.user || (user.id && blog.user && user.id.toString() === blog.user.toString())) {
    await Blog.findByIdAndRemove(request.params.id)
    if (blog.user) {
      user.blogs = user.blogs.filter((blog) => blog.toString() !== request.params.id)
      await user.save()
    }
    response.status(204).end()
  }
})


blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlogResult = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })

  if (updatedBlogResult) {
    response.json(updatedBlogResult)
  } else {
    response.status(404).end()
  }
})


module.exports = blogRouter