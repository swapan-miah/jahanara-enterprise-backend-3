app.post("/sell", async (req, res) => {
  try {
    const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
    const crose_maching_frontend_key = req.body.crose_maching_key;

    if (crose_maching_backend_key === crose_maching_frontend_key) {
      // Extract the storeItem from the request body
      const storeItem = req.body;

      // Remove crose_maching_key from storeItem
      const { crose_maching_key, products, ...storeData } = storeItem;

      // Filter out products with quantity 0
      const filteredProducts = products.filter(
        (product) => product.quantity > 0
      );

      // Check if all products have a quantity of 0
      if (filteredProducts.length === 0) {
        res.status(400).send({
          message: "You did not sell any items. All quantities are zero.",
        });
        return;
      }

      // Create a new object with filtered products
      const final_Sells_Item = {
        ...storeData,
        products: filteredProducts,
      };

      // Insert the modified object into the database
      const storeInfo = await sells_history_Collection.insertOne(
        final_Sells_Item
      );

      // Fetch all data from storeCollection
      const storeAllData = await storeCollection.find().toArray();

      // Update store quantities based on final_Sells_Item
      for (const soldProduct of final_Sells_Item.products) {
        const matchingStoreProduct = storeAllData.find(
          (storeProduct) =>
            storeProduct.product_name === soldProduct.productName &&
            storeProduct.size === soldProduct.size
        );

        if (matchingStoreProduct) {
          const newQuantity =
            matchingStoreProduct.store_quantity -
            parseInt(soldProduct.sell_quantity);

          // Ensure newQuantity is not negative
          if (newQuantity < 0) {
            res.status(400).send({
              message: `Insufficient stock for ${soldProduct.productName}. Available: ${matchingStoreProduct.quantity}, Requested: ${soldProduct.quantity}`,
            });
            return;
          }

          // Update the store product's quantity in the database
          await storeCollection.updateOne(
            { _id: matchingStoreProduct._id },
            { $set: { store_quantity: newQuantity } }
          );
        } else {
          res.status(404).send({
            message: `Product ${soldProduct.productName} not found in store`,
          });
          return;
        }
      }

      console.log(final_Sells_Item);
      res.send(storeInfo);
    } else {
      res.status(401).send({ message: "Unauthorized: Invalid key" });
    }
  } catch (error) {
    console.error("Error handling store item addition:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
