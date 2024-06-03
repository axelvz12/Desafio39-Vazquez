const { Schema, model } = require('mongoose');

const collection = 'tickets';

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      name: String,
      price: Number,
    },
  ],
});

const Ticket = model(collection, ticketSchema);

module.exports = Ticket;