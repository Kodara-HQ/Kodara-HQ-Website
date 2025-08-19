const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { getPool, sql } = require('./pool');

async function seedProjects(pool) {
  const projects = [
    {
      title: 'Restaurant Hub - Odumase',
      description: 'Food delivery platform connecting local restaurants with customers in Odumase, Ghana. Features restaurant discovery, menu browsing, and online ordering.',
      imageURL: '/image/logo-Restaurant Hub.png',
      link: 'https://restaurant-35yk.onrender.com/'
    },
    {
      title: 'Sunyani Fashion Hub',
      description: 'Fashion designer marketplace showcasing local talent in Sunyani. Connect with designers, book consultations, and explore custom fashion collections.',
      imageURL: '/image/fashion.avif',
      link: 'https://uenr-fashion.onrender.com/'
    },
    {
      title: 'UENR Student Hostel Booking',
      description: 'Student accommodation booking platform for University of Energy and Natural Resources. Browse hostels, compare prices, and book rooms online.',
      imageURL: '/image/UENR.png',
      link: 'https://hostel-eao2.onrender.com/'
    },
    {
      title: 'Kodara‑HQ Website',
      description: 'Our corporate site that powers marketing, inquiries, and project intake with Stripe deposits.',
      imageURL: '/image/Kodara logo1.png',
      link: '/'
    }
  ];

  for (const p of projects) {
    const request = pool.request();
    request.input('title', sql.NVarChar(255), p.title);
    request.input('description', sql.NVarChar(sql.MAX), p.description);
    request.input('imageURL', sql.NVarChar(1024), p.imageURL);
    request.input('link', sql.NVarChar(1024), p.link);
    // Proper upsert: update if exists, else insert
    await request.query(`
      IF EXISTS (SELECT 1 FROM Projects WHERE title = @title)
      BEGIN
        UPDATE Projects
        SET description = @description,
            imageURL = @imageURL,
            link = @link
        WHERE title = @title;
      END
      ELSE
      BEGIN
        INSERT INTO Projects (title, description, imageURL, link)
        VALUES (@title, @description, @imageURL, @link);
      END
    `);
  }
}

async function seedTestimonials(pool) {
  const testimonials = [
    { clientName: 'Amanda Reed, CTO, NovaByte', feedback: 'Delivered ahead of schedule with excellent code quality and documentation.', rating: 5 },
    { clientName: 'Daniel Mensah, Ops Manager, SwiftRetail', feedback: 'Inventory accuracy improved by 35% and dashboards save hours weekly.', rating: 5 },
    { clientName: 'Priya Shah, Product Lead, HealthHub', feedback: 'Reliable, scalable backend and a smooth user experience for clinicians.', rating: 5 }
  ];

  for (const t of testimonials) {
    const request = pool.request();
    request.input('clientName', sql.NVarChar(255), t.clientName);
    request.input('feedback', sql.NVarChar(sql.MAX), t.feedback);
    request.input('rating', sql.Int, t.rating);
    await request.query(`
      IF NOT EXISTS (
        SELECT 1 FROM Testimonials WHERE clientName = @clientName AND feedback = @feedback
      )
      BEGIN
        INSERT INTO Testimonials (clientName, feedback, rating)
        VALUES (@clientName, @feedback, @rating)
      END
    `);
  }
}

async function main() {
  const pool = await getPool();
  // Ensure at least one admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kodara-hq.local';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(adminPassword, 10);
  await pool.request()
    .input('name', sql.NVarChar(255), 'Administrator')
    .input('email', sql.NVarChar(255), adminEmail)
    .input('password', sql.NVarChar(255), hash)
    .input('role', sql.NVarChar(50), 'admin')
    .query(`
      IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @email)
      BEGIN
        INSERT INTO Users (name, email, password, role)
        VALUES (@name, @email, @password, @role)
      END
    `);

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


