const cron = require("node-cron");
const childrenModel = require("./models/childrenmodel");
const ledgerModel = require("./models/ledgermodel");

// Correct ISO Week Calculation
const getISOWeekNumber = (date) => {
  const currentDate = new Date(date.valueOf());
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const days =
    Math.floor((currentDate - startOfYear) / (24 * 60 * 60 * 1000)) +
    ((startOfYear.getDay() + 6) % 7);
  return Math.ceil(days / 7);
};

// Updated Weekly Charge Scheduler
const scheduleWeeklyCharges = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Scheduled task started");
    try {
      const children = await childrenModel.getAllChildren();
      const currentIsoWeekNumber = getISOWeekNumber(new Date());

      for (const child of children) {
        const enrollmentDate = new Date(child.date_created);
        const enrollmentIsoWeekNumber = getISOWeekNumber(enrollmentDate);
        const weeksEnrolled =
          currentIsoWeekNumber - enrollmentIsoWeekNumber + 1;

        for (let week = 1; week <= weeksEnrolled; week++) {
          const ledgerWeekNumber = enrollmentIsoWeekNumber + week - 1;
          const ledgerExists = await ledgerModel.checkLedgerEntry(
            child.child_id,
            ledgerWeekNumber
          );

          if (!ledgerExists) {
            const fee = await childrenModel.calculateTuitionFee(
              child.child_type
            );
            await ledgerModel.createLedgerEntry({
              child_id: child.child_id,
              date: new Date(),
              amount: fee,
              week_number: ledgerWeekNumber,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in scheduled task: ", error);
    }
  });
};

module.exports = { scheduleWeeklyCharges };
