const queryDate = req.query?.date;

if (!queryDate) {
  return res.status(400).send({ message: "Date query parameter is required" });
}

const query = { date: queryDate };

const sell_his_result = await sells_history_Collection.find(query).toArray();

const due_payment_res = await due_payment_Collection.find(query).toArray();

console.log(due_payment_res);

const cost_list = await cost_Collection.find(query).toArray();
// console.log(cost_list);

// calculate profit from sell
const totalSellsProfit = sell_his_result.length
  ? sell_his_result.reduce((acc, sell) => {
      const allProductsProfit = sell.products.reduce(
        (productAcc, product) => productAcc + product.profit,
        0
      );
      return acc + allProductsProfit;
    }, 0)
  : 0;

const overallDue = sell_his_result.length
  ? sell_his_result.reduce((acc, item) => acc + Number(item.due), 0)
  : 0;

const overallPaid = sell_his_result.length
  ? sell_his_result.reduce((acc, item) => acc + Number(item?.paid), 0)
  : 0;

const overallSubTotal = sell_his_result.length
  ? sell_his_result.reduce((acc, item) => acc + item.subTotal, 0)
  : 0;

// overall Paid From Due history collection
const overallPaidFromDue = due_payment_res.length
  ? due_payment_res.reduce((acc, item) => acc + Number(item?.paid), 0)
  : 0;

// console.log(overallPaidFromDue);

// cost collection
const allCost = cost_list.length
  ? cost_list.reduce((acc, item) => acc + Number(item?.amount), 0)
  : 0;

const sell_summary = {
  profit: totalSellsProfit,
  due: overallDue,
  paid: overallPaid,
  subTotal: overallSubTotal,
  duePayment: overallPaidFromDue,
  totalCost: allCost,
};

// Sending results in reverse order for better user experience
res.send(sell_summary);
