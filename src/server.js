import app from "./app.js";

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  app.listen(PORT, "0.0.0.0", (err) => {
    if (err) {
      console.log(`Server having an error running on port: ${PORT}`);
      process.exit(1);
    } else {
      console.log(`Server running on port: ${PORT}`);
    }
  });
}
