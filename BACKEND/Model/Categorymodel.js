import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,          
      required: true,         
      unique: true,           
    },
   
    description: {
      type: String,           
      required: true,         
    },
  },
  
  {
    timestamps: true,        
  }
);


export default mongoose.model("Category", categorySchema);