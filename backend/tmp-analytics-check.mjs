import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Application } from './models/Application.js';
import { StudentMaster } from './models/StudentMaster.js';
import { Company } from './models/Company.js';
import { PlacementDrive } from './models/PlacementDrive.js';

dotenv.config({ path: './config/config.env' });

await mongoose.connect(process.env.MONGO_URI, { dbName: 'NIT_DELHI_PLACEMENT_PORTAL' });
console.log('connected');
const start = Date.now();
const counts = await Promise.all([
  Application.countDocuments(),
  StudentMaster.countDocuments(),
  Company.countDocuments(),
  PlacementDrive.countDocuments(),
  Application.countDocuments({ status: 'Selected' }),
]);
console.log('counts', counts);

const branchPipeline = [
  { $match: { status: 'Selected' } },
  { $lookup: { from: 'studentmasters', localField: 'student', foreignField: '_id', as: 'studentData' } },
  { $unwind: '$studentData' },
  { $group: { _id: '$studentData.branch', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
];
const branchStart = Date.now();
const branchStats = await Application.aggregate(branchPipeline);
console.log('branchStats len', branchStats.length, 'took', Date.now() - branchStart);

const companyPipeline = [
  { $match: { status: 'Selected' } },
  { $group: { _id: '$company', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'companyData' } },
  { $unwind: '$companyData' },
  { $project: { companyName: '$companyData.name', count: 1 } },
];
const companyStart = Date.now();
const companyStats = await Application.aggregate(companyPipeline);
console.log('companyStats len', companyStats.length, 'took', Date.now() - companyStart);
console.log('total', Date.now() - start);
await mongoose.disconnect();
