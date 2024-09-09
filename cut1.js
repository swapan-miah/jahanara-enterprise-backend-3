app.post("/store", async (req, res) => {
  try {
    const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
    const crose_maching_frontend_key = req.body.crose_maching_key;

    if (crose_maching_backend_key == crose_maching_frontend_key) {
      // pick product name and id
      const id = req.body?.id;
      const itemName = req.body?.product_name;

      // query for insert and delete
      const orderItemQuery = { _id: new ObjectId(req.body.id) };

      // ---------1. Add this record to purchase history collection
      const orderRecord = await orderCollection.findOne(orderItemQuery, {
        projection: { _id: 0, is_order: 0 }, // Ignore unnecessary fields
      });

      if (orderRecord) {
        const currentDate = new Date();
        const dateOnly = currentDate.toISOString().split("T")[0];
        orderRecord.storeDate = dateOnly;

        // Insert into purchase history
        const purchaseHistoryItem = await purchase_history_Collection.insertOne(
          orderRecord
        );
        if (!purchaseHistoryItem.acknowledged) {
          return res
            .status(500)
            .send("Failed to insert into purchase history.");
        }

        // ---------2. Delete the record from order collection
        const deleteOrder = await orderCollection.deleteOne(orderItemQuery);
        if (deleteOrder.deletedCount === 0) {
          return res.status(404).send("Order not found.");
        }

        // Now proceed with storing the item in store collection

        // Check if the product is already in the store
        const queryItem = { product_name: itemName };
        const findItem = await storeCollection.findOne(queryItem);

        if (findItem) {
          // If product exists, update its quantity
          const total_quantity = findItem.store_quantity + req.body.quantity;

          const updateDoc = {
            $set: {
              store_quantity: total_quantity,
            },
          };
          const updateResult = await storeCollection.updateOne(
            queryItem,
            updateDoc
          );
          res.send({ message: "Store item updated.", updateResult });
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
          console.log(storeInfo);

          //   res.send(storeInfo);
        }
      } else {
        res.status(404).send("Order item not found.");
      }
    } else {
      res.status(403).send("Unauthorized request.");
    }
  } catch (error) {
    console.error("Error handling store operation:", error);
    res.status(500).send("Server Error");
  }
});
