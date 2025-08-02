import React, { useState } from 'react';
import axios from 'axios';

const SessionTest = () => {
  const [output, setOutput] = useState('');

  const testSession = async () => {
    try {
      // STEP 1: Set the session
      const debugRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/debug-session`,
        { withCredentials: true }
      );
      console.log('Debug session response:', debugRes.data);

      // STEP 2: Try to fetch session user
      const meRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        { withCredentials: true }
      );
      console.log('Session me response:', meRes.data);

      setOutput(JSON.stringify({ debug: debugRes.data, me: meRes.data }, null, 2));
    } catch (err) {
      console.error('Error testing session:', err);
      setOutput(`Error: ${err.message}`);
    }
  };

  return (
    <div className="text-white p-4">
      <button
        onClick={testSession}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Test Session
      </button>
      <pre className="mt-4 bg-gray-900 p-4 rounded text-sm whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
};

export default SessionTest;
