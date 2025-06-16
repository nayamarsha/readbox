const mongoose = require("mongoose");
const Counter = require("./counter");

const AuthSchema = new mongoose.Schema({
  accountId: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  }
}, {
  timestamps: true
});

// Pre-hook untuk generate ID seperti ACC0001
AuthSchema.pre("validate", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "accountId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.accountId = "ACC" + counter.seq.toString().padStart(4, "0");
  }
  next();
});

module.exports = mongoose.model("users", AuthSchema);
