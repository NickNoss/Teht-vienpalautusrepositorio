const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require ('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('dummy returns 1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
      const blogs = []
      const result = listHelper.totalLikes(blogs)
      expect(result).toBe(0)
    })
  
    test('when list has only one blog equals the likes of that', () => {
      const blogs = [
        {
          title: 'Test Blog',
          author: 'Test Author',
          url: 'http://testblog.com',
          likes: 5
        }
      ]
  
      const result = listHelper.totalLikes(blogs)
      expect(result).toEqual(5)
    })
  
    test('of a bigger list is calculated right', () => {
  
      const result = listHelper.totalLikes(helper.initialBlogs)
      expect(result).toEqual(36)
    })
  })

  describe('favoriteBlog', () => {
    test('returns blog with most likes', () => {
  
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
    })
})

describe("most blogs", () => {

  test("multiple blogs", () => {
    expect(listHelper.mostBlogs(helper.initialBlogs)).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    })
  })

  test("one blog", () => {
    expect(listHelper.mostBlogs(helper.initialBlogs.slice(0, 1))).toEqual({
      author: "Michael Chan",
      blogs: 1,
    })
  })
})

describe("most likes", () => {
  test("author with most likes, multiple blogs", () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})

describe('API GET/POST tests', () => {
  const newBlog = {
    title: 'Testiblogi',
    author: 'NickNoss',
    url: 'https://www.esimerkkitesti.fi',
    likes: 5
  }

  let token = null
  beforeAll(async () => {
    await User.deleteMany({})
    for (const user of helper.initialUsers) {
      await api.post('/api/users').send(user)
    }

    const reqForToken = await api
      .post('/api/login')
      .send(helper.initialUsers[0])
    token = reqForToken.body.token
  })

  test('returns number of blogs in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('checks if identification is called "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })
  
  test('blog can be added', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        newBlog.id = response.body.id
        expect(response.body.title).toContain('Testiblogi')
      })
  })

  test('likes default to zero', async () => {
    const newBlog = {
      title: 'Testiblogi',
      author: 'NickNoss',
      url: 'https://www.esimerkkitesti.fi'
    }
  
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
  
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
  })
  

  test('title and url required', async () => {
    const newBlog = {
      author: 'NickNossTestaaja',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      
  })

  test('401 if token is missing', async () => {
    const newBlog = {
      title: 'Testiblogi',
      author: 'NickNoss',
      url: 'https://www.esimerkkitesti.fi',
      likes: 5,
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  })
})

describe('API DELETE tests', () => {
  let token = null
  beforeAll(async () => {
    await User.deleteMany({})
    for (const user of helper.initialUsers) {
      await api.post('/api/users').send(user)
    }

    const reqForToken = await api
      .post('/api/login')
      .send(helper.initialUsers[0])
    token = reqForToken.body.token
  })

  test('Blog can be deleted', async () => {
    const blogs = await api.get('/api/blogs')
    const idToDelete = blogs.body[0].id
    await api.delete(`/api/blogs/${idToDelete}`).set('Authorization', `Bearer ${token}`).expect(204)
  })
  
  test('Blogs decrease in amount after deletion', async () => {
    const blogs = await api.get('/api/blogs')
    await api.delete(`/api/blogs/${blogs.body[0].id}`).set('Authorization', `Bearer ${token}`)
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body.length).toBe(helper.initialBlogs.length - 1)
  })
})

describe('API UPDATE tests', () => {
  test('Values update', async () => {
    const blogs = await api.get('/api/blogs')
    const id = blogs.body[0].id

    await api.put(`/api/blogs/${id}`).send({ likes: 50 })
    const updatedBlogs = await api.get('/api/blogs')
    expect(updatedBlogs.body[0].likes).toBe(50)
  })
})
