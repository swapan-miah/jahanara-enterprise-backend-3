app.post("/store", async (req, res) => {
  try {
    // Check if the product is already in the store
    const queryItem = { product_name: req.body?.product_name };
    console.log(queryItem);

    const findItem = await storeCollection.findOne(queryItem);

    if (findItem) {
      console.log(req.body);
      // If product exists, update its quantity
      const total_quantity = findItem?.store_quantity + req.body?.quantity;

      const updateDoc = {
        $set: {
          store_quantity: total_quantity,
        },
      };

      const updateResult = await storeCollection.updateOne(
        queryItem,
        updateDoc
      );
      return res.send(updateResult); // Return here to avoid further response
    } else {
      // Create new store item
      const storeItem = {
        product_name: req.body.product_name,
        company_name: req.body.company_name,
        size: req.body.size,
        store_quantity: req.body.quantity,
        purchase_price: req.body.purchase_price,
        sell_price: req.body.sell_price,
      };

      const storeInfo = await storeCollection.insertOne(storeItem);
      return res.send(storeInfo); // Return here to avoid further response
    }

    // .......................
  } catch (error) {
    console.error("Error handling store operation:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing the request" });
  }
});
