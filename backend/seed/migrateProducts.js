require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const richData = {
  'child-kit': {
    subtitle: '30-Day Complete Recovery Plan',
    badge: 'Bestseller',
    benefits: [
      'Supports healthy weight gain and growth in children.',
      'Provides Iron, Protein, and Vitamins essential for brain development.',
      'Easy daily pre-dosed packets — no preparation needed.'
    ],
    includes: [
      '30x Spirulina Chicky Bars (Protein + Iron)',
      '1x Caregiver Progress Tracker Diary',
      '1x Bio-fortified Multivitamin Drops'
    ],
    nutrition: { protein: 85, iron: 92, absorption: 95 }
  },
  'maternal-kit': {
    subtitle: 'Pregnancy & Lactation Support',
    badge: 'Essential',
    benefits: [
      'Helps prevent iron-deficiency anemia during pregnancy.',
      'Supports healthy milk production for lactating mothers.',
      'Reduces the risk of low birth weight in newborns.'
    ],
    includes: [
      '60x Pure Spirulina Prenatal Capsules',
      '1x Maternal Diet Chart (Local Cuisine)',
      '1x Iron & Folic Acid Booster Pack'
    ],
    nutrition: { protein: 70, iron: 98, absorption: 90 }
  },
  'chicky-bars': {
    subtitle: 'Spirulina Nutrition Bar for Kids',
    badge: 'Kids Favourite',
    benefits: [
      '12g protein per bar — supports daily growth needs.',
      'Great taste kids love — no algae smell or flavor.',
      'Quick energy for active, growing kids.'
    ],
    includes: [
      'Pack of 15 Chicky Bars'
    ],
    nutrition: { protein: 65, iron: 45, absorption: 95 }
  },
  'powder': {
    subtitle: '100% Pure Organic Spirulina',
    badge: 'Pure',
    benefits: [
      '65% complete plant protein with all essential amino acids.',
      'Rich in Vitamin B12 and highly bioavailable Iron.',
      'No artificial additives, colors, or preservatives.'
    ],
    includes: [
      '250g Pure Spirulina Powder Jar',
      'Measuring Spoon'
    ],
    nutrition: { protein: 95, iron: 88, absorption: 92 }
  },
  'capsules': {
    subtitle: 'Daily Immunity & Energy Support',
    badge: 'Daily Use',
    benefits: [
      'No preparation needed — one capsule a day.',
      'Precise daily dose of Iron, Protein, and B-Vitamins.',
      'Boosts immunity and reduces chronic fatigue.'
    ],
    includes: [
      '90x Spirulina Capsules (500mg each)',
      '1x Daily Dosage Reference Card'
    ],
    nutrition: { protein: 60, iron: 90, absorption: 95 }
  },
  'outreach-kit': {
    subtitle: 'Institutional Intervention Supply',
    badge: 'B2B / NGO',
    benefits: [
      'Designed for high-impact moderate acute malnutrition (MAM) recovery.',
      'Supports 50+ children per kit for initial intervention.',
      'Includes field-tested diagnostic MUAC tapes and tracking logs.'
    ],
    includes: [
      '100x Fortified Spirulina Sachet Units',
      '25x High-Density Chicky Bars',
      '10x Field Diagnostic Kits',
      'Institutional Logistics Support'
    ],
    nutrition: { protein: 90, iron: 95, absorption: 98 }
  }
};

async function migrateProducts() {
  await connectDB();
  console.log('Connected to DB');

  try {
    const products = await Product.find();
    for (let product of products) {
      const slug = product.slug;
      if (richData[slug]) {
        Object.assign(product, richData[slug]);
        await product.save();
        console.log(`Migrated ${slug}`);
      } else {
        console.log(`No rich data found for ${slug}`);
      }
    }
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrateProducts();
