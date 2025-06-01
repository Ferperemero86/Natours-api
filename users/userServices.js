import User from './userModel.js'

export async function getAll() {
  try {
    const users = await User.find()
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function CreateOne(user) {
  try {
    const newUser = new User(user)
    await newUser.save()
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('User creation failed')
  }
}
