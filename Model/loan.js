const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
  dueDate:  {type: Date, required: true },
  amount: Number,
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' },
});

const loanSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  term: { type: Number, required: true },
  state: { type: String, enum: ['PENDING', 'APPROVED', 'PAID'], default: 'PENDING' },
  repayments: [repaymentSchema],
});

module.exports = mongoose.model('Loan', loanSchema);
