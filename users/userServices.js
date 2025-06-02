import User from './userModel.js'
import { ConflictError, NotFoundError } from '../shared/errors/custom-errors.js'
import { generateMessage } from '../shared/messages/custom-messages.js'

export async function getAll() {
  try {
    const users = await User.find()
    if (users.length === 0) {
      throw new NotFoundError(generateMessage('empty', 'users', false))
    }
    return users
  } catch {
    throw new Error(generateMessage('fetch', 'users', false))
  }
}

export async function getOne(id) {
  try {
    const user = await User.findById(id)
    if (!user) {
      throw new NotFoundError(generateMessage('notFound', 'user', false))
    }
    return user
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError(generateMessage('notFound', 'user', false))
    }
    throw new Error(generateMessage('fetch', 'user', false))
  }
}

export async function CreateOne(user) {
  try {
    const existingUser = await User.find({ email: user.email })

    if (existingUser.length > 0) {
      throw new ConflictError(generateMessage('conflict', 'user', false))
    }

    const newUser = new User(user)
    await newUser.save()
    return newUser
  } catch (error) {
    throw error
  }
}

export async function UpdateOne(id, userData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    })
    if (!updatedUser) {
      throw new NotFoundError(generateMessage('notFound', 'user', false))
    }
    return updatedUser
  } catch {
    throw new Error(generateMessage('update', 'user', false))
  }
}

export async function DeleteOne(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
      throw new NotFoundError(generateMessage('notFound', 'user', false))
    }
    return deletedUser
  } catch {
    throw new Error(generateMessage('delete', 'user', false))
  }
}
