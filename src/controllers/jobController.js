const Job = require('../models/jobModel');
const { processImages } = require('../services/imageProcessor');

exports.submitJob = async (req, res) => {
  const { count, visits } = req.body;

  if (!count || visits.length !== count) {
    return res.status(400).json({ error: 'Invalid input payload' });
  }

  const jobId = Date.now().toString();

  try {
    const job = new Job({ jobId, status: 'ongoing', results: [] });
    await job.save();

    processImages(jobId, visits, job);

    return res.status(201).json({ job_id: jobId });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create job' });
  }
};

exports.getJobStatus = async (req, res) => {
  const { jobid } = req.query;

  try {
    const job = await Job.findOne({ jobId: jobid });
    if (!job) {
      return res.status(400).json({ error: 'Invalid job ID' });
    }

    res.status(200).json({
      status: job.status,
      job_id: job.jobId,
      results: job.results,
      errors: job.error,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job status' });
  }
};
