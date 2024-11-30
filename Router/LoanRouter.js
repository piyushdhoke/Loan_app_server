const express = require('express')
const router = express.Router()
const {createLoan, approvedLoan,getLoan, repayment, getLoans} = require('../Controller/loanController')
const auth = require('../middleware/authconfig')

router.post('/loans',auth('Customer'),createLoan)
router.patch('/loans/:id/approve', approvedLoan)
router.get('/loans',auth(),getLoan)
router.get('/loan',getLoans)
router.post('/loans/:id/repayments', auth('Customer'),repayment)

module.exports = router