module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'run start',
      // Specify the path to your Next.js app
      cwd: '/home/careerforge/front',
      exec_mode: 'cluster',
      instances: 2, // 'max' to use all cores, or 1 for Next.js
      watch: false,
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'backend',
      script: 'npm',
      args: 'start',
      // Specify the path to your Node.js backend
      cwd: '/home/careerforge/back',
      exec_mode: 'cluster',
      instances: 2, // Use all available CPU cores
      watch: false,
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
