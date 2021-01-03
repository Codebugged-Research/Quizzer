const Offer = require("../models/offer");
module.exports = async (req, res, next) => {
  await Offer.findById(req.body.offerId).exec(async (err, offer) => {
    if (err) {
      console.log(err);
    } else {
      if (offer.name === "No Offer") {
        next();
      } else {
        var newData = {
          redeems: offer.redeems + 1,
        };
        await Offer.findByIdAndUpdate(
          offer._id,
          { $set: newData },
          function (err, Offer) {
            if (err) {
              console.log(err);
            } else {
              next();
            }
          }
        );
      }
    }
  });
};
