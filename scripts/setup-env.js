#!/usr/bin/env node

import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const ENV_FILE = '.env';
const ENV_EXAMPLE = '.env.example';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnv() {
  try {
    if (!existsSync(ENV_FILE)) {
      console.log('Creating .env file from example...');
      copyFileSync(ENV_EXAMPLE, ENV_FILE);
    }

    // Read existing .env content
    const envContent = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, 'utf8') : '';
    const envVars = new Map(
      envContent
        .split('\n')
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const [key, value] = line.split('=');
          return [key.trim(), value ? value.trim() : ''];
        })
    );

    // Read example file to get all required variables
    const exampleContent = readFileSync(ENV_EXAMPLE, 'utf8');
    const requiredVars = exampleContent
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=')[0].trim());

    console.log('\nPlease enter values for environment variables:');
    
    // Ask for missing or empty variables
    for (const varName of requiredVars) {
      if (!envVars.has(varName) || !envVars.get(varName)) {
        const value = await question(`${varName}=`);
        envVars.set(varName, value);
      }
    }

    // Write to .env file
    const envString = Array.from(envVars.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    writeFileSync(ENV_FILE, envString);
    console.log('\nEnvironment variables have been saved to .env file.');

  } catch (error) {
    console.error('Error setting up environment:', error);
  } finally {
    rl.close();
  }
}

setupEnv();