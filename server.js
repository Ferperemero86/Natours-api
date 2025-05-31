import "dotenv/config";

import app from "./app.js";

import { PORT } from "./shared/constants.js";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
