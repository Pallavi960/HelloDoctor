const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "model",
    },

    model: {
      type: String,
      required: true,
      enum: ["users", "doctors"],
    },

    title: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "add",
        "approved",
        "rejected",
        "cancelled",
        "info",
      ],
      default: "info",
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // store when notification became read
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Delete read notifications after 7 days
notificationSchema.index(
  { readAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 7,
    partialFilterExpression: {
      readAt: { $exists: true },
    },
  }
);

const notification = mongoose.model(
  "notification",
  notificationSchema
);

module.exports = notification;