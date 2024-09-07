app.get("/update-price-field", async (req, res) => {
  const updateResult = await storeCollection.updateMany(
    {}, // Empty filter matches all documents
    {
      $rename: { price: "purchase_price" }, // Rename field
    }
  );
});
