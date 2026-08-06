require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mlsim';

async function fetchAndListActiveUsers() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully to MongoDB!\n');

    const users = await User.find()
      .select('firstName lastName email avatar role points streak progress lastActive createdAt completedModules')
      .sort({ lastActive: -1, points: -1 })
      .lean();

    console.log(`=======================================================`);
    console.log(` TOTAL REGISTERED USERS FOUND IN DATABASE: ${users.length} `);
    console.log(`=======================================================\n`);

    if (users.length === 0) {
      console.log('No registered users found in the database collection.');
    } else {
      users.forEach((user, index) => {
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unnamed Learner';
        const xp = (user.progress && typeof user.progress.experience === 'number') ? user.progress.experience : (user.points || 0);
        const streak = user.streak || 1;
        const modules = typeof user.completedModules === 'number'
          ? user.completedModules
          : (Array.isArray(user.progress?.algorithms) ? user.progress.algorithms.filter(a => a.completed).length : 0);
        const lastActiveDate = user.lastActive ? new Date(user.lastActive).toLocaleString() : 'Recently';

        console.log(`Learner #${index + 1}:`);
        console.log(` - ID: ${user._id}`);
        console.log(` - Name: ${name}`);
        console.log(` - Email: ${user.email}`);
        console.log(` - Role: ${user.role || 'student'}`);
        console.log(` - XP / Points: ${xp} XP (${user.points || 0} pts)`);
        console.log(` - Current Streak: 🔥 ${streak} day(s)`);
        console.log(` - Completed Modules: ${modules}`);
        console.log(` - Last Active: 🕒 ${lastActiveDate}`);
        console.log(`-------------------------------------------------------`);
      });
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Error connecting to MongoDB or fetching users:', err.message);
    process.exit(1);
  }
}

fetchAndListActiveUsers();