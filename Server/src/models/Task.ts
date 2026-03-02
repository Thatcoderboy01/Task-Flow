import mongoose, { Document, Schema, Model } from 'mongoose';

/* ============================================================
 * Task Model — user-scoped task with priority, status, tags
 * ============================================================ */

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: Date | null;
  tags: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title must be under 100 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description must be under 500 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

/* Compound index: userId + order for sorted task retrieval */
taskSchema.index({ userId: 1, order: 1 });

/* Compound index: userId + status for filtered queries */
taskSchema.index({ userId: 1, status: 1 });

const Task: Model<ITask> = mongoose.model<ITask>('Task', taskSchema);
export default Task;
