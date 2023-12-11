const pool = require("../config/database");

module.exports = {
  async createLedgerEntry(entryData) {
    const { child_id, date, amount, week_number } = entryData;
    await pool.query(
      "INSERT INTO Ledgers (child_id, date, amount, week_number) VALUES (?, ?, ?, ?)",
      [child_id, date, amount, week_number]
    );
  },

  async getLedgerEntriesByChild(childId) {
    const query = "SELECT * FROM Ledgers WHERE child_id = ?";
    return await pool.query(query, [childId]);
  },

  async updatePaymentStatus(ledgerId, status) {
    const query = "UPDATE Ledgers SET status = ? WHERE ledger_id = ?";
    await pool.query(query, [status, ledgerId]);
  },
  async checkLedgerEntry(childId, isoWeekNumber) {
    const query = `SELECT COUNT(*) AS count FROM Ledgers WHERE child_id = ? AND week_number = ?`;
    try {
      const [result] = await pool.query(query, [childId, isoWeekNumber]);
      return result.count > 0;
    } catch (error) {
      console.error("Error in checkLedgerEntry:", error);
      throw error;
    }
  },

};
