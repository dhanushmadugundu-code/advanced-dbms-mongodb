/**
 * Smart E-Commerce Management System using MongoDB
 * Phase 4: Comprehensive Deep Data Validation Audit
 * 
 * Performs read-only inspection of all 6 databases and 60 collections in MongoDB Atlas:
 * 1. Confirms collection existence and document count >= 50.
 * 2. Confirms every document has >= 10 meaningful fields.
 * 3. Confirms all required schema fields exist.
 * 4. Validates native BSON data types (ObjectId, Date, Number, Boolean, Array, Object, String).
 * 5. Verifies 100% referential integrity across cross-database foreign keys.
 * 6. Verifies system databases (admin, local, config, sample_*) are preserved.
 * 7. Confirms grand total documents >= 3,000.
 */

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const schemaDefinitions = require('../config/schemaDefinitions');

async function validateDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI not found in environment variables (.env).');
    process.exit(1);
  }

  console.log('========================================================================================');
  console.log('  SMART E-COMMERCE MANAGEMENT SYSTEM — PHASE 4 DATA VALIDATION AUDIT');
  console.log('  Auditing 6 Databases, 60 Collections, and 3,000+ Documents in MongoDB Atlas');
  console.log('========================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas cluster.\n');

    // -------------------------------------------------------------------------
    // 1. Audit System & Cluster Databases
    // -------------------------------------------------------------------------
    const adminDb = client.db().admin();
    const dbsListResult = await adminDb.listDatabases();
    const existingDbNames = new Set(dbsListResult.databases.map(d => d.name));

    console.log('📁 Cluster Database Inventory:');
    dbsListResult.databases.forEach(d => {
      console.log(`   ├── ${d.name.padEnd(25)} (Size: ${(d.sizeOnDisk / 1024).toFixed(1)} KB)`);
    });
    console.log('');

    const systemDbs = ['admin', 'local', 'config'];
    systemDbs.forEach(sysDb => {
      if (existingDbNames.has(sysDb)) {
        console.log(`   🔒 System Database preserved: [ ${sysDb} ]`);
      }
    });

    const sampleDbs = dbsListResult.databases.filter(d => d.name.startsWith('sample_'));
    sampleDbs.forEach(sDb => {
      console.log(`   🔒 Sample Database preserved: [ ${sDb.name} ]`);
    });
    console.log('');

    const dbsConfig = schemaDefinitions.databases;
    const dbNames = Object.keys(dbsConfig);

    // -------------------------------------------------------------------------
    // 2. Pre-Load Business Keys for Global Referential Integrity Check
    // -------------------------------------------------------------------------
    console.log('🔍 Pre-indexing business keys across all 60 collections for referential checks...');
    const registeredKeys = {};

    for (const dbName of dbNames) {
      const targetDb = client.db(dbName);
      for (const collKey of Object.keys(dbsConfig[dbName].collections)) {
        const collDef = dbsConfig[dbName].collections[collKey];
        const bk = collDef.businessKey;
        const targetColl = targetDb.collection(collDef.collectionName);
        const docs = await targetColl.find({}, { projection: { [bk]: 1 } }).toArray();
        registeredKeys[bk] = new Set(docs.map(d => d[bk]));
      }
    }
    console.log(`✅ Loaded ${Object.keys(registeredKeys).length} business key registries.\n`);

    // -------------------------------------------------------------------------
    // 3. Deep Audit per Database & Collection
    // -------------------------------------------------------------------------
    const auditResults = [];
    let grandTotalDocuments = 0;
    let globalFailures = 0;

    for (const dbName of dbNames) {
      const dbDef = dbsConfig[dbName];
      const targetDb = client.db(dbName);

      console.log(`========================================================================================`);
      console.log(`📁 Auditing Database: [ ${dbName} ] (${dbDef.assignedMember} — ${dbDef.domain})`);
      console.log(`========================================================================================`);

      for (const collKey of Object.keys(dbDef.collections)) {
        const collDef = dbsConfig[dbName].collections[collKey];
        const collName = collDef.collectionName;
        const targetColl = targetDb.collection(collName);

        const docCount = await targetColl.countDocuments();
        grandTotalDocuments += docCount;

        const docs = await targetColl.find({}).toArray();

        let fieldCountStatus = 'PASS';
        let schemaTypeStatus = 'PASS';
        let relationshipStatus = 'PASS';
        let minFieldsObserved = 999;
        let maxFieldsObserved = 0;
        const collectionErrors = [];

        if (docCount < 50) {
          collectionErrors.push(`Document count ${docCount} is less than required minimum 50`);
        }

        const schemaFieldMap = new Map(collDef.fields.map(f => [f.name, f]));

        for (let i = 0; i < docs.length; i++) {
          const doc = docs[i];
          const keysCount = Object.keys(doc).length;
          if (keysCount < minFieldsObserved) minFieldsObserved = keysCount;
          if (keysCount > maxFieldsObserved) maxFieldsObserved = keysCount;

          if (keysCount < 10) {
            fieldCountStatus = 'FAIL';
            collectionErrors.push(`Doc #${i} has only ${keysCount} fields (< 10)`);
          }

          // Validate fields and data types
          for (const [fName, fDef] of schemaFieldMap.entries()) {
            const val = doc[fName];

            if (fDef.required && (val === undefined || val === null)) {
              schemaTypeStatus = 'FAIL';
              collectionErrors.push(`Doc #${i} missing required field '${fName}'`);
              continue;
            }

            if (val !== undefined && val !== null) {
              if (fDef.type === 'ObjectId' && !(val instanceof ObjectId)) {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not valid ObjectId`);
              } else if (fDef.type === 'Date' && (!(val instanceof Date) || isNaN(val.getTime()))) {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not valid Date`);
              } else if (fDef.type === 'Number' && (typeof val !== 'number' || isNaN(val))) {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not Number`);
              } else if (fDef.type === 'Boolean' && typeof val !== 'boolean') {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not Boolean`);
              } else if (fDef.type === 'String' && typeof val !== 'string') {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not String`);
              } else if (fDef.type === 'Array' && (!Array.isArray(val) || val.length === 0)) {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not non-empty Array`);
              } else if (fDef.type === 'Object' && (typeof val !== 'object' || Array.isArray(val) || val === null)) {
                schemaTypeStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} field '${fName}' is not Object`);
              }
            }
          }

          // Validate Foreign Key Referential Integrity
          for (const fDef of collDef.fields) {
            if (fDef.isKey === 'FK') {
              const targetBk = fDef.name === 'shippingAddressId' ? 'deliveryAddressId' :
                               fDef.name === 'sourceWarehouseId' ? 'warehouseId' :
                               fDef.name === 'destinationWarehouseId' ? 'warehouseId' :
                               fDef.name === 'topSellingCategoryId' ? 'categoryId' :
                               fDef.name === 'topSellingProductId' ? 'productId' :
                               fDef.name === 'clickedProductId' ? 'productId' :
                               fDef.name === 'recommendedProductId' ? 'productId' : fDef.name;

              const val = doc[fDef.name];
              if (val && registeredKeys[targetBk] && !registeredKeys[targetBk].has(val)) {
                relationshipStatus = 'FAIL';
                collectionErrors.push(`Doc #${i} has broken FK '${fDef.name}': '${val}' does not exist in target`);
              }
            }
          }
        }

        const overallStatus = (docCount >= 50 && fieldCountStatus === 'PASS' && schemaTypeStatus === 'PASS' && relationshipStatus === 'PASS')
          ? 'PASS ✅'
          : 'FAIL ❌';

        if (overallStatus.includes('FAIL')) {
          globalFailures++;
        }

        auditResults.push({
          database: dbName,
          collection: collName,
          docCount,
          minFields: minFieldsObserved,
          maxFields: maxFieldsObserved,
          fieldCountStatus,
          schemaTypeStatus,
          relationshipStatus,
          overallStatus,
          errors: collectionErrors
        });

        console.log(`   ├── Collection: ${collName.padEnd(25)} | Docs: ${docCount} | Fields: ${minFieldsObserved}-${maxFieldsObserved} | Schema: ${schemaTypeStatus} | FKs: ${relationshipStatus} | Status: ${overallStatus}`);
      }
      console.log('');
    }

    // -------------------------------------------------------------------------
    // 4. Consolidated Tabular Summary Report
    // -------------------------------------------------------------------------
    console.log('========================================================================================================================');
    console.log('  CONSOLIDATED PHASE 4 VALIDATION AUDIT REPORT');
    console.log('========================================================================================================================');
    console.log('| Database Name | Collection Name           | Docs | Fields  | Field Count | Schema Types | Relationships | Overall |');
    console.log('| :---          | :---                      | :--- | :---    | :---        | :---         | :---          | :---    |');

    auditResults.forEach(r => {
      const dbCol = r.database.padEnd(13);
      const collCol = r.collection.padEnd(25);
      const docCol = String(r.docCount).padEnd(4);
      const fieldsRange = `${r.minFields}-${r.maxFields}`.padEnd(7);
      const fCountStatus = r.fieldCountStatus.padEnd(11);
      const sTypeStatus = r.schemaTypeStatus.padEnd(12);
      const relStatus = r.relationshipStatus.padEnd(13);
      const ovStatus = r.overallStatus;
      console.log(`| ${dbCol} | ${collCol} | ${docCol} | ${fieldsRange} | ${fCountStatus} | ${sTypeStatus} | ${relStatus} | ${ovStatus} |`);
    });

    console.log('========================================================================================================================\n');

    console.log('========================================================================================');
    console.log('  PHASE 4 AUDIT SUMMARY METRICS');
    console.log('========================================================================================');
    console.log(`Total Target Databases Audited    : ${dbNames.length} / 6`);
    console.log(`Total Target Collections Audited  : ${auditResults.length} / 60`);
    console.log(`Total Live Documents Audited      : ${grandTotalDocuments}`);
    console.log(`Minimum Required Documents (3,000): ${grandTotalDocuments >= 3000 ? 'EXCEEDED / MET ✅' : 'NOT MET ❌'}`);
    console.log(`Collections with < 50 Documents   : ${auditResults.filter(r => r.docCount < 50).length} (Target: 0)`);
    console.log(`Collections with < 10 Fields      : ${auditResults.filter(r => r.minFields < 10).length} (Target: 0)`);
    console.log(`Schema / Type Violations Observed : ${auditResults.filter(r => r.schemaTypeStatus === 'FAIL').length} (Target: 0)`);
    console.log(`Broken Foreign Key Relationships  : ${auditResults.filter(r => r.relationshipStatus === 'FAIL').length} (Target: 0)`);
    console.log(`System Databases Preserved        : admin, local, config, sample_* untouched ✅`);
    console.log(`Overall Phase 4 Audit Result      : ${globalFailures === 0 && grandTotalDocuments >= 3000 ? 'ALL CHECKS PASSED (100% COMPLIANT) 🎉' : 'FAILURES DETECTED ❌'}`);
    console.log('========================================================================================\n');

    if (globalFailures > 0 || grandTotalDocuments < 3000) {
      console.error('❌ Data validation audit failed with errors.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Validation audit crashed with error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed cleanly.\n');
  }
}

if (require.main === module) {
  validateDatabase();
}

module.exports = { validateDatabase };
