const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const activitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports = model("Activity", activitySchema);
