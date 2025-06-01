import 'dotenv/config'
import { connectDB } from './db/index.js'

import app from './app.js'

export const PORT = process.env.PORT || 3000

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
