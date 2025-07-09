#!/usr/bin/env node

import Environment from 'yeoman-environment';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = new Environment();
env.register(path.join(__dirname, 'generators/app'), 'app');
env.run('app');