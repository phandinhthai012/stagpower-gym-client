import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            StagPower Gym
          </h1>
          <p className="text-xl text-gray-600">
            Smart Gym Management System
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <p className="text-gray-600 mb-6">
            Welcome to your smart gym management system!
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
