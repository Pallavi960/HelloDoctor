const Feedback = require("../models/feedback");

async function addFeedback(req, res) {

  
  const userId =  req.params.id
  try {

    const {  message, star } = req.body;
    if (!message||!star) {

      return res.json({
        success: false,
        message: "All fields are required",
      });

    }

    // SAVE FEEDBACK

    const newFeedback = await Feedback.create({
      userId,
      message,
      star
    });

    // RESPONSE

    return res.json({
      success: true,
      message: "Feedback submitted successfully",
      data: newFeedback,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: "Server error",
    });

  }

}

async function getFeedback(req, res) {

  try {

    // GET ALL FEEDBACK
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });

    if (!allFeedback || allFeedback.length === 0) {
      return res.json({
        success: false,
        message: "No feedback found",
        data: [],
      });
    }

    return res.json({
      success: true,
      message: "Feedback fetched successfully",
      total: allFeedback.length,
      data: allFeedback,
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: "Server error",
    });

  }

}

module.exports = {
  addFeedback,
  getFeedback,
};