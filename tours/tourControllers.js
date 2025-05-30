import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from "./tourServices.js";

export async function getTours(req, res) {
  try {
    const tours = await getAll();

    if (!tours || tours.length === 0) {
      return res.status(404).json({
        message: "No tours found",
      });
    }

    res.status(200).json({
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `${error} Could not retrieve tours data`,
    });
  }
}

export async function getTour(req, res) {
  try {
    const { id } = req.params;
    const tour = await getOne(id);

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
  } catch (error) {
    res.status(500).json({
      message: `${error} Could not retrieve tour data`,
    });
  }
}

export async function createTour(req, res) {
  try {
    const newTour = req.body;

    if (!newTour) {
      return res.status(403).json({
        message: "Please fill in all the fields",
      });
    }

    const newTourData = await createOne(newTour);

    res.status(201).json({
      data: {
        tour: newTourData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error} Could not create new tour`,
    });
  }
}

export async function updateTour(req, res) {
  try {
    const { id } = req.params;
    const newTourData = req.body;

    const updatedTour = await updateOne(id, newTourData);

    res.status(200).json({
      message: "Tour updated successfully",
      data: {
        tour: updatedTour,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update tour",
      error: error.message,
    });
  }
}

export async function deleteTour(req, res) {
  try {
    const { id } = req.params;

    await deleteOne(id);

    res.status(204).json({
      message: "Tour deleted successfully",
    });
  } catch {
    return res.status(500).json({
      message: "Could not delete tour",
    });
  }
}
