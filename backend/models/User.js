const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'viewer',
    },
    organization: String,
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    organization: this.organization,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
