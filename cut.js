// my cash
app.get("/my-cash", async (req, res) => {
  try {
    console.log("Request received for /my-cash"); // Check if the route is hit
    const queryDate = req.query?.date;

    if (!queryDate) {
      return res
        .status(400)
        .send({ message: "Date query parameter is required" });
    }

    const query = { date: queryDate };

    const result = await sells_history_Collection.find(query).toArray();
    console.log(result);

    // If no data found for the given date, send 404 response
    if (result.length === 0) {
      return res
        .status(404)
        .send({ message: "No data found for the given date" });
    }

    // Sending results in reverse order for better user experience
    res.send(result.reverse());
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
      error,
    });
  }
});
