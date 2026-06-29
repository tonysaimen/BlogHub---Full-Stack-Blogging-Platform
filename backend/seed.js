import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';

// Load environment variables
dotenv.config();

const usersData = [
  {
    name: 'Alex Rivers',
    email: 'alex@bloghub.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@bloghub.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@bloghub.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus',
  },
  {
    name: 'Elena Rostova',
    email: 'elena@bloghub.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
  },
  {
    name: 'David Kim',
    email: 'david@bloghub.com',
    password: 'password123',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
  },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log('Database connected successfully.');

    // Clear existing collection records
    console.log('Cleaning up existing database records...');
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});
    console.log('Cleaned up collections.');

    // Create 5 test users (pre-save hook will hash passwords)
    console.log('Creating 5 test users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log('Successfully created test users!');

    const [alex, sarah, marcus, elena, david] = createdUsers;

    const postsData = [
      {
        title: 'Mastering React Server Components & Next.js',
        content: `React Server Components (RSC) represent a paradigm shift in how we build React applications. By rendering components on the server, we can reduce the bundle size sent to the client, improve performance, and query databases directly from our rendering logic.<br/><br/><h3>Why React Server Components?</h3><ul><li><strong>Zero client-side bundle size:</strong> Components that only run on the server don't add to the JavaScript load.</li><li><strong>Direct backend access:</strong> Retrieve databases and connect to microservices inside component code.</li><li><strong>Seamless UX:</strong> Combine with client components for interactive segments.</li></ul>`,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        category: 'Technology',
        tags: ['react', 'nextjs', 'webdev'],
        author: alex._id,
        likes: [sarah._id, marcus._id, david._id],
      },
      {
        title: 'Designing Beautiful High-Conversion Landing Pages',
        content: `Design is not just what it looks like; it is how it works. A landing page's main objective is to convert traffic into leads or signups. Today, we will inspect visual hierarchy, typography, HSL color harmony, and micro-interactions that increase user confidence.<br/><br/>Focusing on readability, layout spacing, and clear action callouts makes landing pages feel premium.`,
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        category: 'Design',
        tags: ['design', 'uiux', 'landingpage'],
        author: sarah._id,
        likes: [alex._id, elena._id],
      },
      {
        title: 'Scaling Node.js Express Endpoints for Production',
        content: `Building APIs is easy; scaling them is another story. When your express server receives thousands of concurrent requests, database connections, route loops, and synchronous blocks can slow it down. We'll explore cluster scaling, PM2 process management, Redis data caching, and DB connection pooling options to optimize request roundtrips.`,
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        category: 'Business',
        tags: ['nodejs', 'express', 'scaling'],
        author: marcus._id,
        likes: [alex._id, sarah._id, david._id],
      },
      {
        title: '10 Wellness & Focus Hacks for Remote Software Engineers',
        content: `Remote software engineering brings massive flexibility, but it can also blur work-life boundaries. Sitting for long periods, staring at monitors, and solving complex bugs can lead to burnout. Here are 10 wellness routines, active walking schedules, blue light considerations, and ergonomics hacks to keep your mind sharp and body healthy.`,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
        category: 'Health',
        tags: ['health', 'remote', 'wellness'],
        author: elena._id,
        likes: [marcus._id, sarah._id],
      },
      {
        title: 'A Culinary Journey Through Tokyo: Best Ramen & Sushi Stops',
        content: `Tokyo is a food lover's paradise. From small, smoky alleys (Yokocho) to high-end Michelin starred dining spots, the dedication of Japanese chefs to their craft is unmatched. In this article, I share my experience exploring top-tier sushi stands and tasting thick tonkotsu ramen broths. If you plan a trip, save these addresses!`,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        category: 'Food',
        tags: ['tokyo', 'travel', 'food'],
        author: david._id,
        likes: [alex._id, elena._id, sarah._id],
      },
    ];

    console.log('Seeding blog posts...');
    const createdPosts = [];
    for (const p of postsData) {
      const post = new Post(p);
      await post.save();
      createdPosts.push(post);
    }
    console.log('Seeded blog posts.');

    const [post1, post2, post3, post4, post5] = createdPosts;

    const commentsData = [
      {
        content: 'This explains Next.js server components so clearly. The zero-bundle layout is a game changer!',
        user: sarah._id,
        post: post1._id,
      },
      {
        content: 'Great post, Alex! Do you recommend any databases to pair with RSC?',
        user: david._id,
        post: post1._id,
      },
      {
        content: 'Absolutely! Pairing server components directly with Mongoose queries is incredibly clean.',
        user: alex._id,
        post: post1._id,
      },
      {
        content: 'Visual hierarchy is often ignored. These examples of HSL colors are brilliant!',
        user: elena._id,
        post: post2._id,
      },
      {
        content: 'Have you used Redis caching for Express sessions as well? Excellent scaling tips.',
        user: alex._id,
        post: post3._id,
      },
      {
        content: 'Taking regular active breaks changed my programming focus entirely. Great tips, Elena.',
        user: marcus._id,
        post: post4._id,
      },
      {
        content: 'That tonkotsu ramen place is amazing, David. Visited it last year!',
        user: sarah._id,
        post: post5._id,
      },
    ];

    console.log('Seeding comments...');
    for (const c of commentsData) {
      const comment = new Comment(c);
      await comment.save();
    }
    console.log('Seeded comments.');

    console.log('\n=========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('Created accounts to test:');
    createdUsers.forEach((u) => {
      console.log(`- Name: ${u.name} | Email: ${u.email} | Password: password123`);
    });
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
