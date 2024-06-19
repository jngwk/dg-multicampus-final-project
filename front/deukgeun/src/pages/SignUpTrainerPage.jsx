import React, { useState } from 'react';
import { signUpTrainer } from '../api/signUpApi';

function SignUpTrainerPage() {
  const [trainerInfo, setTrainerInfo] = useState({
    trainerAbout: '',
    trainerCareer: '',
    trainerImage: '',
    userName: '',
    email: '',
    password: '',
    address: '',
    detailAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpTrainer(trainerInfo);
      console.log('Response:', response);
      alert('Trainer registered successfully!');
      // Optionally, you can redirect to another page after successful signup
    } catch (error) {
      console.error('Error:', error.message);
      alert('Failed to register trainer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Trainer Signup</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="trainerCareer" className="block text-sm font-medium text-gray-700">
                Trainer Career
              </label>
              <input
                id="trainerCareer"
                name="trainerCareer"
                type="text"
                autoComplete="trainerCareer"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.trainerCareer}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="trainerAbout" className="block text-sm font-medium text-gray-700">
                Trainer About
              </label>
              <textarea
                id="trainerAbout"
                name="trainerAbout"
                rows="3"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.trainerAbout}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="trainerImage" className="block text-sm font-medium text-gray-700">
                Trainer Image URL
              </label>
              <input
                id="trainerImage"
                name="trainerImage"
                type="url"
                autoComplete="trainerImage"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.trainerImage}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="userName"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.userName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">
                Detail Address
              </label>
              <input
                id="detailAddress"
                name="detailAddress"
                type="text"
                autoComplete="detailAddress"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.detailAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center items-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Register Trainer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpTrainerPage;
