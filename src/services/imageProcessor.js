const axios = require('axios');
const sizeOf = require('image-size');
const Job = require('../models/jobModel');

exports.processImages = async (jobId, visits) => {
  try {
    const job = await Job.findOne({ jobId });

    for (const visit of visits) {
      const { store_id, image_url } = visit;

      for (const url of image_url) {
        try {
          const perimeter = await calculatePerimeter(url);
          await new Promise((resolve) => setTimeout(resolve, randomDelay(100, 400)));

          job.results.push({ store_id, image_url: url, perimeter });
        } catch (error) {
          job.error.push({ store_id, error: error.message });
          job.status = 'failed';
          await job.save();
          return;
        }
      }
    }

    job.status = 'completed';
    await job.save();
  } catch (error) {
    const job = await Job.findOne({ jobId });
    job.status = 'failed';
    await job.save();
  }
};

async function calculatePerimeter(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const dimensions = sizeOf(response.data);
    return 2 * (dimensions.height + dimensions.width);
  } catch (error) {
    throw new Error('Failed to calculate image dimensions');
  }
}

function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
