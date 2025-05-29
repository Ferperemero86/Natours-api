import express from "express";
import morgan from "morgan";
import path from "path";

import { readFile, writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accessLogStream = createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

const app = express();
const PORT = process.env.PORT || 3000;

const filePath = `${__dirname}/dev-data/data/tours-simple.json`;

app.use(morgan("combined", { stream: accessLogStream }));
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

    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
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

async function getUsers(req, res) {
  res.status(500).json({
    message: "This route is not yet defined",
  });
}

async function createUser(req, res) {
  res.status(500).json({
    message: "This route is not yet defined",
  });
}
async function getUser(req, res) {
  res.status(500).json({
    message: "This route is not yet defined",
  });
}
async function updateUser(req, res) {
  res.status(500).json({
    message: "This route is not yet defined",
  });
}
async function deleteUser(req, res) {
  res.status(500).json({
    message: "This route is not yet defined",
  });
}

app.route("/api/v1/tours").get(getTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route("/api/v1/users").get(getUsers).post(createUser);

app
  .route("/api/v1/tours/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
