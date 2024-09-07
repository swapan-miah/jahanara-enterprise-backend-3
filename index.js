const express = require("express");
const app = express();
const port = process.env.PORT || 7000;
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");

const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//midleware
app.use(cors());
app.use(express.json()); // req.body undefined solve

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozyrkam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.Api_key,
  api_secret: process.env.Api_secret,
});

async function run() {
  try {
    const database = client.db("my-shop");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const storeCollection = database.collection("store");
    const purchase_history_Collection = database.collection("purchase-history");
    const sells_history_Collection = database.collection("sells-history");

    // find all products
    app.get("/products", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await productCollection.find(query).toArray();
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find all products Name
    app.get("/productsOption", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await productCollection.find(query).toArray();
          const productsName = result.map((product) => product?.product_name);
          res.send(productsName);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find product info by product name for pre order
    app.get("/productInfo_by_productName", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const product_name = req.query?.product_name;
          if (!product_name) {
            return res
              .status(400)
              .send({ message: "Product name is required" });
          }

          const query = { product_name };
          const result = await productCollection.findOne(query);

          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Product not found" });
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single product
    app.get("/product/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await productCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all pre orders
    app.get("/pre-orders", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await orderCollection.find(query).toArray();
          const pre_order = result.filter((item) => !item?.is_order == true);
          res.send(pre_order);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find all orders
    app.get("/orders", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await orderCollection.find(query).toArray();
          const pre_order = result.filter(
            (item) => item?.is_order === true && !item?.is_hidden === true
          );
          res.send(pre_order);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find Store collection
    app.get("/store", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await storeCollection.find(query).toArray();

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });
    // find purchase history collection
    app.get("/purchase-history", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = await purchase_history_Collection
            .find(query)
            .toArray();
          const reverseResult = result.reverse();
          res.send(reverseResult);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single pre order item but order item is same collection
    // so get single order item
    app.get("/find-this-pre-order/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await orderCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find all store  products Name
    app.get("/find-store-products-name", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const data = await storeCollection.find(query).toArray();
          const filterProducts = data.filter(
            (product) => product?.quantity !== 0
          );
          const productsName = filterProducts.map(
            (product) => product?.product_name
          );
          res.send(productsName);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find store product info by product name for sells
    app.get("/store-product-info-by-product-name", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const product_name = req.query?.product_name;
          if (!product_name) {
            return res
              .status(400)
              .send({ message: "Product name is required" });
          }

          const query = { product_name };
          const result = await storeCollection.findOne(query);

          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: "Product not found" });
          }
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // find Store collection
    app.get("/sells-history", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const query = {};
          const result = (
            await sells_history_Collection.find(query).toArray()
          ).reverse();
          console.log(result);

          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    //  get single stor item
    app.get("/get-single-store-item/:id", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key =
          req.headers.authorization?.split(" ")[1];

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await storeCollection.findOne(query);
          res.send(result);
        } else {
          res.status(403).send({
            message: "Forbidden: Invalid Key",
          });
        }
      } catch (error) {
        res.status(500).send({
          message: "An error occurred while fetching data.",
          error,
        });
      }
    });

    // ------------------    add product    ---------------------
    app.post("/add-product", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          const product = {
            product_name: req.body?.product_name,
            company_name: req.body?.company_name,
            size: req.body?.size,
            price: req.body?.price,
          };
          const productInfo = await productCollection.insertOne(product);
          res.send(productInfo);
        }
      } catch (error) {
        console.error("Error handling product add:", error);
        res.status(500).send("Server Error");
      }
    });
    // ------------------ Add pre order Product ---------------------
    app.post("/pre-order", async (req, res) => {
      try {
        const crose_maching_backend_key = process.env.Front_Backend_Key;
        const crose_maching_frontend_key = req.body.crose_maching_key;

        if (crose_maching_backend_key === crose_maching_frontend_key) {
          const order = {
            product_name: req.body.product_name,
            company_name: req.body.company_name,
            size: req.body.size,
            quantity: req.body.quantity,
            price: req.body.price,
            size: req.body.size,
          };

          // Fetch all orders
          const query = {};
          const result = await orderCollection.find(query).toArray();

          // Filter out orders that are not hidden
          const pendingOrder = result.filter(
            (item) => item?.is_hidden !== true
          );

          // Extract the product names from the pending orders
          const already_have_Product = pendingOrder.map(
            (item) => item.product_name
          );

          // Check if the product is already in the pending orders
          const isPost = already_have_Product.includes(req.body.product_name);

          if (!isPost) {
            // If the product is not already in the pending orders, insert the new order
            const orderInfo = await orderCollection.insertOne(order);
            res.send(orderInfo);
          } else {
            // If the product is already in the pending orders, send a message or handle accordingly
            const message = `  ${req.body?.product_name} is 
            already have in order or pre order list`;
            res.status(400).send({ acknowledged: false, message });
          }
        } else {
          res.status(403).send("Invalid key.");
        }
      } catch (error) {
        console.error("Error handling pre-order add:", error);
        res.status(500).send("Server Error");
      }
    });

    // ------------------ product  store     add hide this order    ---------------------
    app.post("/store", async (req, res) => {
      try {
        const crose_maching_backend_key = `${process.env.Front_Backend_Key}`;
        const crose_maching_frontend_key = req.body.crose_maching_key;
        if (crose_maching_backend_key == crose_maching_frontend_key) {
          // pick product name and id
          const id = req.body?.id;
          const itmeName = req.body?.product_name;

          // query for insert and delete
          const orderItemQuery = { _id: new ObjectId(req.body.id) };

          // delete  record from order collection  add to purchase order
          // ---------1. add this record  purchase history collection
          const orderRecord = await orderCollection.findOne(orderItemQuery, {
            projection: { _id: 0, is_order: 0 },
          });

          if (orderRecord) {
            const currentDate = new Date();
            const dateOnly = currentDate.toISOString().split("T")[0];
            orderRecord.storeDate = dateOnly;
            const purchaseHistoryItem =
              await purchase_history_Collection.insertOne(orderRecord);
          }

          // ---------2. delete recode from order collection
          const deleteOrder = await orderCollection.deleteOne(orderItemQuery);

          // .............................................

          // Check if the product is already store
          const alreadyStoreItems = await storeCollection.find({}).toArray();

          const already_store_Products = alreadyStoreItems.map(
            (item) => item.product_name
          );
          const isHaveItem = already_store_Products.includes(itmeName);

          if (isHaveItem) {
            const queryItem = { product_name: itmeName };
            const findItem = await storeCollection.findOne(queryItem);
            const total_quantity = findItem?.quantity + req.body?.quantity;

            const filter = { product_name: itmeName };
            const options = { upsert: true };
            const updateDoc = {
              $set: {
                quantity: total_quantity,
              },
            };
            // Update the document in the collection
            const updateResult = await storeCollection.updateOne(
              filter,
              updateDoc,
              options
            );
            res.send(updateResult);
          } else {
            // create store item information
            const storeItem = {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              quantity: req.body?.quantity,
              price: req.body?.price,
            };

            const storeInfo = await storeCollection.insertOne(storeItem);

            res.send(storeInfo);
          }
        }
      } catch (error) {
        console.error("Error handling pre order add:", error);
        res.status(500).send("Server Error");
      }
    });

    //--------------------- sell info add ------------------------------
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
          const finalStoreItem = {
            ...storeData,
            products: filteredProducts,
          };

          // Insert the modified object into the database
          const storeInfo = await sells_history_Collection.insertOne(
            finalStoreItem
          );

          // Fetch all data from storeCollection
          const storeAllData = await storeCollection.find().toArray();

          // Update store quantities based on finalStoreItem
          for (const soldProduct of finalStoreItem.products) {
            const matchingStoreProduct = storeAllData.find(
              (storeProduct) =>
                storeProduct.product_name === soldProduct.productName &&
                storeProduct.size === soldProduct.size
            );

            if (matchingStoreProduct) {
              const newQuantity =
                matchingStoreProduct.quantity - parseInt(soldProduct.quantity);

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
                { $set: { quantity: newQuantity } }
              );
            } else {
              res.status(404).send({
                message: `Product ${soldProduct.productName} not found in store`,
              });
              return;
            }
          }

          console.log(finalStoreItem);
          res.send(storeInfo);
        } else {
          res.status(401).send({ message: "Unauthorized: Invalid key" });
        }
      } catch (error) {
        console.error("Error handling store item addition:", error);
        res.status(500).json({ message: "Server Error" });
      }
    });

    // update product info
    app.put("/product_info_update/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
            },
          };
          // Update the document in the collection
          const updateResult = await productCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // update pre order
    app.put("/update-pre-order/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              quantity: req.body?.quantity,
              price: req.body?.price,
            },
          };
          // Update the document in the collection
          const updateResult = await orderCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // update pre order
    app.put("/update-store-item/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              product_name: req.body?.product_name,
              company_name: req.body?.company_name,
              size: req.body?.size,
              quantity: req.body?.quantity,
              price: req.body?.price,
              sell_price: req.body?.sell_price,
              location: req.body?.location,
            },
          };
          // Update the document in the collection
          const updateResult = await storeCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });
    // pre order to order state update
    app.put("/pre-order-to-order/:id", async (req, res) => {
      try {
        const cross_matching_backend_key = `${process.env.Front_Backend_Key}`;
        const cross_matching_frontend_key = req.body.crose_maching_key;
        if (cross_matching_backend_key === cross_matching_frontend_key) {
          const paramsId = req.params.id;
          const filter = { _id: new ObjectId(paramsId) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              is_order: true,
            },
          };
          // Update the document in the collection
          const updateResult = await orderCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(updateResult);
        } else {
          res.status(403).send("Unauthorized access");
        }
      } catch (error) {
        console.error("Error handling product info update:", error);
        res.status(500).send("Server Error");
      }
    });

    // delete single product
    app.delete("/delete-product/:id", async (req, res) => {
      try {
        const croseMachingBackendKey = process.env.Front_Backend_Key;
        const croseMachingFrontendKey = req.body.crose_maching_key;

        if (croseMachingBackendKey === croseMachingFrontendKey) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await productCollection.deleteOne(query);
          res.send(result);
        }
      } catch (error) {
        console.error("Error handling delete product:", error);
        res.status(500).send("Server Error");
      }
    });

    // delete single pre order item
    app.delete("/delete-pre-order-item/:id", async (req, res) => {
      try {
        const croseMachingBackendKey = process.env.Front_Backend_Key;
        const croseMachingFrontendKey = req.body.crose_maching_key;

        if (croseMachingBackendKey === croseMachingFrontendKey) {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await orderCollection.deleteOne(query);
          res.send(result);
        }
      } catch (error) {
        console.error("Error handling delete product:", error);
        res.status(500).send("Server Error");
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My Shop Surver is Run");
});

app.listen(port, () => {
  console.log(`My Shop Surver run on Port:  ${port}`);
});
