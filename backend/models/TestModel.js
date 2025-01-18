import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  testID: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdAt: { type: String, required: false },
  testName: { type: String, required: true },
  testDuration: { type: String, required: true },
  questions: { type: Array, required: true },
  anskey: { type: String, required: true },
  tookBy: { type: Array, required: true },
  security: { type: Array, required: true },
  status: { type: String, default: "" } // Added status field, not required
});

const TestModel = mongoose.model("Test", testSchema);
export default TestModel;
