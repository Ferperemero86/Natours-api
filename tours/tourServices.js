import path from 'path'

import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = path.join(__dirname, `/../dev-data/data/tours-simple.json`)

import { findItemIndex } from '../shared/utils.js'

async function getFilePath() {
  try {
    const tours = await readFile(filePath, 'utf-8')

    if (!tours) {
      throw new Error('Tours data not found')
    }

    return JSON.parse(tours)
  } catch (error) {
    throw new Error(`${error} Could not get tours file path`)
  }
}

export async function getAll() {
  try {
    const tours = await getFilePath()

    return tours
  } catch (error) {
    throw new Error`${error}: Could not retrieve tours data`()
  }
}

export async function getOne(id) {
  try {
    const tours = await getFilePath()

    const tour = findItemIndex(tours, parseInt(id, 10))
    if (tour === -1) {
      throw new Error(`Tour with id ${id} not found`)
    }
    return tours[tour]
  } catch {
    throw new Error(`Could not retrieve tour data`)
  }
}

export async function createOne(newTour) {
  try {
    const tours = await getFilePath()

    const newTourData = {
      id: tours.length + 1,
      ...newTour,
    }

    await writeFile(filePath, JSON.stringify([...tours, newTourData]))

    return newTourData
  } catch (error) {
    throw new Error(`${error} Could not create new tour`)
  }
}

export async function updateOne(id, newTourData) {
  try {
    const tours = await getFilePath()

    const tourIndex = findItemIndex(tours, parseInt(id, 10))

    if (tourIndex === -1) {
      throw new Error(`Could not find tour`)
    }

    // Merge existing and new data
    const updatedTour = { ...tours[tourIndex], ...newTourData }
    tours[tourIndex] = updatedTour

    // Save updated array
    await writeFile(filePath, JSON.stringify(tours, null, 2))

    return updatedTour
  } catch {
    throw new Error(`Could not update tour`)
  }
}

export async function deleteOne(id) {
  try {
    const tours = await getFilePath()

    const tourIndex = findItemIndex(tours, parseInt(id, 10))

    if (tourIndex === -1) {
      throw new Error(`Could not find tour`)
    }

    const updatedTours = tours.filter((tour) => tour.id !== parseInt(id, 10))

    await writeFile(filePath, JSON.stringify(updatedTours))
  } catch {
    throw new Error(`Could not delete tour`)
  }
}
