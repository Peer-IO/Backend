import mongoose from 'mongoose'
import { Course } from "./course.model";
import { taskSchema } from "./schemas/task.schema";
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100 // to be defined later on.
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: 'Course'
    },
    tasks: [taskSchema],
    submissions: {
      type: [mongoose.Types.ObjectId],
      ref: 'Submission',
    },
  }
);

// updating the related course with assignment id.
assignmentSchema.post('save',async (next) => {
  try {
    let relatedCourse = await Course.findById(this.course);
    relatedCourse.assignments.push(this._id);
    await relatedCourse.save();
    next();
  }catch(err) {
    next(err);
  };
});

export const Assignment = mongoose.model("Assignment", assignmentSchema);