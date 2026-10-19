import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Session } from './models/Session';
import { Resource } from './models/Resource';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Session.deleteMany({});
    await Resource.deleteMany({});
    console.log('[Seed] Cleared existing Users, Sessions, and Resources.');

    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // 1. Create Seed Users
    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@skillswap.edu',
      passwordHash,
      skillsOffered: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      skillsWanted: ['Python', 'Machine Learning', 'Docker'],
      bio: 'Frontend architecture fan & React developer. Excited to exchange React tips for Python lessons!',
      education: 'B.S. Computer Science - Year 3',
      points: 120,
    });

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@skillswap.edu',
      passwordHash,
      skillsOffered: ['Python', 'Machine Learning', 'Docker', 'FastAPI'],
      skillsWanted: ['React', 'TypeScript', 'Tailwind CSS'],
      bio: 'Backend & ML student building intelligent apps. Want to polish my frontend skills.',
      education: 'M.S. Data Science - Year 1',
      points: 150,
    });

    const charlie = await User.create({
      name: 'Charlie Davis',
      email: 'charlie@skillswap.edu',
      passwordHash,
      skillsOffered: ['UI Design', 'Figma', 'CSS', 'HTML'],
      skillsWanted: ['Node.js', 'Express', 'MongoDB', 'React'],
      bio: 'UI/UX designer transitioning to full-stack engineering. Love clean, responsive design.',
      education: 'B.A. Digital Media - Year 4',
      points: 80,
    });

    console.log(`[Seed] Created 3 seed users:
    - Alice: alice@skillswap.edu (Pass: password123)
    - Bob:   bob@skillswap.edu   (Pass: password123)
    - Charlie: charlie@skillswap.edu (Pass: password123)`);

    // 2. Create Sample Resources
    const resource1 = await Resource.create({
      userId: alice._id,
      title: 'React 18 & TypeScript Masterclass Cheatsheet',
      description: 'Comprehensive guide covering custom hooks, generic components, and state management patterns.',
      link: 'https://react.dev',
      tags: ['React', 'TypeScript', 'Frontend'],
    });

    const resource2 = await Resource.create({
      userId: bob._id,
      title: 'Python Data Science & ML Primer',
      description: 'Step-by-step tutorial on NumPy, Pandas, and Scikit-Learn for beginners.',
      link: 'https://scikit-learn.org',
      tags: ['Python', 'Machine Learning', 'Data Science'],
    });

    const resource3 = await Resource.create({
      userId: charlie._id,
      title: 'Modern UI/UX Design System Guide in Figma',
      description: 'Free Figma tokens, layout grids, and color harmony palettes for web apps.',
      link: 'https://figma.com',
      tags: ['UI Design', 'Figma', 'CSS'],
    });

    console.log('[Seed] Created 3 sample resources.');

    // 3. Create Sample Completed & Requested Sessions
    await Session.create({
      requesterId: alice._id,
      recipientId: bob._id,
      status: 'completed',
      scheduledTime: new Date(Date.now() - 86400000 * 2), // 2 days ago
      meetingLink: 'https://meet.jit.si/skillswap-alice-bob-react-python',
    });

    await Session.create({
      requesterId: bob._id,
      recipientId: charlie._id,
      status: 'confirmed',
      scheduledTime: new Date(Date.now() + 86400000 * 1), // tomorrow
      meetingLink: 'https://meet.jit.si/skillswap-bob-charlie-design',
    });

    await Session.create({
      requesterId: charlie._id,
      recipientId: alice._id,
      status: 'requested',
      scheduledTime: new Date(Date.now() + 86400000 * 3), // in 3 days
      meetingLink: 'https://meet.jit.si/skillswap-charlie-alice-node',
    });

    console.log('[Seed] Created sample sessions (1 completed, 1 confirmed, 1 requested).');
    console.log('✅ Database seeded successfully!');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
