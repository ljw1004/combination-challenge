import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'*.spec.ts',fullyParallel:true,workers:2,retries:0,timeout:10000,reporter:'list',use:{baseURL:'http://127.0.0.1:5173',viewport:{width:390,height:844},headless:true},webServer:{command:'npm run dev',url:'http://127.0.0.1:5173',reuseExistingServer:!process.env.CI,timeout:10000}});
