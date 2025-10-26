import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1 style={{ color: 'red', fontSize: '36px' }}>🚀 SIMPLE TEST COMPONENT</h1>
      <p>If you can see this, React is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <div style={{ 
        backgroundColor: 'yellow', 
        padding: '10px', 
        margin: '10px 0',
        border: '2px solid red'
      }}>
        This should be visible with yellow background
      </div>
    </div>
  );
};

export default SimpleTest;