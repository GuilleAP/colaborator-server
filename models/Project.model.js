const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    },

    description: String,

    tech: String,

    endAt: Date,

    admin:{ type: Schema.Types.ObjectId, ref: "User" },

    team: [{ type: Schema.Types.ObjectId, ref: "User" }],

    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

// //Quan tinguem usuaris, descomentar per fer que la combinació titol+usuari sigui única
// projectSchema.index({ title: 1, user: 1}, { unique: true });

const Project = model("Project", projectSchema);

module.exports = Project;
