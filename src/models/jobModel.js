const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['ongoing', 'completed', 'failed'], default: 'ongoing' },
  results: [
    {
      store_id: { type: String },
      image_url: { type: String },
      perimeter: { type: Number },
    },
  ],
  error: [
    {
      store_id: { type: String },
      error: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
