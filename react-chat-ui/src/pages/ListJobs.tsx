import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useJobsMutation } from '../features/jobs/jobsApi';
import { logout } from '../features/auth/authSlice';

const ListJobs: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const [jobsTrigger, { isLoading, error }] = useJobsMutation();
  const [jobList, setJobList] = useState<any[]>([]);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsTrigger({}).unwrap();
        setJobList(response.jobs);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };

    fetchJobs();
  }, [jobsTrigger]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">EngageBot Chat</h1>
        <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome, {`${user?.firstname} ${user?.lastname}` || user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-col flex-1 p-6 overflow-y-auto">
        <h2 className="mb-4 text-lg font-bold">Job Listings</h2>

        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error fetching jobs.</p>}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobList.map((job: any, index) => (
                <div onClick={() => navigate(`/chat/${job._id}`)} key={index} className="p-4 transition-transform transform bg-white rounded shadow cursor-pointer hover:scale-105 hover:shadow-lg">
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.location} | {job.jobType}</p>
                <p className="mt-2 text-sm text-gray-500">Experience: {job.experience}</p>
                {/* <p className="text-sm text-gray-500">Salary: {job.salary}</p> */}
                <p className="mt-1 text-sm font-medium">
                    Salary Range: {`${job.salary.currency} ${job.salary.min} - ${job.salary.max}`}
                </p>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default ListJobs;
