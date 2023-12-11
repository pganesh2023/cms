const ledgerModel = require('../models/ledgermodel');

exports.getLedgerByChild = async (req, res) => {
  try {
    const childId = req.params.child_id;
    // console.log("childID in ledger controller: ", childId);
    const entries = await ledgerModel.getLedgerEntriesByChild(childId);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLedgerEntry = async (req, res) => {
  try {
    const ledgerId = req.params.ledgerId;
    // console.log("ledgerId: ", ledgerId);
    const { status } = req.body;
    await ledgerModel.updatePaymentStatus(ledgerId, status);
    res.json({ message: 'Ledger updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add more functions for other ledger operations
