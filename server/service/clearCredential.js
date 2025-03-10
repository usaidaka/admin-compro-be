// const { Op } = require("sequelize");
// const moment = require("moment");
// const schedule = require("node-schedule");
// const db = require("../../models");
// const GeneralHelper = require("../helpers/generalHelper");

// const fileName = "server/schedule/clearCredential.js";

// try {
//   const job = schedule.scheduleJob("*/2 * * * *", async () => {
//     const transaction = await db.sequelize.transaction();
//     console.log("schedule running");
//     try {
//       const now = moment.utc();

//       await db.Credential.destroy({
//         where: {
//           expiredAt: {
//             [Op.lt]: now.toDate(),
//           },
//         },
//         transaction,
//       });

//       await transaction.commit();
//     } catch (err) {
//       await transaction.rollback();
//       console.log([fileName, "delete customer", "ERROR"], { info: `${err}` });
//       return Promise.reject(GeneralHelper.errorResponse(err));
//     }
//   });
// } catch (err) {
//   console.error("Failed to set up schedule:", err);
// }
