import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string; // Optional to handle Google login
  img: string;
  imgPublicId: string;
  googleId?: string;
  role: "user" | "admin";
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  img: { type: String },
  imgPublicId: { type: String },
  googleId: { type: String, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

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

userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
