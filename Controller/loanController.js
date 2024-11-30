const Loan = require('../Model/loan')


// create loan
const createLoan = async (req, res) => {
  try {
    const { amount, term } = req.body;
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required.' });
    }
 // Validate input
    if (!amount || !term) {
      return res.status(400).json({ error: 'Amount and term are required.' });
    }
    if (amount <= 0 || term <= 0) {
      return res.status(400).json({ error: 'Amount and term must be positive values.' });
    }

  // Generate scheduled repayments
  const repayments = [];
  const weeklyAmount = (amount / term).toFixed(2); 
  const today = new Date();

  for (let i = 0; i < term; i++) {
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 7 * (i + 1));
    repayments.push({
      dueDate: dueDate.toISOString(), 
      amount: i === term - 1 ? (amount - weeklyAmount * i).toFixed(2) : weeklyAmount,
      status: 'PENDING',
    });
  }
    const loan = new Loan({
      amount,
      term,
      repayments,
      status: 'PENDING',
      customerId,
      createdAt: new Date(),
    });
    await loan.save();
    res.status(201).json({
      message: 'Loan created successfully.',
      loan,
    });
  } catch (error) {
    console.error('Error creating loan:', error.message);
    res.status(500).json({ error: 'An error occurred while creating the loan.' });
  }
};






// aprooved loan
const approvedLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).send('Loan not found');
    loan.state = 'APPROVED';
    await loan.save();
    res.json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while approving the loan');
  }
};



//get loanById
const getLoan =  async (req, res) => {
    const loans = await Loan.find({ customerId: req.user.id });
    res.json(loans);
  }



const getLoans =  async (req, res) => {
    const loans = await Loan.find();
    res.json(loans);
  }

  



//repayment
const repayment =  async (req, res) => {
    const { amount } = req.body;
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).send('Loan not found');
    if (loan.customerId.toString() !== req.user.id) return res.status(403).send('Forbidden');
  
    const repayment = loan.repayments.find((rep) => rep.status === 'PENDING');
    if (!repayment) return res.status(400).send('No pending repayments');
  
    if (amount >= repayment.amount) {
      repayment.status = 'PAID';
      const allPaid = loan.repayments.every((rep) => rep.status === 'PAID');
      if (allPaid) loan.state = 'PAID';
      await loan.save();
      res.json(loan);
    } else {
      res.status(400).send('Amount insufficient');
    }
  }
  
  
module.exports = {createLoan, approvedLoan,getLoan, repayment,getLoans}