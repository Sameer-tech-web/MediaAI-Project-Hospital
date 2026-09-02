const Counter = require('../models/Counter');
const Patient = require('../models/Patient');

const COUNTER_ID = 'patient_mrn';

const ensureMrnCounter = async () => {
  const existingCounter = await Counter.exists({ _id: COUNTER_ID });

  if (existingCounter) {
    return;
  }

  const [highestMrn] = await Patient.aggregate([
    { $match: { mrn: /^MRN-\d+$/ } },
    {
      $project: {
        sequence: { $toLong: { $substrBytes: ['$mrn', 4, 18] } },
      },
    },
    { $group: { _id: null, max: { $max: '$sequence' } } },
  ]);

  const seed = highestMrn?.max || 0;

  try {
    await Counter.updateOne(
      { _id: COUNTER_ID },
      { $max: { seq: seed } },
      { upsert: true }
    );
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }

    await Counter.updateOne({ _id: COUNTER_ID }, { $max: { seq: seed } });
  }
};

const generateMRN = async () => {
  await ensureMrnCounter();

  const counter = await Counter.findOneAndUpdate(
    { _id: COUNTER_ID },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return `MRN-${String(counter.seq).padStart(5, '0')}`;
};

module.exports = { generateMRN };
