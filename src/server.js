import app from "./app.js";

const PORT = process.env.PORT || 5001;
app.listen(PORT, (err) => {
  if (err) {
    console.log(`Server having an error running on port: ${PORT}`);
    process.exit(1);
  } else {
    console.log(`Server running on port: ${PORT}`);
  }
});
