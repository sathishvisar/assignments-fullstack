import Jobs from '../models/Jobs';

export const ListJobs = async () => {
  return await Jobs.find();
};