/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const app = require("./sync_app.js");

app();

module.exports = nextConfig
