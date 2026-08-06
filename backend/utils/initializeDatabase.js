require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * Initialize database indexes and drop corrupt ones
 * Run this script if you experience unique constraint violations
 */

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mlsim');
    
    console.log('Connected to MongoDB');
    
    // Drop all existing indexes on User collection
    console.log('Dropping existing indexes...');
    try {
      await User.collection.dropIndexes();
      console.log('Existing indexes dropped');
    } catch (err) {
      if (err.code === 27) {
        console.log('No indexes to drop');
      } else {
        console.error('Error dropping indexes:', err.message);
      }
    }

    // Recreate indexes by calling syncIndexes
    console.log('Creating indexes...');
    await User.syncIndexes();
    console.log('Indexes created successfully');

    // Verify the indexes
    const indexes = await User.collection.getIndexes();
    console.log('Current indexes:');
    console.log(JSON.stringify(indexes, null, 2));

    console.log('\nDatabase initialization complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

initializeDatabase();
