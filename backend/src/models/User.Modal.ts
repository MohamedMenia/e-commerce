import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  password?: string; // Optional to handle Google login
  img: {
    link: string;
    publicId: string;
  };
  googleId?: string;
  role: "user" | "admin" | "seller";
  phone: string;
  comparePassword(password: string): Promise<boolean>;
}
interface UserModel extends Model<IUser> {
  comparePassword(userId: string, password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  img: {
    link: { type: String },
    publicId: { type: String },
  },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
  phone: { type: String, unique: true, sparse: true },
});

// Ensuring indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash password before updating
userSchema.pre("findOneAndUpdate", async function (next) {
  const update: any = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
