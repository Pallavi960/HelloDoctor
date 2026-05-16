const Feedback = require("../models/feedback");

async function addFeedback(req, res) {

  try {

    const { name, email, message } = req.body;

    // VALIDATION

    if (!name || !email || !message) {

      return res.json({
        success: false,
        message: "All fields are required",
      });

    }

    // SAVE FEEDBACK

    const newFeedback = await Feedback.create({
      name,
      email,
      message,
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

module.exports = {
  addFeedback,
};