import React from 'react';
import SimpleTest from "@/pages/SimpleTest";

const MinimalApp = () => {
  console.log('MinimalApp rendering...');
  
  return (
    <div>
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        left: '10px', 
        background: 'red', 
        color: 'white', 
        padding: '10px',
        zIndex: 9999,
        fontSize: '14px'
      }}>
        MINIMAL APP LOADED
      </div>
      <SimpleTest />
    </div>
  );
};

export default MinimalApp;