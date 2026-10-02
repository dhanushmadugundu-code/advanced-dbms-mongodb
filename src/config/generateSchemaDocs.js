const fs = require('fs');
const path = require('path');
const schemaDefinitions = require('./schemaDefinitions');

// 1. Export schemaDefinitions.json
const jsonPath = path.join(__dirname, 'schemaDefinitions.json');
fs.writeFileSync(jsonPath, JSON.stringify(schemaDefinitions, null, 2), 'utf8');
console.log('Successfully written schemaDefinitions.json');

// 2. Generate documentation/database-schema.md
const docPath = path.join(__dirname, '../../documentation/database-schema.md');

let md = `# SMART E-COMMERCE MANAGEMENT SYSTEM USING MONGODB
## Complete Database Schema Documentation (Phase 1)
**Project Course**: Advanced Database Management Systems (Term Project)  
**Architecture**: Distributed Multi-Database NoSQL Architecture (MongoDB Atlas)  
**Team Composition**: 6 Members | 6 Databases | 60 Collections | 10+ Fields Per Document  

---

## Executive Summary & Architecture Overview

The **Smart E-Commerce Management System** is modeled as a real-world enterprise distributed e-commerce architecture. Instead of an isolated toy database, the system cleanly partitions business domains across **6 dedicated MongoDB databases**, mirroring modern microservice and bounded-context domain driven design (DDD):

1. \`customer_db\` (Member 1) — Identity, KYC, Profiles, Security, Support & Activity
2. \`product_db\` (Member 2) — Catalog, Taxonomy, Variants, Specs, Media & Warranties
3. \`order_db\` (Member 3) — Sales Orders, Checkouts, Shipments, Returns, Refunds & Tracking
4. \`inventory_db\` (Member 4) — Warehouses, Stock Levels, Suppliers, POs, Transfers & Alerts
5. \`payment_db\` (Member 5) — Payment Processing, GST Invoicing, Tax Compliance, Wallets & Failure Logs
6. \`analytics_db\` (Member 6) — Customer Reviews, Sentiment NLP, Daily/Monthly Rollups & ML Recommendations

### Cross-Database Key References (Consistent Logical Identifiers)

While MongoDB manages each database independently, all 6 databases connect cohesively through standardized business identifiers:
- \`customerId\`: Connects \`customer_db\` to \`order_db\`, \`payment_db\`, and \`analytics_db\`.
- \`productId\` & \`variantId\`: Connects \`product_db\` to \`order_db\`, \`inventory_db\`, and \`analytics_db\`.
- \`orderId\`: Connects \`order_db\` to \`customer_db\` (support), \`payment_db\` (transactions/invoices), and \`analytics_db\` (reviews).
- \`warehouseId\` & \`supplierId\`: Connects \`inventory_db\` to \`order_db\` (shipments) and procurement flows.
- \`paymentId\`: Connects \`payment_db\` to \`order_db\` (orders & refunds).

\`\`\`
[ customer_db ]
   │ (customerId)
   ▼
[ order_db ] ──────── (orderId) ───────► [ payment_db ]
   │ (productId)                            │
   ▼                                        ▼
[ product_db ] ◄───── (productId) ───── [ inventory_db ]
   │                                        ▲
   │ (productId)                            │ (supplierId)
   ▼                                        │
[ analytics_db ]                      [ Suppliers & WH ]
\`\`\`

---

## Summary Statistics

| Metric | Target Requirement | Actual Schema Specification | Status |
| :--- | :--- | :--- | :--- |
| **Total Databases** | 6 Databases | **6 Databases** | ✅ Compliant |
| **Total Collections** | 60 Collections (10 / db) | **60 Collections (10 / db)** | ✅ Compliant |
| **Fields per Collection** | Minimum 10 fields | **11 to 15 fields (Avg: 12.6)** | ✅ Exceeds Requirement |
| **Data Types Used** | NoSQL BSON Types | ObjectId, String, Number, Boolean, Date, Array, Object | ✅ Rich NoSQL Model |
| **Context & Currency** | Realistic Indian E-Com | INR (₹), GSTIN, PIN codes, Indian metros & names | ✅ Realistic Domain Data |

---

`;

// Iterate through each database
const dbs = Object.keys(schemaDefinitions.databases);
dbs.forEach((dbKey, dbIndex) => {
  const db = schemaDefinitions.databases[dbKey];
  md += `## Database ${dbIndex + 1}: \`${db.databaseName}\`
**Assigned Student**: ${db.assignedMember}  
**Domain Scope**: ${db.domain}  
**Collections Count**: ${Object.keys(db.collections).length} Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
`;

  const collKeys = Object.keys(db.collections);
  collKeys.forEach((cKey, cIdx) => {
    const c = db.collections[cKey];
    md += `| ${cIdx + 1} | \`${c.collectionName}\` | ${c.purpose} | **${c.fields.length}** | \`${c.businessKey}\` |\n`;
  });

  md += `\n---\n\n`;

  // Detailed tables for each collection
  collKeys.forEach((cKey, cIdx) => {
    const c = db.collections[cKey];
    md += `### ${dbIndex + 1}.${cIdx + 1} Collection: \`${c.collectionName}\`
- **Database**: \`${db.databaseName}\`
- **Assigned Member**: ${db.assignedMember}
- **Collection Purpose**: ${c.purpose}
- **Primary Key**: \`${c.primaryKey}\` (Internal BSON ObjectId)
- **Business Unique Key**: \`${c.businessKey}\`
- **Total Defined Fields**: **${c.fields.length} fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

    c.fields.forEach(f => {
      let exampleFormatted = typeof f.example === 'object' ? JSON.stringify(f.example) : String(f.example);
      md += `| \`${f.name}\` | \`${f.type}\` | ${f.required ? '**Required**' : 'Optional'} | \`${f.isKey}\` | \`${exampleFormatted}\` | ${f.notes} |\n`;
    });

    md += `\n`;
  });

  md += `\n---\n\n`;
});

fs.writeFileSync(docPath, md, 'utf8');
console.log('Successfully written documentation/database-schema.md');
