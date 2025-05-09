import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  // Ensures that the category name is unique and indexed
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// No need for additional index if 'unique' is already set on 'name'

export default mongoose.model("Category", categorySchema);