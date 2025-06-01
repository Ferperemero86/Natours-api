import { CreateOne, getAll } from './userServices.js'

export async function getUsers(req, res) {
  try {
    const users = await getAll()

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
      })
    }
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message,
    })
  }
}

export async function createUser(req, res) {
  try {
    const user = req.body

    if (!user) {
      return res.status(400).json({
        message: 'User data is required',
      })
    }
    const newUser = await CreateOne(user)

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      message: 'User creation failed',
      error: error.message,
    })
  }
}

export async function getUser(req, res) {
  res.status(500).json({
    message: 'This route is not yet defined',
  })
}

export async function updateUser(req, res) {
  res.status(500).json({
    message: 'This route is not yet defined',
  })
}

export async function deleteUser(req, res) {
  res.status(500).json({
    message: 'This route is not yet defined',
  })
}
