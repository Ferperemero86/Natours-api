import {
  CreateOne,
  getAll,
  getOne,
  DeleteOne,
  UpdateOne,
} from './userServices.js'
import { generateMessage } from '../shared/messages/custom-messages.js'
import { NotFoundError, ConflictError } from '../shared/errors/custom-errors.js'

export async function getUsers(req, res) {
  try {
    const users = await getAll()

    if (users.length === 0) {
      return res.status(404).json({
        message: generateMessage('empty', 'users', false),
      })
    }
    res.status(200).json({
      message: generateMessage('fetch', 'users'),
      users,
    })
  } catch (error) {
    res.status(500).json({
      message: generateMessage('fetch', 'users', false),
      error: error.message,
    })
  }
}

export async function createUser(req, res) {
  try {
    const user = req.body

    if (!user) {
      return res.status(400).json({
        message: generateMessage('dataRequired', 'user', false),
      })
    }
    const newUser = await CreateOne(user)

    res.status(201).json({
      message: generateMessage('create', 'user'),
      user: newUser,
    })
  } catch (error) {
    if (error instanceof ConflictError) {
      return res.status(409).json({
        message: generateMessage('conflict', 'user', false),
      })
    }
    res.status(500).json({
      message: generateMessage('create', 'user', false),
      error: error.message,
    })
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: generateMessage('idRequired', 'user', false),
      })
    }
    const user = await getOne(id)

    res.status(200).json({
      message: generateMessage('fetch', 'user'),
      user,
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: generateMessage('notFound', 'user', false),
      })
    }
    res.status(500).json({
      message: 'Failed to fetch user',
      error: error.message,
    })
  }
}

export async function updateUser(req, res) {
  try {
    const user = req.body
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        message: generateMessage('idRequired', 'user', false),
      })
    }
    if (!user) {
      return res.status(400).json({
        message: generateMessage('dataRequired', 'user', false),
      })
    }
    const updatedUser = await UpdateOne(id, user)
    res.status(200).json({
      message: generateMessage('update', 'user'),
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error updating user:', error.constructor.name)

    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: generateMessage('notFound', 'user', false),
      })
    }
    res.status(500).json({
      message: generateMessage('update', 'user', false),
      error: error.message,
    })
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        message: generateMessage('idRequired', 'user', false),
      })
    }
    const deletedUser = await DeleteOne(id)
    res.status(200).json({
      message: generateMessage('delete', 'user'),
      user: deletedUser,
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: generateMessage('notFound', 'user', false),
      })
    }
    res.status(500).json({
      message: generateMessage('delete', 'user', false),
      error: error.message,
    })
  }
}
