# Smart E-Commerce Management System using MongoDB
> **Advanced Database Management Systems (ADMS) — Cloud Term Project**

An enterprise-scale distributed NoSQL database system modeled after real-world Indian e-commerce architectures (e.g., Flipkart, Amazon India, Tata CliQ) hosted on **MongoDB Atlas**.

---

## 📊 Project Statistics

- **Databases**: 6 Dedicated Databases (Domain-Driven Microservices Architecture)
- **Team Size**: 6 Members (1 Database per Member)
- **Collections**: 60 Collections (Exactly 10 per Database)
- **Documents**: 3,000 Documents (Exactly 50 per Collection)
- **Fields per Document**: 11 to 15 Fields (Average: 12.65 Fields)
- **Currency**: Indian Rupee (INR ₹)
- **Platform**: MongoDB Atlas Multi-Region Cluster
- **Stack**: Node.js, MongoDB Driver (`^6.8.0`), CommonJS

---

## 🏛️ Multi-Database Architecture

| # | Database | Assigned Member | Domain Scope | Collections Count | Document Count |
|---|:---|:---|:---|:---:|:---:|
| 1 | **`customer_db`** | Member 1 | User Identity, KYC, Profiles, Security & Support | 10 | 500 |
| 2 | **`product_db`** | Member 2 | Catalog, Taxonomy, Variants, Specs & Warranty | 10 | 500 |
| 3 | **`order_db`** | Member 3 | Sales Orders, Checkouts, Shipments & Logistics | 10 | 500 |
| 4 | **`inventory_db`**| Member 4 | Warehousing, Supply Chain, Stock Control & Audits | 10 | 500 |
| 5 | **`payment_db`** | Member 5 | Transactions, GST Invoicing, Tax Filing & Wallets | 10 | 500 |
| 6 | **`analytics_db`**| Member 6 | Reviews, Sentiment Analysis, Daily/Monthly Rollups | 10 | 500 |
| | **TOTALS** | **6 Members** | **Complete Retail Lifecycle** | **60 Collections** | **3,000 Documents** |

---

## 🚀 Quick Start Guide

### 1. Environment Configuration
Create a `.env` file in the root directory (already protected by `.gitignore`):
```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

### 2. Available NPM Commands

```bash
# Setup: Safely create all 6 databases and 60 collections in MongoDB Atlas
npm run setup:databases

# Seed: Idempotently populate 3,000 documents (50 docs per collection)
npm run seed

# Validate: Run comprehensive read-only data validation and referential integrity audit
npm run validate

# CRUD Demo: Execute Create, Read, Update, Delete operations safely
npm run crud

# Advanced Queries: Execute comparison, logical, nested, array, aggregation, and $lookup joins
npm run queries
```

---

## 📚 Curriculum Topic Demonstrations

1. **Introduction to NoSQL & MongoDB**:
   - Multi-database domain separation, flexible BSON schemas, native data types (`ObjectId`, `Date`, `Number`, `Boolean`, `Array`, `Object`, `String`).
   - Standardized cross-database business key references (`customerId`, `productId`, `orderId`, `paymentId`, `warehouseId`, `supplierId`).
2. **CRUD Operations in MongoDB**:
   - `insertOne()` with captured `insertedId`.
   - `find()` with projection, range filters, and `findOne()` key lookups.
   - `updateOne()` demonstrating field modification (`$set`), array manipulation (`$addToSet`), and server timestamp updates (`$currentDate`).
   - `deleteOne()` with post-deletion verification.
3. **Advanced Querying & Aggregation Pipelines**:
   - Comparison: `$gt`, `$gte`, `$lt`, `$lte`, `$eq`, `$ne`, `$in`.
   - Logical: `$and`, `$or`, `$not`, `$nor`.
   - Embedded Subdocuments: Dot notation filtering on `geoCoordinates.latitude` and `appliedFilterDetails.priceMin`.
   - Array Queries: `$all` and `$in` on tags and interest lists.
   - Aggregation: `$match`, `$group`, `$sort`, `$limit`, `$project`, `$unwind`.
   - Multi-Collection Joins: 3 distinct `$lookup` pipelines connecting master orders to line items, products to variants, and orders to delivery addresses.

---

## 📖 Detailed Project Documentation
- **Full Database Schema**: [documentation/database-schema.md](file:///Users/dhanush/.gemini/antigravity-ide/scratch/advanced-dbms-mongodb/documentation/database-schema.md)
- **Comprehensive Project Report**: [documentation/final-project-report.md](file:///Users/dhanush/.gemini/antigravity-ide/scratch/advanced-dbms-mongodb/documentation/final-project-report.md)
