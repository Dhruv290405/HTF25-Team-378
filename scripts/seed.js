const { spawn } = require('child_process');
const path = require('path');

// Change to the project directory
process.chdir(path.join(__dirname, '..'));

// Run the TypeScript seed file with tsx
const child = spawn('npx', ['tsx', 'src/scripts/seed.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Failed to run seed:', error);
  process.exit(1);
});
