const Offer = require("../models/offer");
module.exports = async (req, res, next) => {
  await Offer.findById(req.body.offerId).exec(async (err, offer) => {
    if (err) {
      console.log(err);
    } else {
      if (offer.name === "No Offer") {
        next();
      } else {
        updateOffer = offer + 1;
        var newData = {
          offer: updateOffer,
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
