const sells_his_length =
  (await sells_history_Collection.find({}).toArray()).length || 0;

const due_payment_his_length =
  (await due_payment_Collection.find({}).toArray()).length || 0;

const new_invoice = sells_his_length + due_payment_his_length + 1;
