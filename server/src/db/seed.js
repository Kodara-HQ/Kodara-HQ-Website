const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { getPool } = require('./pool');

async function seedProjects(pool) {
  const projects = [
    {
      title: 'Sunyani Fashion Hub Platform',
      description: 'Kodara-HQ built a community platform connecting local designers with clients in Sunyani, Ghana — directory, booking, and profiles included.',
      imageURL: '/image/fashion.avif',
      link: 'https://uenr-fashion.onrender.com/'
    },
    {
      title: 'Restaurant Hub - Odumase',
      description: 'Discover and order from the best local restaurants in Odumase with an intuitive web app.',
      imageURL: '/image/logo-Restaurant Hub.png',
      link: 'https://restaurant-35yk.onrender.com/'
    },
    {
      title: 'Kodara‑HQ Website',
      description: 'Our corporate site that powers marketing, inquiries, and project intake with Stripe deposits.',
      imageURL: '/image/Kodara logo1.png',
      link: '/'
    }
  ];

  for (const p of projects) {
    // Proper upsert: update if exists, else insert
    await pool.query(`
      INSERT INTO Projects (title, description, imageURL, link)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (title) 
      DO UPDATE SET 
        description = EXCLUDED.description,
        imageURL = EXCLUDED.imageURL,
        link = EXCLUDED.link
    `, [p.title, p.description, p.imageURL, p.link]);
  }
}

async function seedTestimonials(pool) {
  const testimonials = [
    { clientName: 'Amanda Reed, CTO, NovaByte', feedback: 'Delivered ahead of schedule with excellent code quality and documentation.', rating: 5 },
    { clientName: 'Daniel Mensah, Ops Manager, SwiftRetail', feedback: 'Inventory accuracy improved by 35% and dashboards save hours weekly.', rating: 5 },
    { clientName: 'Priya Shah, Product Lead, HealthHub', feedback: 'Reliable, scalable backend and a smooth user experience for clinicians.', rating: 5 }
  ];

  for (const t of testimonials) {
    await pool.query(`
      INSERT INTO Testimonials (clientName, feedback, rating)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [t.clientName, t.feedback, t.rating]);
  }
}

async function main() {
  const pool = await getPool();
  // Ensure at least one admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kodara-hq.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(adminPassword, 10);
  
  await pool.query(`
    INSERT INTO Users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, ['Administrator', adminEmail, hash, 'admin']);

  await seedProjects(pool);
  await seedTestimonials(pool);
  // eslint-disable-next-line no-console
  console.log('Seed data inserted.');
  process.exit(0);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to seed data:', err);
  process.exit(1);
});


