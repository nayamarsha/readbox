const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const authSchema = new mongoose.Schema(
  {
    id: Number,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    id: false
  }
);

authSchema.plugin(AutoIncrement, { id: 'user_seq', inc_field: 'id' });

module.exports = mongoose.model("User", authSchema);
