const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    minLength: 1
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    minLength: 1
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  virtuals: true,
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog