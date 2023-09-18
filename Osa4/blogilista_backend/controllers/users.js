const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', 'url title author id')
    response.json(users)
})

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: 'Both username and password are required' })
    }

    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'Username and password must be at least 3 characters long' })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({ error: 'Username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await newUser.save()

    response.status(201).json(savedUser)
})

userRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs', 'url title author id')
    if (user) {
        response.json(user)
    } else {
        response.status(404).end()
    }
})

userRouter.delete('/', async (request, response) => {
    await User.deleteMany({}) 
    response.sendStatus(204)
})

module.exports = userRouter