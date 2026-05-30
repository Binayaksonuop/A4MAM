require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Gallery = require('../models/Gallery');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Admin
    await Admin.deleteMany();
    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@a4mam.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@2026',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // 2. Seed Products
    await Product.deleteMany();
    const products = await Product.create([
      {
        name: 'Chicky Bars',
        slug: 'chicky-bars',
        description: 'A nutritious and delicious snack packed with the power of Spirulina. Specifically designed for children to fight malnutrition.',
        price: 99,
        originalPrice: 149,
        category: 'kids',
        stock: 500,
        status: 'Active',
        imageUrl: 'assets/images/chicky_s.png',
        isFeatured: true,
        subtitle: 'Spirulina Nutrition Bar for Kids',
        badge: 'Kids Favourite',
        benefits: ['12g protein per bar — supports daily growth needs.', 'Great taste kids love — no algae smell or flavor.', 'Quick energy for active, growing kids.'],
        includes: ['Pack of 15 Chicky Bars'],
        nutrition: { protein: 65, iron: 45, absorption: 95 }
      },
      {
        name: 'Spirulina Capsules',
        slug: 'capsules',
        description: '100% Pure Pharmaceutical grade Spirulina in easy-to-consume capsules.',
        price: 649,
        originalPrice: 799,
        category: 'maternal',
        stock: 100,
        status: 'Active',
        imageUrl: 'assets/images/Spirulia Capsule.jpg',
        isFeatured: true,
        subtitle: 'Daily Immunity & Energy Support',
        badge: 'Daily Use',
        benefits: ['No preparation needed — one capsule a day.', 'Precise daily dose of Iron, Protein, and B-Vitamins.', 'Boosts immunity and reduces chronic fatigue.'],
        includes: ['90x Spirulina Capsules (500mg each)', '1x Daily Dosage Reference Card'],
        nutrition: { protein: 60, iron: 90, absorption: 95 }
      },
      {
        name: 'Child Nutrition Kit',
        slug: 'child-kit',
        description: 'A comprehensive 30-day nutrition kit for moderate acute malnutrition recovery.',
        price: 1299,
        originalPrice: 1599,
        category: 'kit',
        stock: 50,
        status: 'Active',
        imageUrl: 'assets/images/Child Nutrition Kit.jpg',
        isFeatured: true,
        subtitle: '30-Day Complete Recovery Plan',
        badge: 'Bestseller',
        benefits: ['Supports healthy weight gain and growth in children.', 'Provides Iron, Protein, and Vitamins essential for brain development.', 'Easy daily pre-dosed packets — no preparation needed.'],
        includes: ['30x Spirulina Chicky Bars (Protein + Iron)', '1x Caregiver Progress Tracker Diary', '1x Bio-fortified Multivitamin Drops'],
        nutrition: { protein: 85, iron: 92, absorption: 95 }
      },
      {
        name: 'Maternal Health Kit',
        slug: 'maternal-kit',
        description: 'A targeted nutrition kit for pregnant and lactating mothers.',
        price: 1599,
        originalPrice: 1999,
        category: 'kit',
        stock: 30,
        status: 'Active',
        imageUrl: 'assets/images/Maternal Health Kit.jpg',
        isFeatured: true,
        subtitle: 'Pregnancy & Lactation Support',
        badge: 'Essential',
        benefits: ['Helps prevent iron-deficiency anemia during pregnancy.', 'Supports healthy milk production for lactating mothers.', 'Reduces the risk of low birth weight in newborns.'],
        includes: ['60x Pure Spirulina Prenatal Capsules', '1x Maternal Diet Chart (Local Cuisine)', '1x Iron & Folic Acid Booster Pack'],
        nutrition: { protein: 70, iron: 98, absorption: 90 }
      },
      {
        name: 'Pure Spirulina Powder',
        slug: 'powder',
        description: '100% Pure Organic Spirulina Powder.',
        price: 799,
        originalPrice: 999,
        category: 'powder',
        stock: 200,
        status: 'Active',
        imageUrl: 'assets/images/spirulina_s.png',
        isFeatured: true,
        subtitle: '100% Pure Organic Spirulina',
        badge: 'Pure',
        benefits: ['65% complete plant protein with all essential amino acids.', 'Rich in Vitamin B12 and highly bioavailable Iron.', 'No artificial additives, colors, or preservatives.'],
        includes: ['250g Pure Spirulina Powder Jar', 'Measuring Spoon'],
        nutrition: { protein: 95, iron: 88, absorption: 92 }
      },
      {
        name: 'Nutrition Outreach Kit',
        slug: 'outreach-kit',
        description: 'A comprehensive nutritional response kit designed for clinical outreach. Contains fortified Spirulina supplements, high-protein energy bars, and diagnostic tracking tools for field healthcare workers.',
        price: 2500,
        originalPrice: 3000,
        category: 'kit',
        stock: 15,
        status: 'Active',
        imageUrl: 'assets/images/outreach_kit_s.png',
        isFeatured: true,
        subtitle: 'Institutional Intervention Supply',
        badge: 'B2B / NGO',
        benefits: ['Designed for high-impact moderate acute malnutrition (MAM) recovery.', 'Supports 50+ children per kit for initial intervention.', 'Includes field-tested diagnostic MUAC tapes and tracking logs.'],
        includes: ['100x Fortified Spirulina Sachet Units', '25x High-Density Chicky Bars', '10x Field Diagnostic Kits', 'Institutional Logistics Support'],
        nutrition: { protein: 90, iron: 95, absorption: 98 }
      }
    ]);
    console.log(`✅ ${products.length} products created`);

    // 3. Seed Gallery
    await Gallery.deleteMany();
    const gallery = await Gallery.create([
      { title: 'Community Outreach', url: 'assets/images/gallery/WhatsApp Image 2026-04-04 at 12.19.25 PM.jpeg', location: 'Odisha', category: 'Outreach', description: 'Village-level monitoring and care.' },
      { title: 'Nutrition Assessment', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.39 PM (1).jpeg', location: 'Odisha', category: 'Field Data', description: 'Monitoring child growth metrics.' },
      { title: 'Field Monitoring', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.40 PM (1).jpeg', location: 'Odisha', category: 'Field Data', description: 'Data collection in rural blocks.' },
      { title: 'Child Health Screening', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.41 PM (1).jpeg', location: 'Odisha', category: 'Field Data', description: 'Clinical assessment in rural communities.' },
      { title: 'Spirulina Distribution', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.46 PM (3).jpeg', location: 'Odisha', category: 'Intervention', description: 'Distributing fortified nutrition.' },
      { title: 'Nutrition Kit Distribution', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.53 PM (2).jpeg', location: 'Odisha', category: 'Intervention', description: 'Providing monthly intervention packs.' },
      { title: 'Mission Monitoring', url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.56 PM (2).jpeg', location: 'Odisha', category: 'Outreach', description: 'Direct community engagement.' },
      { title: 'Healthcare Support', url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.02.44 PM.jpeg', location: 'Odisha', category: 'Field Data', description: 'Providing medical assistance.' },
      { title: 'Maternal Care', url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.04.46 PM (1).jpeg', location: 'Odisha', category: 'Field Data', description: 'Supporting mother health.' },
      { title: 'Child Nutrition Drive', url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.08.53 PM.jpeg', location: 'Odisha', category: 'Intervention', description: 'Scaling nutritional impact.' },
      { title: 'Village Health Camp', url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.12.47 PM.jpeg', location: 'Odisha', category: 'Outreach', description: 'Mobile health unit in action.' },
      { title: 'Impact Documentation', url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.14.40 PM (2).jpeg', location: 'Odisha', category: 'Impact', description: 'Documenting the mission success.' },
      { title: 'MAM Field Asset 1', url: 'assets/images/gallery/mam_gallery_1.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 2', url: 'assets/images/gallery/mam_gallery_2.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 3', url: 'assets/images/gallery/mam_gallery_3.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 4', url: 'assets/images/gallery/mam_gallery_4.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 5', url: 'assets/images/gallery/mam_gallery_5.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 6', url: 'assets/images/gallery/mam_gallery_6.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 7', url: 'assets/images/gallery/mam_gallery_7.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 8', url: 'assets/images/gallery/mam_gallery_8.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 9', url: 'assets/images/gallery/mam_gallery_9.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 10', url: 'assets/images/gallery/mam_gallery_10.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' },
      { title: 'MAM Field Asset 11', url: 'assets/images/gallery/mam_gallery_11.jpg', location: 'Odisha', category: 'Field Data', description: 'Visual data from the mission field.' }
    ]);
    console.log(`✅ ${gallery.length} gallery images created`);

    console.log('🌟 Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
