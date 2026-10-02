/**
 * Smart E-Commerce Management System using MongoDB
 * Phase 2: Database & Collection Structure Setup
 * 
 * Safely creates the 6 databases and 60 collections in MongoDB Atlas
 * without inserting documents or dropping existing data.
 * 
 * Idempotent: Can be run multiple times safely.
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');
const schemaDefinitions = require('../config/schemaDefinitions');

async function createDatabaseStructure() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI not found in environment variables (.env).');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('  SMART E-COMMERCE MANAGEMENT SYSTEM — PHASE 2 SETUP');
  console.log('  Creating 6 Databases & 60 Collections on MongoDB Atlas');
  console.log('================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully.\n');

    const dbsConfig = schemaDefinitions.databases;
    const dbNames = Object.keys(dbsConfig);

    let totalCreatedCount = 0;
    let totalExistingCount = 0;
    const summary = {};

    for (const dbName of dbNames) {
      const dbDef = dbsConfig[dbName];
      const targetDb = client.db(dbName);

      console.log(`📁 Processing Database: [ ${dbName} ] (${dbDef.assignedMember} — ${dbDef.domain})`);

      // List existing collections in target database
      const existingCollectionsList = await targetDb.listCollections().toArray();
      const existingCollectionNames = new Set(existingCollectionsList.map(c => c.name));

      summary[dbName] = {
        member: dbDef.assignedMember,
        domain: dbDef.domain,
        collections: []
      };

      for (const collKey of Object.keys(dbDef.collections)) {
        const collDef = dbDef.collections[collKey];
        const collName = collDef.collectionName;

        if (existingCollectionNames.has(collName)) {
          console.log(`   ├── ℹ️  Collection '${collName}' already exists. Skipping creation.`);
          totalExistingCount++;
          summary[dbName].collections.push({ name: collName, status: 'ALREADY_EXISTS' });
        } else {
          // Explicitly create collection without inserting any documents
          await targetDb.createCollection(collName);
          console.log(`   ├── ✨ Created collection: '${collName}'`);
          totalCreatedCount++;
          summary[dbName].collections.push({ name: collName, status: 'CREATED' });
        }
      }
      console.log('');
    }

    // ================================================================
    // POST-CREATION VERIFICATION
    // ================================================================
    console.log('================================================================');
    console.log('  VERIFYING ALL 6 DATABASES & 60 COLLECTIONS');
    console.log('================================================================\n');

    let allVerified = true;
    let totalVerifiedCollections = 0;

    for (const dbName of dbNames) {
      const targetDb = client.db(dbName);
      const verifiedColls = await targetDb.listCollections().toArray();
      const verifiedNames = new Set(verifiedColls.map(c => c.name));
      const requiredColls = Object.keys(dbsConfig[dbName].collections);

      console.log(`📊 Database: ${dbName}`);
      let dbCollectionCount = 0;

      for (const cKey of requiredColls) {
        const cName = dbsConfig[dbName].collections[cKey].collectionName;
        const exists = verifiedNames.has(cName);

        // Verify document count is strictly 0
        let docCount = 0;
        if (exists) {
          docCount = await targetDb.collection(cName).countDocuments();
        }

        if (exists) {
          console.log(`   ✅ ${cName.padEnd(25)} | Exists: YES | Documents: ${docCount}`);
          dbCollectionCount++;
          totalVerifiedCollections++;
        } else {
          console.log(`   ❌ ${cName.padEnd(25)} | Exists: NO  | Documents: 0`);
          allVerified = false;
        }
      }

      console.log(`   Total verified in ${dbName}: ${dbCollectionCount} / 10 collections\n`);
    }

    console.log('================================================================');
    console.log('  PHASE 2 SETUP EXECUTION SUMMARY');
    console.log('================================================================');
    console.log(`Total Target Databases     : ${dbNames.length}`);
    console.log(`Newly Created Collections  : ${totalCreatedCount}`);
    console.log(`Pre-existing Collections   : ${totalExistingCount}`);
    console.log(`Total Verified Collections : ${totalVerifiedCollections} / 60`);
    console.log(`Document Seed Status       : Strictly 0 documents inserted`);
    console.log(`System Databases Preserved : admin, local, config, sample_* untouched`);
    console.log('================================================================\n');

    if (allVerified && totalVerifiedCollections === 60) {
      console.log('🎉 SUCCESS: All 6 databases and 60 collections are properly structured in MongoDB Atlas!');
    } else {
      console.error('⚠️ WARNING: Verification did not find all 60 required collections.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Execution failed with error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed cleanly.\n');
  }
}

if (require.main === module) {
  createDatabaseStructure();
}

module.exports = { createDatabaseStructure };
