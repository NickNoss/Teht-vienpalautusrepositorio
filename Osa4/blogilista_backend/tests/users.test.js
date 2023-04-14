const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const User = require("../models/user")
const api = supertest(app)
const helper = require("./test_helper")
const bcrypt = require('bcrypt')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('Invalid user is not created and returns 400 status code with error message', async () => {
    const invalidUser = {
        username: 'us',
        password: 'pw'
    }

    const response = await api.post('/api/users').send(invalidUser).expect(400)
    expect(response.body.error).toContain('Username and password must be at least 3 characters long')
})

test('Duplicate username is not allowed and returns 400 status code with error message', async () => {
    const passwordHash = await bcrypt.hash('password123', 10)
    const user = new User({
        username: 'user1',
        name: 'User One',
        passwordHash
    })
    await user.save()

    const duplicateUser = {
        username: 'user1',
        password: 'password456'
    }

    const response = await api.post('/api/users').send(duplicateUser).expect(400)
    expect(response.body.error).toContain('Username must be unique')
})

test('Valid user is created and returns 201 status code with user data', async () => {
    const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'password123'
    }

    const response = await api.post('/api/users').send(newUser).expect(201)
    expect(response.body.username).toBe(newUser.username)
    expect(response.body.name).toBe(newUser.name)
    expect(response.body).not.toHaveProperty('passwordHash')
})
})