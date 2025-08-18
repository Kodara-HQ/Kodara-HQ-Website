const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');
const { requireAuth, requireRole } = require('../middleware/auth');
const upload = require('../upload');
const projectController = require('../controllers/projectController');
const testimonialsController = require('../controllers/testimonialsController');
const subscribeController = require('../controllers/subscribeController');
const healthController = require('../controllers/healthController');
const paymentsController = require('../controllers/paymentsController');
const paymentsWebhook = require('../controllers/paymentsWebhook');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/contact', upload.single('attachment'), contactController.handleContact);
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/forgot', authController.forgotPassword);
router.post('/auth/reset', authController.resetPassword);
router.get('/projects', projectController.getProjects);
// Example protected admin route (read-only listing, can expand for CRUD later)
// Admin routes are now open (no auth) per request
router.get('/admin/projects', projectController.getProjects);
router.post('/admin/projects', projectController.createProject);
router.put('/admin/projects/:id', projectController.updateProject);
router.delete('/admin/projects/:id', projectController.deleteProject);
// Admin: read-only lists for contacts, subscriptions, payments
router.get('/admin/contacts', adminController.listContacts);
router.get('/admin/subscriptions', adminController.listSubscriptions);
router.get('/admin/payments', adminController.listPayments);
router.get('/testimonials', testimonialsController.getTestimonials);
router.post('/subscribe', subscribeController.handleSubscribe);
router.get('/health/email', healthController.checkEmailHealth);
router.post('/health/email/test', healthController.sendTestEmail);
router.post('/payments/create-intent', paymentsController.createPaymentIntent);
router.get('/payments/config', paymentsController.getPublicConfig);
// Note: webhook route must use raw body; registered in server.js
router.post('/payments/webhook', paymentsWebhook.handleStripeWebhook);

module.exports = router;


