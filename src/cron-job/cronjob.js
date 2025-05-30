const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../aws/sendEmail");

cron.schedule("14 23 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const yesterdayStart = startOfDay(yesterday);
  const yesterdayEnd = endOfDay(yesterday);

  try {
    const yesterdayPendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmais = [
      ...new Set(yesterdayPendingRequests.map((req) => req.toUserId.emailId)),
    ];

    for (const email of listOfEmais) {
      try {
        const res = await sendEmail.run(email);
      } catch (error) {
        console.error("sendEmail error:", error);
      }
    }
  } catch (error) {
    console.error(error, "cron job error.");
  }
});
