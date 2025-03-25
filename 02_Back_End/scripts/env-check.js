const fs = require('fs');
const path = require('path');

// Path to the .env file
const envPath = path.resolve(__dirname, '..', '.env');
const envExample = path.resolve(__dirname, '..', '.env.example');

// Required environment variables
const requiredVars = {
  'CLARIFAI_PAT': 'your_personal_access_token',
  'CLARIFAI_USER_ID': 'your_user_id',
  'CLARIFAI_APP_ID': 'your_app_id'
};

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('No .env file found. Creating one with placeholder values...');
  
  // Create content for the .env file
  const envContent = Object.entries(requiredVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('\x1b[33m%s\x1b[0m', '⚠️  .env file created with placeholder values.');
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Please update the values with your actual Clarifai credentials.');
  console.log('\x1b[36m%s\x1b[0m', '📝 Get your Clarifai credentials at: https://clarifai.com/settings/security');
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ .env file already exists.');
  
  // Optionally verify required variables exist in the file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = [];
  
  for (const key of Object.keys(requiredVars)) {
    if (!envContent.includes(`${key}=`)) {
      missingVars.push(key);
    }
  }
  
  if (missingVars.length > 0) {
    console.log('\x1b[33m%s\x1b[0m', `⚠️  Missing required variables: ${missingVars.join(', ')}`);
    console.log('\x1b[33m%s\x1b[0m', '⚠️  Please add them to your .env file.');
  }
}

// Create .env.example file if it doesn't exist
if (!fs.existsSync(envExample)) {
  console.log('Creating .env.example file...');
  
  const exampleContent = Object.entries(requiredVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envExample, exampleContent);
  console.log('\x1b[32m%s\x1b[0m', '✅ .env.example file created.');
}