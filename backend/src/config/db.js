const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS resolvers (Google 8.8.8.8 / Cloudflare 1.1.1.1) to fix querySrv ECONNREFUSED issues on local ISP/Windows DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if setServers fails in locked environments
}

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
