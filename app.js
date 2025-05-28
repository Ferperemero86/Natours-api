import express from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const filePath = `${__dirname}/dev-data/data/tours-simple.json`;

app.use(express.json());

async function getToursFilePath() {
  try {
    const tours = await readFile(filePath, "utf-8");

    if (!tours) {
      throw new Error("Tours data not found");
    }

    return JSON.parse(tours);
  } catch (error) {
    console.error("Error getting file path:", error);
    throw new Error("Could not get tours file path");
  }
}

async function getTours(req, res) {
  try {
    const tours = await getToursFilePath();
    console.log("tours:", tours, filePath);
    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    console.log("Error reading tours data:", error);
    res.status(500).json({
      message: "Could not retrieve tours data",
    });
  }
}

async function getTour(req, res) {
  const tours = await getToursFilePath();
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id === parseInt(id, 10));

  if (!tour) {
    return res.status(404).json({
      message: "Tour not found",
    });
  }

  res.status(200).json({
    data: {
      tour,
    },
  });
}

async function createTour(req, res) {
  try {
    const tours = await getToursFilePath();
    const newTour = req.body;

    if (!newTour) {
      return res.status(403).json({
        message: "Please fill in all the fields",
      });
    }

    if (!tours) {
      return res.status(400).json({
        message: "Invalid tour data",
      });
    }

    const newTourData = {
      id: tours.length + 1,
      ...newTour,
    };

    await writeFile(filePath, JSON.stringify([...tours, newTourData]));

    res.status(201).json({
      data: {
        tour: newTourData,
      },
    });
  } catch (error) {
    console.error("Error creating new tour:", error);
    return res.status(500).json({
      message: "Could not create new tour",
    });
  }
}

async function updateTour(req, res) {
  try {
    const tours = await getToursFilePath();
    const { id } = req.params;
    const newTourData = req.body;

    const tourIndex = tours.findIndex((tour) => tour.id === parseInt(id, 10));

    if (tourIndex === -1) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    // Merge existing and new data
    const updatedTour = { ...tours[tourIndex], ...newTourData };
    tours[tourIndex] = updatedTour;

    // Save updated array
    await writeFile(filePath, JSON.stringify(tours, null, 2));

    res.status(200).json({
      message: "Tour updated successfully",
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({
      message: "Could not update tour",
      error: error.message,
    });
  }
}

async function deleteTour(req, res) {
  try {
    const tours = await getToursFilePath();
    const { id } = req.params;

    const tourIndex = tours.findIndex((tour) => tour.id === parseInt(id, 10));

    if (!tourIndex) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    const updatedTours = tours.filter((tour) => tour.id !== parseInt(id, 10));

    await writeFile(filePath, JSON.stringify(updatedTours));

    res.status(204).json({
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    return res.status(500).json({
      message: "Could not delete tour",
    });
  }
}

// GET /api/v1/tours
// Return json file tours-simple.json {results: tours.length, data: {tours: []}}
app.get("/api/v1/tours", getTours);

// Add GET route for a specific tour
// GET /api/v1/tours/:id
app.get("/api/v1/tours/:id", getTour);

// POST tours /api/v1/tours
// Create new Tour
app.post("/api/v1/tours", createTour);

// PATCH top update properties of the object only
// PATCH /api/v1/tours/:id
app.patch("/api/v1/tours/:id", updateTour);

// DELETE /api/v1/tours/:id
app.delete("/api/v1/tours/:id", deleteTour);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
