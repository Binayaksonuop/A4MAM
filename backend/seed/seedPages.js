require('dotenv').config();
const mongoose = require('mongoose');
const Page = require('../models/Page');
const connectDB = require('../config/db');

const seedHomePage = async () => {
  await connectDB();
  console.log('Connected to DB');

  const homePageData = {
    slug: 'home',
    title: 'Home Page',
    status: 'Published',
    seo: {
      metaTitle: 'MAM - Mission Against Malnutrition',
      metaDescription: 'Using Spirulina superfoods to fight malnutrition and heal children in India.',
      canonicalUrl: 'https://a4mam.com'
    },
    hero: {
      titleLine1: 'Fighting',
      titleLine2: 'Malnutrition',
      titleLine3: 'with Spirulina',
      body: 'Driven by impact and accountability, we work relentlessly to ensure sustainable nutrition and healthier futures for every child.',
      image: 'assets/images/hero_s.png',
      ctaButtons: [
        { label: 'Sponsor a Child', link: '/donate', style: 'primary' },
        { label: 'Explore the Science', link: '/about', style: 'outline' }
      ],
      statistics: [
        { label: 'Children Saved', value: '1,500+' },
        { label: 'Vitamins', value: '14+' },
        { label: 'Minerals', value: '11+' }
      ]
    },
    impactCounters: [
      { label: 'Children Supported', value: 1500, icon: 'bi-people', isAutoCalculated: false, calculationSource: 'none' },
      { label: 'Nutrition Improvement (%)', value: 92, icon: 'bi-graph-up-arrow', isAutoCalculated: false, calculationSource: 'none' },
      { label: 'Communities Reached', value: 45, icon: 'bi-globe-central-south-asia', isAutoCalculated: false, calculationSource: 'none' }
    ],
    missionContent: {
      title: 'The Biological Crusade',
      body: '<p>A4MAM is not just a charity; it is a bio-intervention strategy targeting the cellular foundation of human life.</p>',
      imageUrl: 'assets/images/Spirulia Capsule.jpg'
    },
    ngoStatistics: [
      { label: '85%', value: '85%', description: 'Protein Density' },
      { label: '95%', value: '95%', description: 'Absorption Rate' },
      { label: '70%', value: '70%', description: 'Micronutrient Level' }
    ]
  };

  try {
    const existing = await Page.findOne({ slug: 'home' });
    if (existing) {
      Object.assign(existing, homePageData);
      await existing.save();
      console.log('Homepage updated successfully');
    } else {
      await Page.create(homePageData);
      console.log('Homepage created successfully');
    }
  } catch (error) {
    console.error('Failed to seed homepage:', error);
  } finally {
    process.exit(0);
  }
};

seedHomePage();
