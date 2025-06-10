/**
 * Database Management Tools
 * 
 * This script provides utilities for managing the MongoDB database
 * Run with: node db-tools.js [command]
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Import models
require('./lib/models/Property');
const Property = mongoose.model('Property');

// Connect to MongoDB
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Display database stats
async function showStats() {
  try {
    await connectDB();
    
    const propertyCount = await Property.countDocuments();
    const activeCount = await Property.countDocuments({ status: 'active' });
    const pendingCount = await Property.countDocuments({ status: 'pending' });
    const soldCount = await Property.countDocuments({ status: 'sold' });
    
    console.log('\nDatabase Statistics:');
    console.log('-------------------');
    console.log(`Total Properties: ${propertyCount}`);
    console.log(`Active Properties: ${activeCount}`);
    console.log(`Pending Properties: ${pendingCount}`);
    console.log(`Sold Properties: ${soldCount}`);
    
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Export database to JSON file
async function exportDB() {
  try {
    await connectDB();
    
    const properties = await Property.find({});
    
    if (!fs.existsSync('./backups')) {
      fs.mkdirSync('./backups');
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filePath = path.join('./backups', `properties_${timestamp}.json`);
    
    fs.writeFileSync(filePath, JSON.stringify(properties, null, 2));
    
    console.log(`\nDatabase exported successfully to ${filePath}`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Import database from JSON file
async function importDB(filePath) {
  try {
    if (!filePath) {
      console.error('Please provide a file path to import from');
      return;
    }
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }
    
    await connectDB();
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format. Expected an array of properties.');
      return;
    }
    
    // Clear existing data
    await Property.deleteMany({});
    
    // Import new data
    await Property.insertMany(data);
    
    console.log(`\nImported ${data.length} properties successfully`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Reset database (clear all properties)
async function resetDB() {
  try {
    await connectDB();
    
    const result = await Property.deleteMany({});
    
    console.log(`\nDatabase reset: ${result.deletedCount} properties removed`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Add sample data
async function addSampleData() {
  try {
    await connectDB();
    
    const sampleProperties = [
      {
        title: 'Modern Apartment in Downtown',
        description: 'A beautiful modern apartment in the heart of downtown with amazing views.',
        location: 'Downtown',
        type: 'apartment',
        transaction: 'sale',
        price: 350000,
        area: 120,
        bedrooms: 2,
        bathrooms: 2,
        features: ['parking', 'elevator', 'security'],
        images: [],
        agent: {
          name: 'John Doe',
          phone: '123-456-7890',
          email: 'john@example.com'
        },
        status: 'active',
        views: 0,
        inquiries: 0
      },
      {
        title: 'Spacious Family House with Garden',
        description: 'Perfect family house with a large garden in a quiet neighborhood.',
        location: 'Suburbs',
        type: 'house',
        transaction: 'sale',
        price: 550000,
        area: 220,
        bedrooms: 4,
        bathrooms: 3,
        features: ['parking', 'garden', 'pool', 'security'],
        images: [],
        agent: {
          name: 'Jane Smith',
          phone: '098-765-4321',
          email: 'jane@example.com'
        },
        status: 'active',
        views: 0,
        inquiries: 0
      },
      {
        title: 'Cozy Studio for Rent',
        description: 'Cozy studio apartment perfect for students or young professionals.',
        location: 'University District',
        type: 'studio',
        transaction: 'rent',
        price: 800,
        area: 45,
        bedrooms: 0,
        bathrooms: 1,
        features: ['furnished', 'internet'],
        images: [],
        agent: {
          name: 'John Doe',
          phone: '123-456-7890',
          email: 'john@example.com'
        },
        status: 'active',
        views: 0,
        inquiries: 0
      },
      {
        title: 'Luxury Penthouse with Terrace',
        description: 'Stunning penthouse with a large terrace and panoramic city views.',
        location: 'City Center',
        type: 'penthouse',
        transaction: 'sale',
        price: 1200000,
        area: 200,
        bedrooms: 3,
        bathrooms: 3,
        features: ['parking', 'elevator', 'security', 'terrace', 'view'],
        images: [],
        agent: {
          name: 'Jane Smith',
          phone: '098-765-4321',
          email: 'jane@example.com'
        },
        status: 'pending',
        views: 0,
        inquiries: 0
      },
      {
        title: 'Commercial Space for Rent',
        description: 'Prime commercial space perfect for retail or office use.',
        location: 'Business District',
        type: 'commercial',
        transaction: 'rent',
        price: 3500,
        area: 150,
        bedrooms: 0,
        bathrooms: 1,
        features: ['parking', 'security'],
        images: [],
        agent: {
          name: 'John Doe',
          phone: '123-456-7890',
          email: 'john@example.com'
        },
        status: 'active',
        views: 0,
        inquiries: 0
      }
    ];
    
    await Property.insertMany(sampleProperties);
    
    console.log(`\nAdded ${sampleProperties.length} sample properties to the database`);
    mongoose.disconnect();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Display help
function showHelp() {
  console.log('\nDatabase Management Tools');
  console.log('=======================');
  console.log('Available commands:');
  console.log('  stats       - Show database statistics');
  console.log('  export      - Export database to JSON file');
  console.log('  import [file] - Import database from JSON file');
  console.log('  reset       - Reset database (remove all properties)');
  console.log('  sample      - Add sample data to database');
  console.log('  help        - Show this help message');
}

// Main function
async function main() {
  const command = process.argv[2];
  const param = process.argv[3];
  
  if (!command || command === 'help') {
    showHelp();
    return;
  }
  
  switch (command) {
    case 'stats':
      await showStats();
      break;
    case 'export':
      await exportDB();
      break;
    case 'import':
      await importDB(param);
      break;
    case 'reset':
      const confirmation = process.argv[3] === '--confirm';
      if (!confirmation) {
        console.log('\nWARNING: This will delete all properties in the database.');
        console.log('To confirm, run: node db-tools.js reset --confirm');
      } else {
        await resetDB();
      }
      break;
    case 'sample':
      await addSampleData();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      showHelp();
  }
}

// Run the main function
main();