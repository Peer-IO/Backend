import mongoose from 'mongoose';
import { reviewCriterionSchema } from "./reviewcriterion.schema";

export const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  filetypes: {
    type: Array,
    required: true
  },
  maxSize: {
    type: String,
    required: true
  },
  weightage: {
    type: Number,
    required: true
  },
  reviewCriterions: [reviewCriterionSchema]
});
