# SMART E-COMMERCE MANAGEMENT SYSTEM USING MONGODB
## Complete Database Schema Documentation (Phase 1)
**Project Course**: Advanced Database Management Systems (Term Project)  
**Architecture**: Distributed Multi-Database NoSQL Architecture (MongoDB Atlas)  
**Team Composition**: 6 Members | 6 Databases | 60 Collections | 10+ Fields Per Document  

---

## Executive Summary & Architecture Overview

The **Smart E-Commerce Management System** is modeled as a real-world enterprise distributed e-commerce architecture. Instead of an isolated toy database, the system cleanly partitions business domains across **6 dedicated MongoDB databases**, mirroring modern microservice and bounded-context domain driven design (DDD):

1. `customer_db` (Member 1) — Identity, KYC, Profiles, Security, Support & Activity
2. `product_db` (Member 2) — Catalog, Taxonomy, Variants, Specs, Media & Warranties
3. `order_db` (Member 3) — Sales Orders, Checkouts, Shipments, Returns, Refunds & Tracking
4. `inventory_db` (Member 4) — Warehouses, Stock Levels, Suppliers, POs, Transfers & Alerts
5. `payment_db` (Member 5) — Payment Processing, GST Invoicing, Tax Compliance, Wallets & Failure Logs
6. `analytics_db` (Member 6) — Customer Reviews, Sentiment NLP, Daily/Monthly Rollups & ML Recommendations

### Cross-Database Key References (Consistent Logical Identifiers)

While MongoDB manages each database independently, all 6 databases connect cohesively through standardized business identifiers:
- `customerId`: Connects `customer_db` to `order_db`, `payment_db`, and `analytics_db`.
- `productId` & `variantId`: Connects `product_db` to `order_db`, `inventory_db`, and `analytics_db`.
- `orderId`: Connects `order_db` to `customer_db` (support), `payment_db` (transactions/invoices), and `analytics_db` (reviews).
- `warehouseId` & `supplierId`: Connects `inventory_db` to `order_db` (shipments) and procurement flows.
- `paymentId`: Connects `payment_db` to `order_db` (orders & refunds).

```
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
```

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

## Database 1: `customer_db`
**Assigned Student**: Member 1  
**Domain Scope**: Customer Management & User Identity  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `customers` | Core customer identity, KYC status, and basic demographic account details | **13** | `customerId` |
| 2 | `customer_profiles` | Extended demographic, biographical, and lifestyle information for personalization | **12** | `profileId` |
| 3 | `addresses` | Multiple physical delivery and billing addresses associated with customers | **13** | `addressId` |
| 4 | `contacts` | Primary and secondary emergency/communication contacts per customer | **12** | `contactId` |
| 5 | `preferences` | Notification channels, privacy controls, UI themes, and platform settings | **12** | `preferenceId` |
| 6 | `login_history` | Audit trail of customer session authentications, devices, IPs, and security events | **12** | `loginId` |
| 7 | `wishlists` | Saved items, target price points, and priority bookmarks for future purchase | **12** | `wishlistId` |
| 8 | `loyalty_accounts` | Tier levels, reward points balance, redemption history, and VIP perks | **12** | `loyaltyId` |
| 9 | `customer_support` | Support tickets, disputes, inquiries, and resolution communications | **13** | `ticketId` |
| 10 | `customer_activity` | Clickstream events, page hits, cart interactions, and search actions | **12** | `activityId` |

---

### 1.1 Collection: `customers`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Core customer identity, KYC status, and basic demographic account details
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `customerId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000001')` | MongoDB internal unique identifier |
| `customerId` | `String` | **Required** | `UK` | `CUST-10001` | Global unique customer business identifier |
| `firstName` | `String` | **Required** | `NONE` | `Aarav` | Given first name |
| `lastName` | `String` | **Required** | `NONE` | `Sharma` | Family / surname |
| `email` | `String` | **Required** | `INDEX` | `aarav.sharma@example.com` | Unique registered email address |
| `phone` | `String` | **Required** | `INDEX` | `+91-9876543210` | 10-digit Indian mobile with country prefix |
| `gender` | `String` | **Required** | `NONE` | `Male` | Male / Female / Other / Prefer not to say |
| `dateOfBirth` | `String` | **Required** | `NONE` | `1994-05-14` | Date of birth in YYYY-MM-DD format |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | Account status: ACTIVE, INACTIVE, SUSPENDED |
| `kycVerified` | `Boolean` | **Required** | `NONE` | `true` | Indicates completion of Govt ID / Aadhaar verification |
| `tags` | `Array` | **Required** | `NONE` | `["VIP","EARLY_ADOPTER"]` | Customer segmentation & loyalty tags array for $in and $all operations |
| `registeredAt` | `Date` | **Required** | `NONE` | `2023-01-15T10:30:00Z` | Account creation UTC timestamp |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-02-10T14:20:00Z` | Last profile modification timestamp |

### 1.2 Collection: `customer_profiles`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Extended demographic, biographical, and lifestyle information for personalization
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `profileId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000002')` | Internal ID |
| `profileId` | `String` | **Required** | `UK` | `PROF-10001` | Unique profile identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `avatarUrl` | `String` | Optional | `NONE` | `https://cdn.smartecom.in/avatars/cust-10001.jpg` | Customer profile image URL |
| `bio` | `String` | Optional | `NONE` | `Tech enthusiast and smart home gadget collector from Bengaluru` | Short user bio |
| `occupation` | `String` | **Required** | `NONE` | `Software Engineer` | Professional occupation |
| `annualIncomeRange` | `String` | **Required** | `NONE` | `₹10,00,000 - ₹15,00,000` | Income bracket in INR for marketing classification |
| `preferredLanguage` | `String` | **Required** | `NONE` | `English` | Preferred language: English, Hindi, Kannada, Tamil, etc. |
| `maritalStatus` | `String` | **Required** | `NONE` | `Single` | Single, Married, etc. |
| `interests` | `Array` | **Required** | `NONE` | `["Consumer Electronics","Smart Home","Fitness"]` | List of retail interest tags |
| `profileCompleteness` | `Number` | **Required** | `NONE` | `95` | Percentage score (0-100) |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-03-01T08:15:00Z` | Timestamp of last profile update |

### 1.3 Collection: `addresses`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Multiple physical delivery and billing addresses associated with customers
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `addressId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000003')` | Internal ID |
| `addressId` | `String` | **Required** | `UK` | `ADDR-10001` | Unique address identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `addressType` | `String` | **Required** | `NONE` | `HOME` | HOME, WORK, OTHER |
| `isDefault` | `Boolean` | **Required** | `NONE` | `true` | Default shipping address indicator |
| `recipientName` | `String` | **Required** | `NONE` | `Aarav Sharma` | Consignee full name |
| `recipientPhone` | `String` | **Required** | `NONE` | `+91-9876543210` | Delivery contact phone |
| `streetAddress` | `String` | **Required** | `NONE` | `Flat 402, Prestige Palms, 12th Main Road` | Primary street line |
| `landmark` | `String` | Optional | `NONE` | `Near Forum Mall Koramangala` | Nearby prominent landmark |
| `city` | `String` | **Required** | `INDEX` | `Bengaluru` | Indian city |
| `state` | `String` | **Required** | `NONE` | `Karnataka` | Indian state |
| `postalCode` | `String` | **Required** | `INDEX` | `560034` | 6-digit Indian Postal PIN code |
| `country` | `String` | **Required** | `NONE` | `India` | Country of residence |

### 1.4 Collection: `contacts`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Primary and secondary emergency/communication contacts per customer
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `contactId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000004')` | Internal ID |
| `contactId` | `String` | **Required** | `UK` | `CONT-10001` | Unique contact record identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `contactType` | `String` | **Required** | `NONE` | `PRIMARY_PHONE` | PRIMARY_PHONE, ALT_PHONE, WORK_EMAIL, EMERGENCY_CONTACT |
| `contactValue` | `String` | **Required** | `NONE` | `+91-9876543210` | Phone number or email address value |
| `isVerified` | `Boolean` | **Required** | `NONE` | `true` | Verification status |
| `verifiedAt` | `Date` | Optional | `NONE` | `2023-01-16T11:00:00Z` | Timestamp when OTP verification occurred |
| `verificationMethod` | `String` | **Required** | `NONE` | `OTP_SMS` | OTP_SMS, EMAIL_LINK, MANUAL_CALL |
| `priority` | `Number` | **Required** | `NONE` | `1` | Contact order priority (1 = highest) |
| `isPrimary` | `Boolean` | **Required** | `NONE` | `true` | Is this the main contact point |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-01-15T10:35:00Z` | Creation date |
| `updatedAt` | `Date` | **Required** | `NONE` | `2023-06-20T12:00:00Z` | Last updated timestamp |

### 1.5 Collection: `preferences`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Notification channels, privacy controls, UI themes, and platform settings
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `preferenceId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000005')` | Internal ID |
| `preferenceId` | `String` | **Required** | `UK` | `PREF-10001` | Unique settings identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `emailNotifications` | `Boolean` | **Required** | `NONE` | `true` | Consent to marketing and order emails |
| `smsNotifications` | `Boolean` | **Required** | `NONE` | `false` | Consent to transactional SMS |
| `whatsappAlerts` | `Boolean` | **Required** | `NONE` | `true` | Consent for WhatsApp tracking notifications |
| `currency` | `String` | **Required** | `NONE` | `INR` | Preferred billing currency code |
| `theme` | `String` | **Required** | `NONE` | `DARK` | UI appearance: DARK, LIGHT, SYSTEM |
| `twoFactorAuthEnabled` | `Boolean` | **Required** | `NONE` | `true` | Mandates 2FA on login |
| `personalizedRecommendations` | `Boolean` | **Required** | `NONE` | `true` | Consent for tracking analytics |
| `preferredPaymentMethod` | `String` | **Required** | `NONE` | `UPI` | Default checkout method: UPI, CREDIT_CARD, NET_BANKING |
| `lastUpdated` | `Date` | **Required** | `NONE` | `2024-01-10T16:45:00Z` | Settings timestamp |

### 1.6 Collection: `login_history`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Audit trail of customer session authentications, devices, IPs, and security events
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `loginId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000006')` | Internal ID |
| `loginId` | `String` | **Required** | `UK` | `LOG-10001` | Unique login audit identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `ipAddress` | `String` | **Required** | `NONE` | `103.24.120.45` | Client public IPv4 address |
| `deviceType` | `String` | **Required** | `NONE` | `MOBILE` | MOBILE, DESKTOP, TABLET |
| `browser` | `String` | **Required** | `NONE` | `Chrome Mobile 122.0.0` | User agent client browser |
| `operatingSystem` | `String` | **Required** | `NONE` | `Android 14` | Client OS |
| `loginLocation` | `String` | **Required** | `NONE` | `Bengaluru, Karnataka, India` | GeoIP resolved city, state, country |
| `loginStatus` | `String` | **Required** | `NONE` | `SUCCESS` | SUCCESS, FAILED_INVALID_PASSWORD, OTP_TIMEOUT |
| `failureReason` | `String` | Optional | `NONE` | `None` | Detailed error message if failed |
| `sessionDurationSeconds` | `Number` | **Required** | `NONE` | `1420` | Active session length in seconds |
| `loginTimestamp` | `Date` | **Required** | `INDEX` | `2024-04-12T09:15:30Z` | UTC timestamp of connection |

### 1.7 Collection: `wishlists`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Saved items, target price points, and priority bookmarks for future purchase
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `wishlistId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000007')` | Internal ID |
| `wishlistId` | `String` | **Required** | `UK` | `WISH-10001` | Unique wishlist record identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `addedPrice` | `Number` | **Required** | `NONE` | `49999` | Price in INR when item was added to wishlist |
| `notifyOnPriceDrop` | `Boolean` | **Required** | `NONE` | `true` | Alert customer if price drops |
| `targetPrice` | `Number` | Optional | `NONE` | `44999` | Desired price point in INR |
| `priorityLevel` | `String` | **Required** | `NONE` | `HIGH` | HIGH, MEDIUM, LOW |
| `notes` | `String` | Optional | `NONE` | `Buy during Diwali Festival Sale` | Customer personal note |
| `isPublic` | `Boolean` | **Required** | `NONE` | `false` | Can this wishlist be shared via URL |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, PURCHASED, REMOVED |
| `createdAt` | `Date` | **Required** | `NONE` | `2024-02-14T18:20:00Z` | Timestamp item was saved |

### 1.8 Collection: `loyalty_accounts`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Tier levels, reward points balance, redemption history, and VIP perks
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `loyaltyId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000008')` | Internal ID |
| `loyaltyId` | `String` | **Required** | `UK` | `LOY-10001` | Unique loyalty membership identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `tierLevel` | `String` | **Required** | `INDEX` | `GOLD` | BRONZE, SILVER, GOLD, PLATINUM |
| `pointsBalance` | `Number` | **Required** | `NONE` | `2450` | Currently spendable loyalty points |
| `lifetimePointsEarned` | `Number` | **Required** | `NONE` | `5800` | All-time accumulated points |
| `lifetimePointsRedeemed` | `Number` | **Required** | `NONE` | `3350` | Points converted to checkout discounts |
| `tierUpgradeDate` | `Date` | **Required** | `NONE` | `2023-11-01T00:00:00Z` | Date current tier was achieved |
| `tierExpiryDate` | `Date` | **Required** | `NONE` | `2024-11-01T23:59:59Z` | Validity date before tier requalification |
| `annualSpendINR` | `Number` | **Required** | `NONE` | `86500` | Qualifying spend in INR this calendar year |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, LOCKED, EXPIRED |
| `lastPointsActivityAt` | `Date` | **Required** | `NONE` | `2024-04-10T11:15:00Z` | Timestamp of latest earn or burn event |

### 1.9 Collection: `customer_support`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Support tickets, disputes, inquiries, and resolution communications
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `ticketId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000009')` | Internal ID |
| `ticketId` | `String` | **Required** | `UK` | `TICK-10001` | Unique support ticket number |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `orderId` | `String` | Optional | `FK` | `ORD-10001` | Logical reference to order_db.orders.orderId |
| `category` | `String` | **Required** | `NONE` | `DELIVERY_DELAY` | DELIVERY_DELAY, DEFECTIVE_PRODUCT, REFUND_STATUS, PAYMENT_ISSUE |
| `subject` | `String` | **Required** | `NONE` | `Shipment delayed beyond promised delivery date` | Brief issue summary |
| `description` | `String` | **Required** | `NONE` | `Package ORD-10001 has been stuck at sorting center for 3 days.` | Full customer inquiry |
| `priority` | `String` | **Required** | `NONE` | `HIGH` | LOW, MEDIUM, HIGH, CRITICAL |
| `status` | `String` | **Required** | `INDEX` | `RESOLVED` | OPEN, IN_PROGRESS, RESOLVED, CLOSED |
| `assignedAgent` | `String` | **Required** | `NONE` | `Pooja Nair` | Support representative assigned |
| `resolutionNotes` | `String` | Optional | `NONE` | `Contacted Delhivery hub; expedited delivery scheduled for tomorrow morning.` | Resolution explanation |
| `createdAt` | `Date` | **Required** | `NONE` | `2024-04-11T10:00:00Z` | Ticket creation timestamp |
| `resolvedAt` | `Date` | Optional | `NONE` | `2024-04-12T15:30:00Z` | Ticket closure timestamp |

### 1.10 Collection: `customer_activity`
- **Database**: `customer_db`
- **Assigned Member**: Member 1
- **Collection Purpose**: Clickstream events, page hits, cart interactions, and search actions
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `activityId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a1000000000000000010')` | Internal ID |
| `activityId` | `String` | **Required** | `UK` | `ACT-10001` | Unique telemetry event identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customers.customerId |
| `activityType` | `String` | **Required** | `INDEX` | `VIEW_PRODUCT` | VIEW_PRODUCT, ADD_TO_CART, APPLY_COUPON, INITIATE_CHECKOUT, LEAVE_REVIEW |
| `targetEntityId` | `String` | **Required** | `NONE` | `PROD-10001` | Targeted entity identifier (product, order, coupon) |
| `targetEntityType` | `String` | **Required** | `NONE` | `PRODUCT` | PRODUCT, ORDER, CATEGORY, COUPON |
| `platform` | `String` | **Required** | `NONE` | `ANDROID_APP` | ANDROID_APP, IOS_APP, WEB_BROWSER |
| `sessionId` | `String` | **Required** | `NONE` | `SESS-892348` | Browser / App session token |
| `ipAddress` | `String` | **Required** | `NONE` | `122.161.45.89` | Public IP address |
| `durationSeconds` | `Number` | **Required** | `NONE` | `45` | Dwell time on the target page in seconds |
| `activityMetadata` | `Object` | **Required** | `NONE` | `{"source":"search_result","scrollDepth":85}` | Custom JSON payload with interaction telemetry |
| `timestamp` | `Date` | **Required** | `INDEX` | `2024-04-14T20:10:00Z` | UTC timestamp of event execution |


---

## Database 2: `product_db`
**Assigned Student**: Member 2  
**Domain Scope**: Catalog, Taxonomy, Specs, Variants & Pricing  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `products` | Master catalog containing base items, SKU identity, and core pricing | **15** | `productId` |
| 2 | `categories` | High-level department classification, tax codes, and navigation trees | **12** | `categoryId` |
| 3 | `subcategories` | Granular sub-department organization and fee structures | **12** | `subcategoryId` |
| 4 | `brands` | Manufacturer and brand partner registries, origins, and corporate credentials | **13** | `brandId` |
| 5 | `product_variants` | Color, size, RAM/ROM capacity permutations with specific SKUs and price differentials | **13** | `variantId` |
| 6 | `product_images` | Product gallery assets, hero renders, thumbnails, and SEO alt texts | **12** | `imageId` |
| 7 | `product_specs` | Granular technical specifications and hardware parameters for faceted filtering | **12** | `specId` |
| 8 | `product_discounts` | Special product-level promotions, flash deals, and partner bank offers | **12** | `discountId` |
| 9 | `product_tags` | Marketing labels, badges (Bestseller, 5G), and festive seasonal highlights | **12** | `tagId` |
| 10 | `product_warranty` | Manufacturer guarantee terms, coverage details, exclusions, and claim SLAs | **13** | `warrantyId` |

---

### 2.1 Collection: `products`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Master catalog containing base items, SKU identity, and core pricing
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `productId`
- **Total Defined Fields**: **15 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000001')` | Internal ID |
| `productId` | `String` | **Required** | `UK` | `PROD-10001` | Global unique product identifier |
| `name` | `String` | **Required** | `INDEX` | `OnePlus 12 5G (Flowy Emerald, 256GB)` | Full product commercial title |
| `slug` | `String` | **Required** | `UK` | `oneplus-12-5g-flowy-emerald-256gb` | SEO URL slug |
| `brandId` | `String` | **Required** | `FK` | `BRD-10001` | Foreign key reference to brands.brandId |
| `categoryId` | `String` | **Required** | `FK` | `CAT-10001` | Foreign key reference to categories.categoryId |
| `subcategoryId` | `String` | **Required** | `FK` | `SUBCAT-10001` | Foreign key reference to subcategories.subcategoryId |
| `basePriceINR` | `Number` | **Required** | `NONE` | `64999` | Maximum Retail Price (MRP) in INR |
| `sellingPriceINR` | `Number` | **Required** | `INDEX` | `59999` | Active selling price in INR |
| `currency` | `String` | **Required** | `NONE` | `INR` | Catalog currency |
| `sku` | `String` | **Required** | `UK` | `SKU-OP12-EM-256` | Stock keeping unit code |
| `status` | `String` | **Required** | `INDEX` | `ACTIVE` | ACTIVE, DISCONTINUED, OUT_OF_STOCK, DRAFT |
| `ratingAverage` | `Number` | **Required** | `NONE` | `4.6` | Cached average star rating (1.0 to 5.0) |
| `tags` | `Array` | **Required** | `INDEX` | `["5G","Smartphones","Flagship","AMOLED"]` | Product search & categorization tags array for $all, $elemMatch, and $unwind operations |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-12-01T09:00:00Z` | Listing creation date |

### 2.2 Collection: `categories`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: High-level department classification, tax codes, and navigation trees
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `categoryId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000002')` | Internal ID |
| `categoryId` | `String` | **Required** | `UK` | `CAT-10001` | Unique category business code |
| `name` | `String` | **Required** | `INDEX` | `Electronics & Gadgets` | Category display name |
| `code` | `String` | **Required** | `UK` | `ELEC` | Short mnemonic code |
| `description` | `String` | **Required** | `NONE` | `Smartphones, laptops, audio systems, and consumer electronics` | Detailed description |
| `displayOrder` | `Number` | **Required** | `NONE` | `1` | Sort order in frontend menu |
| `iconUrl` | `String` | **Required** | `NONE` | `https://cdn.smartecom.in/icons/cat-electronics.png` | CDN icon URL |
| `bannerImageUrl` | `String` | **Required** | `NONE` | `https://cdn.smartecom.in/banners/cat-electronics.jpg` | Top promo banner URL |
| `isActive` | `Boolean` | **Required** | `NONE` | `true` | Whether category is visible to shoppers |
| `gstRatePercentage` | `Number` | **Required** | `NONE` | `18` | Standard GST slab percentage |
| `totalProductsCount` | `Number` | **Required** | `NONE` | `150` | Cached count of active listings |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-01-01T00:00:00Z` | Category creation timestamp |

### 2.3 Collection: `subcategories`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Granular sub-department organization and fee structures
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `subcategoryId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000003')` | Internal ID |
| `subcategoryId` | `String` | **Required** | `UK` | `SUBCAT-10001` | Unique subcategory identifier |
| `categoryId` | `String` | **Required** | `FK` | `CAT-10001` | Foreign key reference to categories.categoryId |
| `name` | `String` | **Required** | `INDEX` | `Smartphones & Accessories` | Subcategory name |
| `slug` | `String` | **Required** | `UK` | `smartphones-accessories` | URL slug |
| `description` | `String` | **Required** | `NONE` | `5G flagships, budget phones, cases, and fast chargers` | Scope description |
| `displayOrder` | `Number` | **Required** | `NONE` | `1` | Sort order within category |
| `commissionPercentage` | `Number` | **Required** | `NONE` | `5.5` | Marketplace commission rate |
| `isActive` | `Boolean` | **Required** | `NONE` | `true` | Subcategory active status |
| `requiresSerialNumber` | `Boolean` | **Required** | `NONE` | `true` | Requires IMEI/Serial verification |
| `totalItems` | `Number` | **Required** | `NONE` | `45` | Cached item count |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-01-02T00:00:00Z` | Creation timestamp |

### 2.4 Collection: `brands`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Manufacturer and brand partner registries, origins, and corporate credentials
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `brandId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000004')` | Internal ID |
| `brandId` | `String` | **Required** | `UK` | `BRD-10001` | Unique brand identifier |
| `name` | `String` | **Required** | `INDEX` | `OnePlus` | Official commercial brand name |
| `code` | `String` | **Required** | `UK` | `ONEPLUS` | Uppercase brand code |
| `countryOfOrigin` | `String` | **Required** | `NONE` | `India` | Headquarters or primary manufacturing country |
| `headquarters` | `String` | **Required** | `NONE` | `Bengaluru, Karnataka` | Indian corporate office address |
| `website` | `String` | **Required** | `NONE` | `https://www.oneplus.in` | Official brand portal |
| `supportEmail` | `String` | **Required** | `NONE` | `support.india@oneplus.com` | Customer service contact |
| `isAuthorizedSeller` | `Boolean` | **Required** | `NONE` | `true` | Direct brand authorization flag |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, PENDING_VERIFICATION |
| `brandTier` | `String` | **Required** | `NONE` | `PREMIUM` | PREMIUM, MID_RANGE, BUDGET |
| `establishedYear` | `Number` | **Required** | `NONE` | `2013` | Brand inception year |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-01-05T00:00:00Z` | Registry creation date |

### 2.5 Collection: `product_variants`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Color, size, RAM/ROM capacity permutations with specific SKUs and price differentials
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `variantId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000005')` | Internal ID |
| `variantId` | `String` | **Required** | `UK` | `VAR-10001` | Unique variant identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `variantName` | `String` | **Required** | `NONE` | `Flowy Emerald / 16GB RAM + 512GB Storage` | Descriptive variant string |
| `color` | `String` | **Required** | `NONE` | `Flowy Emerald` | Color specification |
| `sizeOrCapacity` | `String` | **Required** | `NONE` | `512GB` | Storage capacity or dimensions |
| `sku` | `String` | **Required** | `UK` | `SKU-OP12-EM-512` | Variant specific SKU |
| `priceAdjustmentINR` | `Number` | **Required** | `NONE` | `5000` | Price difference relative to base product |
| `finalPriceINR` | `Number` | **Required** | `INDEX` | `64999` | Effective variant selling price |
| `stockQuantity` | `Number` | **Required** | `NONE` | `25` | Total available variant inventory |
| `isDefault` | `Boolean` | **Required** | `NONE` | `false` | Default variant selection on product page |
| `status` | `String` | **Required** | `NONE` | `AVAILABLE` | AVAILABLE, OUT_OF_STOCK |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-12-05T10:00:00Z` | Creation date |

### 2.6 Collection: `product_images`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Product gallery assets, hero renders, thumbnails, and SEO alt texts
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `imageId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000006')` | Internal ID |
| `imageId` | `String` | **Required** | `UK` | `IMG-10001` | Unique image asset identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `imageUrl` | `String` | **Required** | `NONE` | `https://cdn.smartecom.in/products/op12-front.webp` | Full resolution image URL |
| `thumbnailUrl` | `String` | **Required** | `NONE` | `https://cdn.smartecom.in/products/thumbs/op12-front.webp` | Thumbnail URL for lists |
| `altText` | `String` | **Required** | `NONE` | `OnePlus 12 5G Flowy Emerald front display view` | Accessibility and SEO alt text |
| `displayOrder` | `Number` | **Required** | `NONE` | `1` | Gallery sequence position |
| `isPrimary` | `Boolean` | **Required** | `NONE` | `true` | Featured primary thumbnail flag |
| `resolution` | `String` | **Required** | `NONE` | `2400x2400` | Width x Height dimensions in pixels |
| `format` | `String` | **Required** | `NONE` | `WEBP` | File format: WEBP, JPEG, PNG |
| `fileSizeKB` | `Number` | **Required** | `NONE` | `345` | Asset size in Kilobytes |
| `uploadedAt` | `Date` | **Required** | `NONE` | `2023-12-02T11:00:00Z` | Upload timestamp |

### 2.7 Collection: `product_specs`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Granular technical specifications and hardware parameters for faceted filtering
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `specId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000007')` | Internal ID |
| `specId` | `String` | **Required** | `UK` | `SPEC-10001` | Unique specification record identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `specGroup` | `String` | **Required** | `INDEX` | `Processor` | Category grouping: Processor, Camera, Battery, Display |
| `specKey` | `String` | **Required** | `NONE` | `Chipset` | Parameter name |
| `specValue` | `String` | **Required** | `NONE` | `Snapdragon 8 Gen 3` | Parameter value |
| `unit` | `String` | Optional | `NONE` | `GHz` | Physical measurement unit |
| `isFilterable` | `Boolean` | **Required** | `NONE` | `true` | Available for sidebar search filtering |
| `displayPriority` | `Number` | **Required** | `NONE` | `1` | Order within specification table |
| `isHighlight` | `Boolean` | **Required** | `NONE` | `true` | Shown in quick bullet points |
| `verified` | `Boolean` | **Required** | `NONE` | `true` | Verified against manufacturer datasheets |
| `updatedAt` | `Date` | **Required** | `NONE` | `2023-12-03T14:00:00Z` | Last update timestamp |

### 2.8 Collection: `product_discounts`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Special product-level promotions, flash deals, and partner bank offers
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `discountId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000008')` | Internal ID |
| `discountId` | `String` | **Required** | `UK` | `DISC-10001` | Unique discount campaign identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `discountType` | `String` | **Required** | `NONE` | `PERCENTAGE` | PERCENTAGE, FLAT_AMOUNT, BANK_OFFER |
| `discountValue` | `Number` | **Required** | `NONE` | `10` | Percentage (10) or flat amount in INR |
| `minPurchaseAmountINR` | `Number` | **Required** | `NONE` | `20000` | Minimum order value to activate |
| `maxDiscountAmountINR` | `Number` | **Required** | `NONE` | `3000` | Maximum discount ceiling in INR |
| `applicableBank` | `String` | **Required** | `NONE` | `HDFC Bank` | HDFC Bank, ICICI Bank, SBI Card, ALL |
| `startDate` | `Date` | **Required** | `NONE` | `2024-04-01T00:00:00Z` | Promo start date |
| `endDate` | `Date` | **Required** | `NONE` | `2024-04-30T23:59:59Z` | Promo expiry date |
| `status` | `String` | **Required** | `INDEX` | `ACTIVE` | ACTIVE, EXPIRED, UPCOMING |
| `usageLimit` | `Number` | **Required** | `NONE` | `1` | Max redemptions allowed per customer |

### 2.9 Collection: `product_tags`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Marketing labels, badges (Bestseller, 5G), and festive seasonal highlights
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `tagId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000009')` | Internal ID |
| `tagId` | `String` | **Required** | `UK` | `TAG-10001` | Unique tag identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `tagName` | `String` | **Required** | `INDEX` | `Bestseller` | Display badge text |
| `tagSlug` | `String` | **Required** | `NONE` | `bestseller` | Search URL slug |
| `tagType` | `String` | **Required** | `NONE` | `BADGE` | PROMOTIONAL, TECHNICAL, SEASONAL, BADGE |
| `colorCodeHex` | `String` | **Required** | `NONE` | `#10B981` | UI badge accent color |
| `clickCount` | `Number` | **Required** | `NONE` | `1420` | Engagement metrics count |
| `isActive` | `Boolean` | **Required** | `NONE` | `true` | Tag visibility toggle |
| `displayOnCard` | `Boolean` | **Required** | `NONE` | `true` | Show badge on catalog card |
| `expiryDate` | `Date` | Optional | `NONE` | `2024-12-31T23:59:59Z` | Automatic expiration date |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-12-10T08:00:00Z` | Tag assignment timestamp |

### 2.10 Collection: `product_warranty`
- **Database**: `product_db`
- **Assigned Member**: Member 2
- **Collection Purpose**: Manufacturer guarantee terms, coverage details, exclusions, and claim SLAs
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `warrantyId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a2000000000000000010')` | Internal ID |
| `warrantyId` | `String` | **Required** | `UK` | `WAR-10001` | Unique warranty policy identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Foreign key reference to products.productId |
| `warrantyPeriodMonths` | `Number` | **Required** | `NONE` | `12` | Duration of validity in months |
| `warrantyType` | `String` | **Required** | `NONE` | `MANUFACTURER` | MANUFACTURER, EXTENDED, SELLER |
| `coverageDetails` | `String` | **Required** | `NONE` | `Covers internal hardware defects, motherboard, and battery replacement` | Scope of policy |
| `exclusions` | `String` | **Required** | `NONE` | `Physical drop damage, liquid ingress, unauthorized third-party repairs` | Policy exclusions |
| `claimProcess` | `String` | **Required** | `NONE` | `Visit authorized brand service center with tax invoice` | Customer SOP for claims |
| `supportContactPhone` | `String` | **Required** | `NONE` | `1800-102-8411` | Toll-free customer hotline |
| `supportWebsite` | `String` | **Required** | `NONE` | `https://service.oneplus.in` | Service booking portal URL |
| `isTransferable` | `Boolean` | **Required** | `NONE` | `false` | Whether transferable upon resale |
| `hasFreeExtendedOption` | `Boolean` | **Required** | `NONE` | `true` | Qualifies for free 6-month extension |
| `updatedAt` | `Date` | **Required** | `NONE` | `2023-12-01T10:00:00Z` | Policy update timestamp |


---

## Database 3: `order_db`
**Assigned Student**: Member 3  
**Domain Scope**: Order Processing, Fulfilment, Logistics & Lifecycle  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `orders` | Master sales transactions containing monetary totals, customer keys, and statuses | **15** | `orderId` |
| 2 | `order_items` | Itemized line entries linking orders to products, variants, quantities, and prices | **12** | `orderItemId` |
| 3 | `order_status` | Chronological status transition audit log with actor signatures and notifications | **11** | `statusHistoryId` |
| 4 | `shipments` | Logistics carrier dispatches, consignment weights, AWB numbers, and tracking | **12** | `shipmentId` |
| 5 | `delivery_addresses` | Snapshot of delivery destination address frozen at the time order was locked | **14** | `deliveryAddressId` |
| 6 | `returns` | Customer return requests, inspection audits, pickup tracking, and reasons | **13** | `returnId` |
| 7 | `refunds` | Reversals, payment reimbursements, banking references, and payout settlements | **13** | `refundId` |
| 8 | `coupons` | Promotional vouchers, minimum cart thresholds, redemption caps, and validity | **13** | `couponId` |
| 9 | `order_tracking` | Granular GPS checkpoint pings, transit hubs, and rider telemetry | **12** | `trackingId` |
| 10 | `cancellations` | Pre-dispatch or transit cancellations, fees, and reasons | **12** | `cancellationId` |

---

### 3.1 Collection: `orders`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Master sales transactions containing monetary totals, customer keys, and statuses
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `orderId`
- **Total Defined Fields**: **15 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000001')` | Internal ID |
| `orderId` | `String` | **Required** | `UK` | `ORD-10001` | Global unique order identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `orderDate` | `Date` | **Required** | `INDEX` | `2024-03-15T14:32:00Z` | Timestamp order was placed |
| `totalItemCount` | `Number` | **Required** | `NONE` | `3` | Total quantity of items in order |
| `subtotalAmountINR` | `Number` | **Required** | `NONE` | `74997` | Gross item price subtotal in INR |
| `discountAmountINR` | `Number` | **Required** | `NONE` | `5000` | Coupon/promotion discount applied |
| `taxAmountINR` | `Number` | **Required** | `NONE` | `12599` | Total GST collected |
| `shippingFeeINR` | `Number` | **Required** | `NONE` | `0` | Delivery charge in INR |
| `totalAmountINR` | `Number` | **Required** | `INDEX` | `82596` | Final net payable amount in INR |
| `orderStatus` | `String` | **Required** | `INDEX` | `DELIVERED` | PLACED, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, RETURNED |
| `paymentStatus` | `String` | **Required** | `INDEX` | `PAID` | PENDING, PAID, FAILED, REFUNDED |
| `paymentId` | `String` | **Required** | `FK` | `PAY-10001` | Logical reference to payment_db.payments.paymentId |
| `shippingAddressId` | `String` | **Required** | `FK` | `DELV-10001` | Foreign key reference to delivery_addresses.deliveryAddressId |
| `orderTags` | `Array` | **Required** | `NONE` | `["EXPRESS_DELIVERY","GIFT_PACKED"]` | Order fulfillment tags array for $in and $elemMatch filtering |

### 3.2 Collection: `order_items`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Itemized line entries linking orders to products, variants, quantities, and prices
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `orderItemId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000002')` | Internal ID |
| `orderItemId` | `String` | **Required** | `UK` | `ITEM-10001` | Unique line item identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `variantId` | `String` | **Required** | `FK` | `VAR-10001` | Logical reference to product_db.product_variants.variantId |
| `quantity` | `Number` | **Required** | `NONE` | `1` | Units ordered |
| `unitPriceINR` | `Number` | **Required** | `NONE` | `59999` | Unit selling price locked at checkout |
| `discountAppliedINR` | `Number` | **Required** | `NONE` | `2000` | Item-level discount in INR |
| `taxRatePercentage` | `Number` | **Required** | `NONE` | `18` | Applicable GST slab |
| `totalItemPriceINR` | `Number` | **Required** | `NONE` | `68439` | Final line amount inclusive of tax and discounts |
| `fulfillmentStatus` | `String` | **Required** | `NONE` | `DELIVERED` | PACKED, SHIPPED, DELIVERED, CANCELLED |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Logical reference to inventory_db.warehouses.warehouseId |

### 3.3 Collection: `order_status`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Chronological status transition audit log with actor signatures and notifications
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `statusHistoryId`
- **Total Defined Fields**: **11 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000003')` | Internal ID |
| `statusHistoryId` | `String` | **Required** | `UK` | `STAT-10001` | Unique audit event identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `previousStatus` | `String` | **Required** | `NONE` | `PLACED` | Previous state |
| `newStatus` | `String` | **Required** | `NONE` | `CONFIRMED` | Updated state |
| `changedBy` | `String` | **Required** | `NONE` | `SYSTEM_AUTO` | Actor: SYSTEM_AUTO, ADMIN_EMP_401, SELLER |
| `remarks` | `String` | **Required** | `NONE` | `Payment verified via Razorpay gateway, order forwarded to warehouse` | Transition comments |
| `isCustomerNotified` | `Boolean` | **Required** | `NONE` | `true` | SMS/Email notification dispatched |
| `notificationChannel` | `String` | **Required** | `NONE` | `SMS_AND_WHATSAPP` | Dispatch channel |
| `estimatedDeliveryDate` | `Date` | **Required** | `NONE` | `2024-03-19T18:00:00Z` | Promised customer delivery date |
| `timestamp` | `Date` | **Required** | `INDEX` | `2024-03-15T14:35:10Z` | Event timestamp |

### 3.4 Collection: `shipments`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Logistics carrier dispatches, consignment weights, AWB numbers, and tracking
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `shipmentId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000004')` | Internal ID |
| `shipmentId` | `String` | **Required** | `UK` | `SHIP-10001` | Unique consignment identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `carrierName` | `String` | **Required** | `NONE` | `BlueDart` | BlueDart, Delhivery, Ekart, Shadowfax |
| `trackingNumber` | `String` | **Required** | `UK` | `BLUEDART-IND-98234110` | Consignment Waybill / AWB |
| `dispatchDate` | `Date` | **Required** | `NONE` | `2024-03-16T11:00:00Z` | Handover to 3PL date |
| `deliveredDate` | `Date` | Optional | `NONE` | `2024-03-18T16:30:00Z` | Successful delivery timestamp |
| `shippingStatus` | `String` | **Required** | `INDEX` | `DELIVERED` | IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, DELAYED, RTO |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Logical reference to inventory_db.warehouses.warehouseId |
| `weightKg` | `Number` | **Required** | `NONE` | `0.85` | Physical package weight |
| `shippingCostINR` | `Number` | **Required** | `NONE` | `140` | Carrier freight invoice cost |
| `signatureProofRequired` | `Boolean` | **Required** | `NONE` | `true` | Mandates OTP / physical signature |

### 3.5 Collection: `delivery_addresses`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Snapshot of delivery destination address frozen at the time order was locked
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `deliveryAddressId`
- **Total Defined Fields**: **14 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000005')` | Internal ID |
| `deliveryAddressId` | `String` | **Required** | `UK` | `DELV-10001` | Unique delivery destination identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `recipientName` | `String` | **Required** | `NONE` | `Aarav Sharma` | Consignee full name |
| `contactNumber` | `String` | **Required** | `NONE` | `+91-9876543210` | Primary phone for courier |
| `alternateNumber` | `String` | Optional | `NONE` | `+91-9876543211` | Backup phone |
| `addressLine1` | `String` | **Required** | `NONE` | `Flat 402, Prestige Palms` | House / Flat / Building info |
| `addressLine2` | `String` | **Required** | `NONE` | `12th Main Road, 5th Block, Koramangala` | Street / Area |
| `landmark` | `String` | Optional | `NONE` | `Near Forum Mall` | Prominent landmark |
| `city` | `String` | **Required** | `INDEX` | `Bengaluru` | Delivery city |
| `state` | `String` | **Required** | `NONE` | `Karnataka` | Delivery state |
| `pinCode` | `String` | **Required** | `INDEX` | `560034` | 6-digit postal PIN |
| `deliveryType` | `String` | **Required** | `NONE` | `HOME` | HOME, OFFICE, SECURE_HUB |

### 3.6 Collection: `returns`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Customer return requests, inspection audits, pickup tracking, and reasons
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `returnId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000006')` | Internal ID |
| `returnId` | `String` | **Required** | `UK` | `RET-10001` | Unique return authorization identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `orderItemId` | `String` | **Required** | `FK` | `ITEM-10001` | Foreign key reference to order_items.orderItemId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `returnReason` | `String` | **Required** | `NONE` | `DEFECTIVE_ITEM` | DEFECTIVE_ITEM, WRONG_SIZE, DIFFERENT_FROM_DESCRIPTION, TRANSIT_DAMAGE |
| `returnStatus` | `String` | **Required** | `INDEX` | `INSPECTED` | REQUESTED, APPROVED, PICKUP_SCHEDULED, PICKED_UP, INSPECTED, REJECTED |
| `itemCondition` | `String` | **Required** | `NONE` | `OPEN_BOX_DEFECT` | SEALED, OPEN_BOX_DEFECT, DAMAGED |
| `pickupCarrier` | `String` | **Required** | `NONE` | `Delhivery Reverse Logistics` | Reverse 3PL partner |
| `pickupTrackingNumber` | `String` | **Required** | `NONE` | `DELH-REV-492019` | Reverse AWB |
| `inspectionRemarks` | `String` | **Required** | `NONE` | `Verified hardware display issue reported by customer` | Warehouse inspector notes |
| `requestDate` | `Date` | **Required** | `NONE` | `2024-03-20T10:00:00Z` | Return initiated date |
| `resolvedDate` | `Date` | Optional | `NONE` | `2024-03-23T14:00:00Z` | Inspection completed date |

### 3.7 Collection: `refunds`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Reversals, payment reimbursements, banking references, and payout settlements
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `refundId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000007')` | Internal ID |
| `refundId` | `String` | **Required** | `UK` | `REF-10001` | Unique refund record identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `returnId` | `String` | Optional | `FK` | `RET-10001` | Foreign key reference to returns.returnId |
| `paymentId` | `String` | **Required** | `FK` | `PAY-10001` | Logical reference to payment_db.payments.paymentId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `refundAmountINR` | `Number` | **Required** | `NONE` | `59999` | Refunded amount in INR |
| `refundMethod` | `String` | **Required** | `NONE` | `ORIGINAL_PAYMENT_SOURCE` | ORIGINAL_PAYMENT_SOURCE, WALLET, BANK_TRANSFER |
| `refundStatus` | `String` | **Required** | `INDEX` | `SUCCESS` | INITIATED, PROCESSING, SUCCESS, FAILED |
| `gatewayReferenceNumber` | `String` | **Required** | `NONE` | `ARN-892301984210` | Bank UTR / Acquirer Reference Number |
| `processedBy` | `String` | **Required** | `NONE` | `FINANCE_ADMIN_02` | Admin or automation actor |
| `initiatedAt` | `Date` | **Required** | `NONE` | `2024-03-24T11:00:00Z` | Initiation timestamp |
| `completedAt` | `Date` | Optional | `NONE` | `2024-03-25T16:20:00Z` | Settlement completion timestamp |

### 3.8 Collection: `coupons`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Promotional vouchers, minimum cart thresholds, redemption caps, and validity
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `couponId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000008')` | Internal ID |
| `couponId` | `String` | **Required** | `UK` | `COUP-10001` | Unique coupon master identifier |
| `couponCode` | `String` | **Required** | `UK` | `DIWALI2024` | Case-insensitive coupon voucher string |
| `discountType` | `String` | **Required** | `NONE` | `PERCENTAGE` | PERCENTAGE, FLAT_INR |
| `discountAmount` | `Number` | **Required** | `NONE` | `10` | Value in % or INR |
| `minOrderValueINR` | `Number` | **Required** | `NONE` | `2000` | Minimum order threshold |
| `maxDiscountLimitINR` | `Number` | **Required** | `NONE` | `1500` | Cap on total discount in INR |
| `validFrom` | `Date` | **Required** | `NONE` | `2024-03-01T00:00:00Z` | Valid start date |
| `validUntil` | `Date` | **Required** | `NONE` | `2024-12-31T23:59:59Z` | Expiry date |
| `usageLimitTotal` | `Number` | **Required** | `NONE` | `10000` | Global pool limit |
| `usageLimitPerUser` | `Number` | **Required** | `NONE` | `1` | Max per customer |
| `currentUsageCount` | `Number` | **Required** | `NONE` | `3410` | Redemptions used so far |
| `isActive` | `Boolean` | **Required** | `INDEX` | `true` | Activation status |

### 3.9 Collection: `order_tracking`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Granular GPS checkpoint pings, transit hubs, and rider telemetry
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `trackingId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000009')` | Internal ID |
| `trackingId` | `String` | **Required** | `UK` | `TRK-10001` | Unique tracking checkpoint ping identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `shipmentId` | `String` | **Required** | `FK` | `SHIP-10001` | Foreign key reference to shipments.shipmentId |
| `checkpointLocation` | `String` | **Required** | `NONE` | `Bengaluru Central Hub` | Hub facility or city name |
| `checkpointStatus` | `String` | **Required** | `NONE` | `SORTING_COMPLETED` | PACKAGE_RECEIVED, SORTING_COMPLETED, DEPARTED_FACILITY, OUT_FOR_DELIVERY, DELIVERED |
| `checkpointTimestamp` | `Date` | **Required** | `INDEX` | `2024-03-17T08:30:00Z` | UTC time of scan |
| `carrierRemarks` | `String` | **Required** | `NONE` | `Arrived at local sorting center` | Logistics update comment |
| `latitude` | `Number` | **Required** | `NONE` | `12.9352` | GPS latitude |
| `longitude` | `Number` | **Required** | `NONE` | `77.6245` | GPS longitude |
| `deliveryPartnerPhone` | `String` | Optional | `NONE` | `+91-9876500112` | Assigned delivery rider phone |
| `isException` | `Boolean` | **Required** | `NONE` | `false` | Whether delivery exception occurred |

### 3.10 Collection: `cancellations`
- **Database**: `order_db`
- **Assigned Member**: Member 3
- **Collection Purpose**: Pre-dispatch or transit cancellations, fees, and reasons
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `cancellationId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a3000000000000000010')` | Internal ID |
| `cancellationId` | `String` | **Required** | `UK` | `CANC-10001` | Unique cancellation identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `cancelledAt` | `Date` | **Required** | `NONE` | `2024-03-15T16:00:00Z` | Cancellation timestamp |
| `reasonCategory` | `String` | **Required** | `NONE` | `FOUND_CHEAPER_ELSEWHERE` | ORDERED_BY_MISTAKE, FOUND_CHEAPER_ELSEWHERE, DELIVERY_TIME_TOO_LONG, ADDRESS_CHANGE |
| `detailedReason` | `String` | **Required** | `NONE` | `Found lower price on another seller platform` | Customer comment |
| `cancellationStage` | `String` | **Required** | `NONE` | `PRE_DISPATCH` | PRE_DISPATCH, PACKED, IN_TRANSIT |
| `isRefundRequired` | `Boolean` | **Required** | `NONE` | `true` | Flag to trigger automated refund |
| `cancellationFeeINR` | `Number` | **Required** | `NONE` | `0` | Cancellation penalty charge in INR |
| `approvalStatus` | `String` | **Required** | `INDEX` | `APPROVED_INSTANT` | APPROVED_INSTANT, MANUAL_REVIEW, REJECTED |
| `handledBy` | `String` | **Required** | `NONE` | `SYSTEM_AUTO` | Approving authority |


---

## Database 4: `inventory_db`
**Assigned Student**: Member 4  
**Domain Scope**: Warehousing, Supplier Procurement & Stock Control  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `inventory` | Current on-hand stock quantities, reserved allocations, and safety reorder levels | **13** | `inventoryId` |
| 2 | `warehouses` | Fulfillment center locations, square footage, manager details, and operating status | **14** | `warehouseId` |
| 3 | `suppliers` | Vendor master records, GSTIN identification, credit terms, and performance ratings | **13** | `supplierId` |
| 4 | `stock_movements` | Inbound, outbound, and inter-warehouse physical stock transfer ledger | **12** | `movementId` |
| 5 | `purchase_orders` | B2B procurement contracts issued to suppliers with monetary totals and SLAs | **13** | `purchaseOrderId` |
| 6 | `purchase_items` | Itemized line items within procurement POs with unit costs and quality inspection | **12** | `purchaseItemId` |
| 7 | `restock_requests` | Automated or manual stock replenishment triggers, urgency levels, and workflows | **12** | `requestId` |
| 8 | `damaged_stock` | Damaged inventory tracking, loss estimations, insurance claims, and write-offs | **13** | `damageId` |
| 9 | `warehouse_staff` | Personnel assignments, shift schedules, roles, and emergency contact registries | **12** | `staffId` |
| 10 | `inventory_alerts` | Automated threshold alerts, stock depletion warnings, and operational notifications | **12** | `alertId` |

---

### 4.1 Collection: `inventory`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Current on-hand stock quantities, reserved allocations, and safety reorder levels
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `inventoryId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000001')` | Internal ID |
| `inventoryId` | `String` | **Required** | `UK` | `INV-10001` | Unique inventory record identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `variantId` | `String` | **Required** | `FK` | `VAR-10001` | Logical reference to product_db.product_variants.variantId |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `quantityAvailable` | `Number` | **Required** | `INDEX` | `120` | Pickable free physical stock |
| `quantityReserved` | `Number` | **Required** | `NONE` | `15` | Allocated to in-flight orders awaiting dispatch |
| `reorderThreshold` | `Number` | **Required** | `NONE` | `25` | Minimum trigger stock level |
| `reorderQuantity` | `Number` | **Required** | `NONE` | `100` | Standard batch size to restock |
| `aisleLocation` | `String` | **Required** | `NONE` | `Aisle 4, Bay B, Shelf 2` | Physical warehouse bin code |
| `unitCostINR` | `Number` | **Required** | `NONE` | `48000` | Procurement cost per unit in INR |
| `stockStatus` | `String` | **Required** | `INDEX` | `IN_STOCK` | IN_STOCK, LOW_STOCK, OUT_OF_STOCK, OVERSTOCKED |
| `lastAuditDate` | `Date` | **Required** | `NONE` | `2024-03-01T00:00:00Z` | Last physical stock audit |

### 4.2 Collection: `warehouses`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Fulfillment center locations, square footage, manager details, and operating status
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `warehouseId`
- **Total Defined Fields**: **14 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000002')` | Internal ID |
| `warehouseId` | `String` | **Required** | `UK` | `WH-10001` | Unique warehouse identifier |
| `warehouseName` | `String` | **Required** | `NONE` | `South India Mega Fulfillment Center` | Facility commercial name |
| `warehouseCode` | `String` | **Required** | `UK` | `WH-BLR-01` | Short mnemonic code |
| `city` | `String` | **Required** | `INDEX` | `Bengaluru` | Warehouse city |
| `state` | `String` | **Required** | `NONE` | `Karnataka` | Warehouse state |
| `postalCode` | `String` | **Required** | `NONE` | `560099` | Postal PIN code |
| `totalCapacitySqFt` | `Number` | **Required** | `NONE` | `150000` | Floor capacity in square feet |
| `occupiedCapacitySqFt` | `Number` | **Required** | `NONE` | `112000` | Utilized square footage |
| `managerName` | `String` | **Required** | `NONE` | `Raghavendra Rao` | Site manager in-charge |
| `managerContact` | `String` | **Required** | `NONE` | `+91-9876512345` | Direct contact phone |
| `operatingStatus` | `String` | **Required** | `NONE` | `OPERATIONAL` | OPERATIONAL, MAINTENANCE, CLOSED |
| `isColdStorageCapable` | `Boolean` | **Required** | `NONE` | `false` | Temperature-controlled zones |
| `geoCoordinates` | `Object` | **Required** | `NONE` | `{"latitude":12.9716,"longitude":77.5946}` | Nested geographic coordinates object for spatial and dot-notation querying |

### 4.3 Collection: `suppliers`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Vendor master records, GSTIN identification, credit terms, and performance ratings
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `supplierId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000003')` | Internal ID |
| `supplierId` | `String` | **Required** | `UK` | `SUP-10001` | Unique supplier identifier |
| `companyName` | `String` | **Required** | `INDEX` | `Techtronics Distribution India Pvt Ltd` | Registered corporate name |
| `gstin` | `String` | **Required** | `UK` | `29AAACT1982K1Z5` | 15-character Indian GST identification |
| `contactPerson` | `String` | **Required** | `NONE` | `Suresh Menghrajani` | Account executive |
| `email` | `String` | **Required** | `NONE` | `procurement@techtronics.co.in` | Corporate billing email |
| `phone` | `String` | **Required** | `NONE` | `+91-9820011223` | Corporate contact number |
| `city` | `String` | **Required** | `NONE` | `Mumbai` | Corporate headquarters city |
| `state` | `String` | **Required** | `NONE` | `Maharashtra` | Corporate state |
| `ratingScore` | `Number` | **Required** | `NONE` | `4.8` | Supplier reliability score (1.0 to 5.0) |
| `paymentTermsDays` | `Number` | **Required** | `NONE` | `30` | Credit duration in days (e.g. Net 30) |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, INACTIVE, BLACKLISTED |
| `supplierCategory` | `String` | **Required** | `NONE` | `PRIMARY_OEM` | PRIMARY_OEM, AUTHORIZED_DISTRIBUTOR, THIRD_PARTY |

### 4.4 Collection: `stock_movements`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Inbound, outbound, and inter-warehouse physical stock transfer ledger
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `movementId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000004')` | Internal ID |
| `movementId` | `String` | **Required** | `UK` | `MOV-10001` | Unique stock transfer identifier |
| `inventoryId` | `String` | **Required** | `FK` | `INV-10001` | Foreign key reference to inventory.inventoryId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `sourceWarehouseId` | `String` | **Required** | `FK` | `WH-10001` | Origin warehouse |
| `destinationWarehouseId` | `String` | **Required** | `NONE` | `WH-10002` | Destination warehouse or customer |
| `movementType` | `String` | **Required** | `INDEX` | `INTERNAL_TRANSFER` | INBOUND_PURCHASE, OUTBOUND_SALES, INTERNAL_TRANSFER, DAMAGE_WRITE_OFF, RETURN_RESTOCK |
| `quantity` | `Number` | **Required** | `NONE` | `50` | Quantity of units moved |
| `reason` | `String` | **Required** | `NONE` | `Stock balancing for upcoming festival sale` | Operational rationale |
| `authorizedBy` | `String` | **Required** | `NONE` | `EMP-5002 - Rajesh Varma` | Approving logistics supervisor |
| `movementDate` | `Date` | **Required** | `INDEX` | `2024-03-10T11:45:00Z` | Date and time executed |
| `status` | `String` | **Required** | `NONE` | `COMPLETED` | COMPLETED, IN_TRANSIT, CANCELLED |

### 4.5 Collection: `purchase_orders`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: B2B procurement contracts issued to suppliers with monetary totals and SLAs
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `purchaseOrderId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000005')` | Internal ID |
| `purchaseOrderId` | `String` | **Required** | `UK` | `PO-10001` | Unique purchase order contract identifier |
| `supplierId` | `String` | **Required** | `FK` | `SUP-10001` | Foreign key reference to suppliers.supplierId |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `orderDate` | `Date` | **Required** | `NONE` | `2024-02-20T10:00:00Z` | PO issue date |
| `expectedDeliveryDate` | `Date` | **Required** | `NONE` | `2024-03-02T18:00:00Z` | SLA target delivery |
| `actualDeliveryDate` | `Date` | Optional | `NONE` | `2024-03-01T15:00:00Z` | Inward receipt date |
| `totalAmountINR` | `Number` | **Required** | `NONE` | `2400000` | Gross invoice amount in INR |
| `paymentTerms` | `String` | **Required** | `NONE` | `NET_30_DAYS` | NET_30_DAYS, ADVANCE_50, COD |
| `poStatus` | `String` | **Required** | `INDEX` | `RECEIVED` | DRAFT, ISSUED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED |
| `taxAmountINR` | `Number` | **Required** | `NONE` | `432000` | GST input credit in INR |
| `approvedBy` | `String` | **Required** | `NONE` | `Manoj Kulkarni` | Procurement Director approval |
| `notes` | `String` | Optional | `NONE` | `Q1 bulk replenishment for flagship smartphones` | Commercial notes |

### 4.6 Collection: `purchase_items`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Itemized line items within procurement POs with unit costs and quality inspection
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `purchaseItemId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000006')` | Internal ID |
| `purchaseItemId` | `String` | **Required** | `UK` | `POITEM-10001` | Unique PO line item identifier |
| `purchaseOrderId` | `String` | **Required** | `FK` | `PO-10001` | Foreign key reference to purchase_orders.purchaseOrderId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `variantId` | `String` | **Required** | `FK` | `VAR-10001` | Logical reference to product_db.product_variants.variantId |
| `quantityOrdered` | `Number` | **Required** | `NONE` | `50` | Units requested |
| `quantityReceived` | `Number` | **Required** | `NONE` | `50` | Units inwarded after QC |
| `unitCostINR` | `Number` | **Required** | `NONE` | `48000` | Contracted purchase price in INR |
| `taxPercentage` | `Number` | **Required** | `NONE` | `18` | Input GST rate |
| `lineTotalINR` | `Number` | **Required** | `NONE` | `2832000` | Total line expenditure with GST |
| `qualityCheckStatus` | `String` | **Required** | `NONE` | `PASSED` | PASSED, FAILED_PARTIAL, PENDING_INSPECTION |
| `batchNumber` | `String` | **Required** | `NONE` | `BATCH-2024-Q1-OP` | Manufacturer manufacturing lot code |

### 4.7 Collection: `restock_requests`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Automated or manual stock replenishment triggers, urgency levels, and workflows
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `requestId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000007')` | Internal ID |
| `requestId` | `String` | **Required** | `UK` | `RESTOCK-10001` | Unique restock ticket identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `currentStockLevel` | `Number` | **Required** | `NONE` | `12` | Stock level when restock was triggered |
| `requestedQuantity` | `Number` | **Required** | `NONE` | `150` | Units needed to restore safety buffer |
| `urgencyLevel` | `String` | **Required** | `INDEX` | `HIGH` | LOW, MEDIUM, HIGH, CRITICAL |
| `requestReason` | `String` | **Required** | `NONE` | `BELOW_SAFETY_STOCK` | BELOW_SAFETY_STOCK, FLASH_SALE_FORECAST, BULK_B2B_RESERVATION |
| `requestedBy` | `String` | **Required** | `NONE` | `Ananya Sen (Inventory Analyst)` | Requesting employee or system trigger |
| `status` | `String` | **Required** | `INDEX` | `APPROVED` | PENDING_APPROVAL, APPROVED, PO_CREATED, REJECTED |
| `targetDate` | `Date` | **Required** | `NONE` | `2024-03-25T00:00:00Z` | Deadline to avoid stockout |
| `createdAt` | `Date` | **Required** | `NONE` | `2024-03-12T09:30:00Z` | Request creation date |

### 4.8 Collection: `damaged_stock`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Damaged inventory tracking, loss estimations, insurance claims, and write-offs
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `damageId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000008')` | Internal ID |
| `damageId` | `String` | **Required** | `UK` | `DMG-10001` | Unique damage loss record identifier |
| `inventoryId` | `String` | **Required** | `FK` | `INV-10001` | Foreign key reference to inventory.inventoryId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `quantityDamaged` | `Number` | **Required** | `NONE` | `3` | Defective / damaged units |
| `damageType` | `String` | **Required** | `NONE` | `TRANSIT_IMPACT` | TRANSIT_IMPACT, WATER_LEAKAGE, DROPPED_IN_BAY, MANUFACTURING_DEFECT |
| `estimatedLossINR` | `Number` | **Required** | `NONE` | `144000` | Total book cost loss in INR |
| `insuranceClaimed` | `Boolean` | **Required** | `NONE` | `true` | Insurance compensation requested |
| `insuranceClaimId` | `String` | Optional | `NONE` | `INS-CLAIM-8921` | Insurance reference number |
| `dispositionAction` | `String` | **Required** | `NONE` | `RETURN_TO_OEM` | SALVAGE_FOR_PARTS, RETURN_TO_OEM, TOTAL_SCRAP, REFURBISH |
| `reportedBy` | `String` | **Required** | `NONE` | `EMP-WH-309` | Warehouse supervisor employee ID |
| `reportedDate` | `Date` | **Required** | `NONE` | `2024-03-14T16:00:00Z` | Damage logging date |

### 4.9 Collection: `warehouse_staff`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Personnel assignments, shift schedules, roles, and emergency contact registries
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `staffId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000009')` | Internal ID |
| `staffId` | `String` | **Required** | `UK` | `STF-10001` | Unique employee identification code |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `fullName` | `String` | **Required** | `NONE` | `Karthik Subramanian` | Employee full legal name |
| `role` | `String` | **Required** | `INDEX` | `INVENTORY_SUPERVISOR` | WAREHOUSE_MANAGER, INVENTORY_SUPERVISOR, FORKLIFT_OPERATOR, QUALITY_INSPECTOR, PICKER_PACKER |
| `shiftType` | `String` | **Required** | `NONE` | `MORNING` | MORNING, EVENING, NIGHT, ROTATIONAL |
| `phone` | `String` | **Required** | `NONE` | `+91-9845012399` | Contact mobile number |
| `email` | `String` | **Required** | `NONE` | `karthik.subramanian@smartecom.in` | Official corporate email |
| `salaryINR` | `Number` | **Required** | `NONE` | `45000` | Monthly salary in INR |
| `dateOfJoining` | `Date` | **Required** | `NONE` | `2022-04-01T00:00:00Z` | Employment commencement date |
| `isActive` | `Boolean` | **Required** | `NONE` | `true` | Active employee status |
| `emergencyContact` | `String` | **Required** | `NONE` | `+91-9845099887` | Emergency next of kin contact |

### 4.10 Collection: `inventory_alerts`
- **Database**: `inventory_db`
- **Assigned Member**: Member 4
- **Collection Purpose**: Automated threshold alerts, stock depletion warnings, and operational notifications
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `alertId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a4000000000000000010')` | Internal ID |
| `alertId` | `String` | **Required** | `UK` | `ALT-10001` | Unique operational alert identifier |
| `warehouseId` | `String` | **Required** | `FK` | `WH-10001` | Foreign key reference to warehouses.warehouseId |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `alertType` | `String` | **Required** | `INDEX` | `LOW_STOCK_THRESHOLD` | OUT_OF_STOCK, LOW_STOCK_THRESHOLD, EXPIRY_WARNING, TEMPERATURE_BREACH, STOCK_MISMATCH |
| `severity` | `String` | **Required** | `NONE` | `WARNING` | INFO, WARNING, CRITICAL |
| `message` | `String` | **Required** | `NONE` | `Stock level for OnePlus 12 5G (Flowy Emerald) is 12 units, below safety threshold 25` | Descriptive alert message |
| `isAcknowledged` | `Boolean` | **Required** | `NONE` | `false` | Reviewed by staff |
| `acknowledgedBy` | `String` | Optional | `NONE` | `None` | Staff member name who acknowledged |
| `acknowledgedAt` | `Date` | Optional | `NONE` | `null` | Acknowledgment timestamp |
| `autoRestockTriggered` | `Boolean` | **Required** | `NONE` | `true` | Whether automatic purchase order was generated |
| `createdAt` | `Date` | **Required** | `INDEX` | `2024-03-12T09:31:00Z` | Alert creation timestamp |


---

## Database 5: `payment_db`
**Assigned Student**: Member 5  
**Domain Scope**: Payment Processing, Invoicing, Taxes & Wallet Balances  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `payments` | Master payment transaction records, gateway charges, and settlement states | **13** | `paymentId` |
| 2 | `transactions` | Detailed bank ledger charges, captures, reversals, and settlement batches | **12** | `transactionId` |
| 3 | `invoices` | Legal GST tax invoices, CGST/SGST/IGST breakdowns, and PDF URLs | **15** | `invoiceId` |
| 4 | `payment_methods` | RBI-compliant tokenized cards, UPI VPA handles, and saved customer instruments | **12** | `methodId` |
| 5 | `refund_transactions` | Banking refund disbursements, payment gateway reversal tokens, and speed tiers | **13** | `refundTxnId` |
| 6 | `tax_records` | Statutory GSTR compliance, fiscal quarter reporting, and HSN/SAC classifications | **14** | `taxRecordId` |
| 7 | `wallets` | Stored-value digital balances, instant cashback pools, and daily spend limits | **12** | `walletId` |
| 8 | `offers` | Instant banking partnership cashback campaigns, credit card discounts, and validity | **13** | `offerId` |
| 9 | `financial_summary` | Periodic aggregate GMV, net revenue, refunds, gateway commissions, and success ratios | **13** | `summaryId` |
| 10 | `payment_failures` | Error diagnosis, bank failure codes, device metadata, and cart recovery tracking | **13** | `failureId` |

---

### 5.1 Collection: `payments`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Master payment transaction records, gateway charges, and settlement states
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `paymentId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000001')` | Internal ID |
| `paymentId` | `String` | **Required** | `UK` | `PAY-10001` | Global unique payment transaction identifier |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `amountINR` | `Number` | **Required** | `INDEX` | `82596` | Settled transaction amount in INR |
| `currency` | `String` | **Required** | `NONE` | `INR` | Transaction currency |
| `paymentGateway` | `String` | **Required** | `NONE` | `RAZORPAY` | RAZORPAY, PAYTM, STRIPE, PHONEPE, CASHFREE |
| `paymentMethodType` | `String` | **Required** | `INDEX` | `UPI` | UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, WALLET, COD |
| `paymentStatus` | `String` | **Required** | `INDEX` | `SUCCESS` | SUCCESS, PENDING, FAILED, REFUNDED, AUTHORIZED |
| `gatewayTransactionId` | `String` | **Required** | `UK` | `pay_Nz1984K92jd91s` | External 3rd party gateway reference |
| `gatewayFeeINR` | `Number` | **Required** | `NONE` | `165.19` | Gateway interchange fee |
| `taxDeductedINR` | `Number` | **Required** | `NONE` | `29.73` | GST levied on interchange fee |
| `createdAt` | `Date` | **Required** | `INDEX` | `2024-03-15T14:33:15Z` | Payment initiation UTC timestamp |

### 5.2 Collection: `transactions`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Detailed bank ledger charges, captures, reversals, and settlement batches
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `transactionId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000002')` | Internal ID |
| `transactionId` | `String` | **Required** | `UK` | `TXN-10001` | Unique ledger transaction reference |
| `paymentId` | `String` | **Required** | `FK` | `PAY-10001` | Foreign key reference to payments.paymentId |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `transactionType` | `String` | **Required** | `NONE` | `CAPTURE` | CHARGE, AUTHORIZATION, CAPTURE, REFUND, SETTLEMENT |
| `amountINR` | `Number` | **Required** | `NONE` | `82596` | Transaction magnitude in INR |
| `status` | `String` | **Required** | `INDEX` | `SETTLED` | SETTLED, PENDING, REVERSED, REJECTED |
| `bankReferenceNumber` | `String` | **Required** | `NONE` | `RRN-407412984120` | Bank RRN / UTR number |
| `issuingBank` | `String` | **Required** | `NONE` | `State Bank of India` | Customer issuing bank |
| `settlementBatchId` | `String` | **Required** | `NONE` | `BATCH-SETTLE-20240316` | Nodal bank settlement batch |
| `responseCode` | `String` | **Required** | `NONE` | `00_SUCCESS` | ISO-8583 banking response code |
| `transactedAt` | `Date` | **Required** | `NONE` | `2024-03-15T14:33:20Z` | Execution timestamp |

### 5.3 Collection: `invoices`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Legal GST tax invoices, CGST/SGST/IGST breakdowns, and PDF URLs
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `invoiceId`
- **Total Defined Fields**: **15 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000003')` | Internal ID |
| `invoiceId` | `String` | **Required** | `UK` | `INV-GST-10001` | Unique invoice system identifier |
| `invoiceNumber` | `String` | **Required** | `UK` | `SME-2024-03-8921` | Sequential statutory invoice number |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `paymentId` | `String` | **Required** | `FK` | `PAY-10001` | Foreign key reference to payments.paymentId |
| `sellerGSTIN` | `String` | **Required** | `NONE` | `29AAACS1234F1Z9` | Platform / Seller tax registration |
| `buyerGSTIN` | `String` | Optional | `NONE` | `None` | Customer B2B tax registration |
| `taxableAmountINR` | `Number` | **Required** | `NONE` | `69996` | Value before indirect taxes |
| `cgstAmountINR` | `Number` | **Required** | `NONE` | `6299.64` | Central GST (9%) in INR |
| `sgstAmountINR` | `Number` | **Required** | `NONE` | `6299.64` | State GST (9%) in INR |
| `igstAmountINR` | `Number` | **Required** | `NONE` | `0` | Interstate GST (18%) in INR |
| `totalInvoiceAmountINR` | `Number` | **Required** | `NONE` | `82596` | Final invoice sum inclusive of GST |
| `invoiceDate` | `Date` | **Required** | `INDEX` | `2024-03-15T14:35:00Z` | Statutory date of generation |
| `invoicePdfUrl` | `String` | **Required** | `NONE` | `https://cdn.smartecom.in/invoices/sme-2024-03-8921.pdf` | Secured PDF document link |

### 5.4 Collection: `payment_methods`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: RBI-compliant tokenized cards, UPI VPA handles, and saved customer instruments
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `methodId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000004')` | Internal ID |
| `methodId` | `String` | **Required** | `UK` | `METH-10001` | Unique payment method token identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `methodType` | `String` | **Required** | `INDEX` | `UPI` | UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING |
| `providerName` | `String` | **Required** | `NONE` | `Google Pay` | Google Pay, PhonePe, HDFC Visa, ICICI NetBanking |
| `maskedAccountNumber` | `String` | **Required** | `NONE` | `aarav@oksbi` | Masked card number or UPI handle |
| `cardExpiry` | `String` | Optional | `NONE` | `08/28` | MM/YY expiry format for cards |
| `cardHolderName` | `String` | **Required** | `NONE` | `Aarav Sharma` | Name embossed on card / bank account |
| `isDefault` | `Boolean` | **Required** | `NONE` | `true` | Preferred instrument for fast checkout |
| `tokenizedId` | `String` | **Required** | `NONE` | `tok_rbi_98124810924` | RBI-compliant token vault reference |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, EXPIRED, REVOKED |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-05-10T10:00:00Z` | Tokenization timestamp |

### 5.5 Collection: `refund_transactions`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Banking refund disbursements, payment gateway reversal tokens, and speed tiers
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `refundTxnId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000005')` | Internal ID |
| `refundTxnId` | `String` | **Required** | `UK` | `REFTXN-10001` | Unique payment refund transaction identifier |
| `refundId` | `String` | **Required** | `FK` | `REF-10001` | Foreign key reference to order_db.refunds.refundId |
| `paymentId` | `String` | **Required** | `FK` | `PAY-10001` | Foreign key reference to payments.paymentId |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `refundAmountINR` | `Number` | **Required** | `NONE` | `59999` | Amount credited back to buyer |
| `gatewayRefundId` | `String` | **Required** | `NONE` | `rfnd_Nz9281Ka9821` | Payment gateway reversal token |
| `payoutStatus` | `String` | **Required** | `INDEX` | `PROCESSED` | PROCESSED, INITIATED, REVERSED, FAILED |
| `payoutSpeed` | `String` | **Required** | `NONE` | `INSTANT_UPI` | INSTANT_UPI, STANDARD_BANK_3_DAYS |
| `arnReference` | `String` | **Required** | `NONE` | `ARN-892301984210` | Banking ARN tracking number |
| `initiatedAt` | `Date` | **Required** | `NONE` | `2024-03-24T11:05:00Z` | Disbursement start timestamp |
| `settledAt` | `Date` | **Required** | `NONE` | `2024-03-24T11:06:12Z` | Settled at destination bank |

### 5.6 Collection: `tax_records`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Statutory GSTR compliance, fiscal quarter reporting, and HSN/SAC classifications
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `taxRecordId`
- **Total Defined Fields**: **14 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000006')` | Internal ID |
| `taxRecordId` | `String` | **Required** | `UK` | `TAX-10001` | Unique statutory tax audit entry identifier |
| `invoiceId` | `String` | **Required** | `FK` | `INV-GST-10001` | Foreign key reference to invoices.invoiceId |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `financialYear` | `String` | **Required** | `INDEX` | `2023-2024` | Indian financial fiscal year |
| `taxQuarter` | `String` | **Required** | `NONE` | `Q4` | Fiscal quarter: Q1, Q2, Q3, Q4 |
| `stateJurisdiction` | `String` | **Required** | `NONE` | `Karnataka` | Tax assessment state |
| `hsnSacCode` | `String` | **Required** | `NONE` | `85171300` | HSN classification for smartphones |
| `taxableAmountINR` | `Number` | **Required** | `NONE` | `69996` | Base assessable value in INR |
| `cgstRate` | `Number` | **Required** | `NONE` | `9` | Central GST rate percentage |
| `sgstRate` | `Number` | **Required** | `NONE` | `9` | State GST rate percentage |
| `igstRate` | `Number` | **Required** | `NONE` | `0` | Integrated GST rate percentage |
| `totalTaxCollectedINR` | `Number` | **Required** | `NONE` | `12599.28` | Cumulative tax amount collected |
| `filingStatus` | `String` | **Required** | `NONE` | `REPORTED_GSTR1` | REPORTED_GSTR1, PENDING_FILING, RECONCILED |

### 5.7 Collection: `wallets`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Stored-value digital balances, instant cashback pools, and daily spend limits
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `walletId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000007')` | Internal ID |
| `walletId` | `String` | **Required** | `UK` | `WAL-10001` | Unique wallet account identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `currentBalanceINR` | `Number` | **Required** | `NONE` | `1500` | Liquid spendable wallet funds in INR |
| `cashbackBalanceINR` | `Number` | **Required** | `NONE` | `250` | Promotional cashback balance |
| `currency` | `String` | **Required** | `NONE` | `INR` | Wallet currency |
| `walletTier` | `String` | **Required** | `NONE` | `FULL_KYC` | FULL_KYC, MIN_KYC |
| `dailySpendLimitINR` | `Number` | **Required** | `NONE` | `25000` | Max spending per 24 hours |
| `monthlySpendLimitINR` | `Number` | **Required** | `NONE` | `100000` | Monthly velocity limit in INR |
| `isActive` | `Boolean` | **Required** | `NONE` | `true` | Wallet operational state |
| `lastTransactionAt` | `Date` | **Required** | `NONE` | `2024-04-05T18:22:00Z` | Last credit or debit timestamp |
| `createdAt` | `Date` | **Required** | `NONE` | `2023-01-20T10:00:00Z` | Wallet activation date |

### 5.8 Collection: `offers`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Instant banking partnership cashback campaigns, credit card discounts, and validity
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `offerId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000008')` | Internal ID |
| `offerId` | `String` | **Required** | `UK` | `OFF-10001` | Unique bank offer campaign identifier |
| `title` | `String` | **Required** | `NONE` | `HDFC Instant 10% Cashback on Electronics` | Promotional title |
| `description` | `String` | **Required** | `NONE` | `Get flat 10% instant discount up to ₹2000 on HDFC Bank Credit Cards` | Terms and conditions summary |
| `bankPartner` | `String` | **Required** | `INDEX` | `HDFC Bank` | HDFC Bank, ICICI Bank, SBI Card, Axis Bank |
| `paymentTypeRequired` | `String` | **Required** | `NONE` | `CREDIT_CARD` | CREDIT_CARD_EMI, CREDIT_CARD, UPI, ALL |
| `discountPercentage` | `Number` | **Required** | `NONE` | `10` | Discount percentage |
| `minOrderValueINR` | `Number` | **Required** | `NONE` | `15000` | Minimum transaction threshold |
| `maxDiscountINR` | `Number` | **Required** | `NONE` | `2000` | Maximum savings limit in INR |
| `validFrom` | `Date` | **Required** | `NONE` | `2024-03-01T00:00:00Z` | Campaign start date |
| `validUntil` | `Date` | **Required** | `NONE` | `2024-04-30T23:59:59Z` | Campaign expiration date |
| `isActive` | `Boolean` | **Required** | `INDEX` | `true` | Active offer switch |
| `totalTimesRedeemed` | `Number` | **Required** | `NONE` | `1280` | Usage metrics counter |

### 5.9 Collection: `financial_summary`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Periodic aggregate GMV, net revenue, refunds, gateway commissions, and success ratios
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `summaryId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000009')` | Internal ID |
| `summaryId` | `String` | **Required** | `UK` | `FIN-2024-03` | Unique financial reconciliation identifier |
| `periodType` | `String` | **Required** | `NONE` | `MONTHLY` | DAILY, WEEKLY, MONTHLY, ANNUAL |
| `periodIdentifier` | `String` | **Required** | `INDEX` | `2024-03` | Period key (YYYY-MM or YYYY-MM-DD) |
| `grossMerchandiseValueINR` | `Number` | **Required** | `NONE` | `15840000` | Total GMV in INR before cancellations |
| `netRevenueINR` | `Number` | **Required** | `NONE` | `14250000` | Net recognized revenue in INR |
| `totalTaxCollectedINR` | `Number` | **Required** | `NONE` | `2565000` | Total GST collected |
| `totalDiscountsGivenINR` | `Number` | **Required** | `NONE` | `1590000` | Platform discount subsidies |
| `totalRefundsIssuedINR` | `Number` | **Required** | `NONE` | `420000` | Total money returned to buyers |
| `gatewayChargesINR` | `Number` | **Required** | `NONE` | `285000` | Total gateway fees incurred |
| `successfulTransactionsCount` | `Number` | **Required** | `NONE` | `2480` | Number of completed payments |
| `failedTransactionsCount` | `Number` | **Required** | `NONE` | `112` | Number of failed attempts |
| `calculatedAt` | `Date` | **Required** | `NONE` | `2024-04-01T02:00:00Z` | Report calculation timestamp |

### 5.10 Collection: `payment_failures`
- **Database**: `payment_db`
- **Assigned Member**: Member 5
- **Collection Purpose**: Error diagnosis, bank failure codes, device metadata, and cart recovery tracking
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `failureId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a5000000000000000010')` | Internal ID |
| `failureId` | `String` | **Required** | `UK` | `FAIL-10001` | Unique payment exception log identifier |
| `paymentId` | `String` | Optional | `FK` | `PAY-10001` | Foreign key reference to payments.paymentId |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Foreign key reference to order_db.orders.orderId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Foreign key reference to customer_db.customers.customerId |
| `attemptedAmountINR` | `Number` | **Required** | `NONE` | `82596` | Transaction amount attempted |
| `paymentGateway` | `String` | **Required** | `NONE` | `RAZORPAY` | Gateway involved |
| `errorCode` | `String` | **Required** | `INDEX` | `GATEWAY_TIMEOUT` | GATEWAY_TIMEOUT, INSUFFICIENT_FUNDS, BANK_SERVER_DOWN, OTP_INCORRECT |
| `errorDescription` | `String` | **Required** | `NONE` | `Issuer bank server timed out during 3D-Secure OTP verification` | Detailed gateway diagnosis |
| `deviceInfo` | `String` | **Required** | `NONE` | `Chrome / Android Mobile` | Client hardware and browser info |
| `retryCount` | `Number` | **Required** | `NONE` | `2` | Consecutive attempt count |
| `isRecoveredLater` | `Boolean` | **Required** | `NONE` | `true` | Did user retry and succeed |
| `failedAt` | `Date` | **Required** | `INDEX` | `2024-03-15T14:30:10Z` | Failure event timestamp |


---

## Database 6: `analytics_db`
**Assigned Student**: Member 6  
**Domain Scope**: Reviews, Customer Metrics, Sales Aggregates & Recommendations  
**Collections Count**: 10 Collections  

| # | Collection Name | Purpose | Fields Count | Business Key |
|---|---|---|---|---|
| 1 | `reviews` | Customer written reviews, verified purchase verification, moderation status, and votes | **13** | `reviewId` |
| 2 | `ratings` | Multi-dimensional rating breakdown (battery, camera, build quality, value for money) | **12** | `ratingEntryId` |
| 3 | `product_feedback` | NLP sentiment analysis scores, bug reports, and packaging feedback tickets | **12** | `feedbackId` |
| 4 | `sales_daily` | Daily rolled-up sales, order volumes, discount totals, and average order values | **13** | `dailyMetricId` |
| 5 | `sales_monthly` | Monthly business performance metrics, return percentages, and top products | **14** | `monthlyMetricId` |
| 6 | `customer_metrics` | RFM scores (Recency, Frequency, Monetary), lifetime spend, and churn probability | **13** | `customerMetricId` |
| 7 | `product_metrics` | Conversion funnels, pageviews, cart adds, inventory turnover, and return rates | **13** | `productMetricId` |
| 8 | `category_metrics` | Category revenue contribution shares, month-on-month growth, and ASP | **13** | `categoryMetricId` |
| 9 | `search_history` | Customer search queries, click-through conversions, search latency, and zero-result audits | **12** | `searchId` |
| 10 | `recommendations` | ML personalized recommendation carousels, algorithmic scoring, impressions, and CTR | **12** | `recommendationId` |

---

### 6.1 Collection: `reviews`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Customer written reviews, verified purchase verification, moderation status, and votes
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `reviewId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000001')` | Internal ID |
| `reviewId` | `String` | **Required** | `UK` | `REV-10001` | Global unique review identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `orderId` | `String` | **Required** | `FK` | `ORD-10001` | Logical reference to order_db.orders.orderId |
| `rating` | `Number` | **Required** | `INDEX` | `5` | Overall star rating (1 to 5) |
| `reviewTitle` | `String` | **Required** | `NONE` | `Superb performance and camera quality!` | Headline summary |
| `reviewBody` | `String` | **Required** | `NONE` | `The Snapdragon 8 Gen 3 handles everything seamlessly. Battery lasts over a day easily.` | Detailed user feedback text |
| `isVerifiedBuyer` | `Boolean` | **Required** | `NONE` | `true` | Confirms order completion on platform |
| `helpfulVotesCount` | `Number` | **Required** | `NONE` | `42` | Helpful community upvotes |
| `unhelpfulVotesCount` | `Number` | **Required** | `NONE` | `2` | Downvotes |
| `reviewStatus` | `String` | **Required** | `INDEX` | `APPROVED` | APPROVED, PENDING_MODERATION, FLAGGED, REJECTED |
| `createdAt` | `Date` | **Required** | `INDEX` | `2024-03-22T19:40:00Z` | Review submission timestamp |

### 6.2 Collection: `ratings`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Multi-dimensional rating breakdown (battery, camera, build quality, value for money)
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `ratingEntryId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000002')` | Internal ID |
| `ratingEntryId` | `String` | **Required** | `UK` | `RAT-10001` | Unique rating measurement record |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `ratingValue` | `Number` | **Required** | `NONE` | `5` | Numerical score (1 to 5) |
| `ratingCategory` | `String` | **Required** | `INDEX` | `CAMERA` | OVERALL, VALUE_FOR_MONEY, CAMERA, BATTERY_LIFE, BUILD_QUALITY |
| `reviewId` | `String` | Optional | `FK` | `REV-10001` | Foreign key reference to reviews.reviewId |
| `platform` | `String` | **Required** | `NONE` | `ANDROID_APP` | ANDROID_APP, DESKTOP_WEB, IOS_APP |
| `isAnonymous` | `Boolean` | **Required** | `NONE` | `false` | User masked name preference |
| `verifiedPurchase` | `Boolean` | **Required** | `NONE` | `true` | Order item verification flag |
| `submittedAt` | `Date` | **Required** | `NONE` | `2024-03-22T19:38:00Z` | Submission timestamp |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-03-22T19:38:00Z` | Update timestamp |

### 6.3 Collection: `product_feedback`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: NLP sentiment analysis scores, bug reports, and packaging feedback tickets
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `feedbackId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000003')` | Internal ID |
| `feedbackId` | `String` | **Required** | `UK` | `FDB-10001` | Unique feedback ticket identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `feedbackType` | `String` | **Required** | `NONE` | `PACKAGING_FEEDBACK` | BUG_REPORT, PACKAGING_FEEDBACK, DELIVERY_EXPERIENCE, FEATURE_SUGGESTION |
| `sentimentScore` | `Number` | **Required** | `NONE` | `0.85` | NLP sentiment polar score (-1.0 negative to +1.0 positive) |
| `feedbackText` | `String` | **Required** | `NONE` | `Delivery box was slightly scuffed on corner, but internal phone packaging was intact.` | Raw customer comment |
| `sentimentCategory` | `String` | **Required** | `INDEX` | `POSITIVE` | POSITIVE, NEUTRAL, NEGATIVE |
| `assignedTeam` | `String` | **Required** | `NONE` | `LOGISTICS_OPERATIONS` | LOGISTICS_OPERATIONS, PRODUCT_CATALOG, MANUFACTURER |
| `actionTaken` | `String` | Optional | `NONE` | `Flagged packaging feedback to BlueDart hub` | Followup action taken |
| `status` | `String` | **Required** | `NONE` | `RESOLVED` | OPEN, REVIEWED, RESOLVED |
| `createdAt` | `Date` | **Required** | `NONE` | `2024-03-23T11:00:00Z` | Feedback logged timestamp |

### 6.4 Collection: `sales_daily`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Daily rolled-up sales, order volumes, discount totals, and average order values
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `dailyMetricId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000004')` | Internal ID |
| `dailyMetricId` | `String` | **Required** | `UK` | `SALE-DAY-20240315` | Unique daily metric identifier |
| `recordDate` | `String` | **Required** | `INDEX` | `2024-03-15` | Metric calendar date in YYYY-MM-DD |
| `totalOrders` | `Number` | **Required** | `NONE` | `82` | Total orders processed that day |
| `totalRevenueINR` | `Number` | **Required** | `NONE` | `4820000` | Total gross revenue generated in INR |
| `totalDiscountINR` | `Number` | **Required** | `NONE` | `295000` | Total promotional discounts granted |
| `totalTaxINR` | `Number` | **Required** | `NONE` | `735000` | Total GST collected |
| `totalShippingRevenueINR` | `Number` | **Required** | `NONE` | `6400` | Shipping revenue collected |
| `averageOrderValueINR` | `Number` | **Required** | `NONE` | `58780.48` | AOV for that business day |
| `totalItemsSold` | `Number` | **Required** | `NONE` | `138` | Physical units shipped |
| `uniqueCustomersCount` | `Number` | **Required** | `NONE` | `76` | Distinct transacting customers |
| `topSellingCategoryId` | `String` | **Required** | `FK` | `CAT-10001` | Logical reference to product_db.categories.categoryId |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-03-16T01:00:00Z` | Nightly cron calculation timestamp |

### 6.5 Collection: `sales_monthly`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Monthly business performance metrics, return percentages, and top products
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `monthlyMetricId`
- **Total Defined Fields**: **14 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000005')` | Internal ID |
| `monthlyMetricId` | `String` | **Required** | `UK` | `SALE-MTH-202403` | Unique monthly aggregation identifier |
| `monthIdentifier` | `String` | **Required** | `INDEX` | `2024-03` | Calendar month in YYYY-MM |
| `year` | `Number` | **Required** | `NONE` | `2024` | Calendar year |
| `month` | `Number` | **Required** | `NONE` | `3` | Calendar month (1 to 12) |
| `grossSalesINR` | `Number` | **Required** | `NONE` | `142500000` | Gross monthly GMV in INR |
| `netSalesINR` | `Number` | **Required** | `NONE` | `131200000` | Net sales after discounts and refunds |
| `totalOrdersCount` | `Number` | **Required** | `NONE` | `2480` | Cumulative monthly order count |
| `completedOrdersCount` | `Number` | **Required** | `NONE` | `2350` | Successfully delivered orders |
| `cancelledOrdersCount` | `Number` | **Required** | `NONE` | `85` | Cancelled orders count |
| `returnedOrdersCount` | `Number` | **Required** | `NONE` | `45` | Returned orders count |
| `averageOrderValueINR` | `Number` | **Required** | `NONE` | `57459.67` | Monthly AOV in INR |
| `topSellingProductId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `generatedAt` | `Date` | **Required** | `NONE` | `2024-04-01T04:00:00Z` | Report generation timestamp |

### 6.6 Collection: `customer_metrics`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: RFM scores (Recency, Frequency, Monetary), lifetime spend, and churn probability
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `customerMetricId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000006')` | Internal ID |
| `customerMetricId` | `String` | **Required** | `UK` | `CMET-10001` | Unique customer analytics record identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `totalOrdersCount` | `Number` | **Required** | `NONE` | `14` | Lifetime orders count |
| `totalSpendINR` | `Number` | **Required** | `INDEX` | `284500` | Lifetime cumulative spend in INR |
| `averageOrderValueINR` | `Number` | **Required** | `NONE` | `20321.42` | Average order spend in INR |
| `lastOrderDate` | `Date` | **Required** | `NONE` | `2024-03-15T14:32:00Z` | Most recent purchase date |
| `firstOrderDate` | `Date` | **Required** | `NONE` | `2023-02-10T11:00:00Z` | Initial onboarding purchase date |
| `customerLifetimeDays` | `Number` | **Required** | `NONE` | `399` | Days active on platform |
| `rfmScore` | `String` | **Required** | `NONE` | `5-4-5` | Recency-Frequency-Monetary rating quintile |
| `customerSegment` | `String` | **Required** | `INDEX` | `VIP_HIGH_VALUE` | VIP_HIGH_VALUE, REGULAR_LOYAL, OCCASIONAL, AT_RISK, CHURNED |
| `churnProbability` | `Number` | **Required** | `NONE` | `0.08` | Predictive model churn score (0.0 to 1.0) |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-04-01T03:00:00Z` | Batch update timestamp |

### 6.7 Collection: `product_metrics`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Conversion funnels, pageviews, cart adds, inventory turnover, and return rates
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `productMetricId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000007')` | Internal ID |
| `productMetricId` | `String` | **Required** | `UK` | `PMET-10001` | Unique product analytics record identifier |
| `productId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `totalUnitsSold` | `Number` | **Required** | `INDEX` | `420` | Cumulative units sold |
| `totalSalesRevenueINR` | `Number` | **Required** | `NONE` | `25199580` | Gross product revenue in INR |
| `pageViewCount` | `Number` | **Required** | `NONE` | `18420` | Total product detail page views |
| `cartAddCount` | `Number` | **Required** | `NONE` | `1950` | Times added to cart |
| `conversionRatePercentage` | `Number` | **Required** | `NONE` | `2.28` | (units sold / page views) * 100 |
| `averageRating` | `Number` | **Required** | `NONE` | `4.65` | Calculated rating score |
| `totalReviewsCount` | `Number` | **Required** | `NONE` | `86` | Total approved user reviews |
| `returnRatePercentage` | `Number` | **Required** | `NONE` | `1.42` | (units returned / units sold) * 100 |
| `inventoryTurnoverRatio` | `Number` | **Required** | `NONE` | `4.2` | Annual stock velocity ratio |
| `calculatedAt` | `Date` | **Required** | `NONE` | `2024-04-01T03:30:00Z` | Metric calculation timestamp |

### 6.8 Collection: `category_metrics`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Category revenue contribution shares, month-on-month growth, and ASP
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `categoryMetricId`
- **Total Defined Fields**: **13 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000008')` | Internal ID |
| `categoryMetricId` | `String` | **Required** | `UK` | `CATMET-10001` | Unique category analytics identifier |
| `categoryId` | `String` | **Required** | `FK` | `CAT-10001` | Logical reference to product_db.categories.categoryId |
| `categoryName` | `String` | **Required** | `NONE` | `Electronics & Gadgets` | Category display name |
| `periodMonth` | `String` | **Required** | `INDEX` | `2024-03` | Assessment calendar month |
| `totalRevenueINR` | `Number` | **Required** | `NONE` | `78400000` | Category total revenue in INR |
| `totalUnitsSold` | `Number` | **Required** | `NONE` | `1320` | Total units shipped in category |
| `revenueContributionPercentage` | `Number` | **Required** | `NONE` | `55.02` | Category percentage share of company GMV |
| `growthRatePercentage` | `Number` | **Required** | `NONE` | `12.4` | Month-on-Month revenue growth % |
| `averageSellingPriceINR` | `Number` | **Required** | `NONE` | `59393.93` | Average Selling Price (ASP) in INR |
| `activeProductCount` | `Number` | **Required** | `NONE` | `45` | Number of live catalog items |
| `returnRatePercentage` | `Number` | **Required** | `NONE` | `2.1` | Category return percentage |
| `updatedAt` | `Date` | **Required** | `NONE` | `2024-04-01T03:45:00Z` | Calculation timestamp |

### 6.9 Collection: `search_history`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: Customer search queries, click-through conversions, search latency, and zero-result audits
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `searchId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000009')` | Internal ID |
| `searchId` | `String` | **Required** | `UK` | `SCH-10001` | Unique search query log identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `searchQuery` | `String` | **Required** | `INDEX` | `OnePlus 12 5g emerald` | Raw text query typed by shopper |
| `resultsCount` | `Number` | **Required** | `NONE` | `18` | Matching items returned |
| `clickedProductId` | `String` | Optional | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `deviceType` | `String` | **Required** | `NONE` | `MOBILE` | MOBILE, DESKTOP, TABLET |
| `hasFiltersApplied` | `Boolean` | **Required** | `NONE` | `true` | Whether user used sidebar facets |
| `appliedFilterDetails` | `Object` | **Required** | `NONE` | `{"brand":"OnePlus","minPrice":50000}` | JSON facet filter criteria |
| `searchLatencyMs` | `Number` | **Required** | `NONE` | `42` | Query execution speed in milliseconds |
| `userConverted` | `Boolean` | **Required** | `NONE` | `true` | Whether search led to cart add/checkout |
| `searchedAt` | `Date` | **Required** | `INDEX` | `2024-03-14T21:15:30Z` | Search submission timestamp |

### 6.10 Collection: `recommendations`
- **Database**: `analytics_db`
- **Assigned Member**: Member 6
- **Collection Purpose**: ML personalized recommendation carousels, algorithmic scoring, impressions, and CTR
- **Primary Key**: `_id` (Internal BSON ObjectId)
- **Business Unique Key**: `recommendationId`
- **Total Defined Fields**: **12 fields**

| Field Name | Data Type | Req/Opt | Key / Index | Example Value | Description & Business Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | **Required** | `PK` | `ObjectId('65f1a6000000000000000010')` | Internal ID |
| `recommendationId` | `String` | **Required** | `UK` | `REC-10001` | Unique recommendation batch item identifier |
| `customerId` | `String` | **Required** | `FK` | `CUST-10001` | Logical reference to customer_db.customers.customerId |
| `recommendedProductId` | `String` | **Required** | `FK` | `PROD-10001` | Logical reference to product_db.products.productId |
| `recommendationAlgorithm` | `String` | **Required** | `NONE` | `COLLABORATIVE_FILTERING` | COLLABORATIVE_FILTERING, FREQUENTLY_BOUGHT_TOGETHER, SIMILAR_PRICE_BRACKET, RECENT_CATEGORY_AFFINITY |
| `recommendationScore` | `Number` | **Required** | `NONE` | `0.94` | Algorithm confidence score (0.0 to 1.0) |
| `rankPosition` | `Number` | **Required** | `NONE` | `1` | Slot position in frontend carousel (1 = first) |
| `status` | `String` | **Required** | `NONE` | `ACTIVE` | ACTIVE, DISMISSED, CLICKED, PURCHASED |
| `impressionsCount` | `Number` | **Required** | `NONE` | `5` | Times rendered on customer screen |
| `isClicked` | `Boolean` | **Required** | `NONE` | `true` | User clicked item flag |
| `generatedAt` | `Date` | **Required** | `NONE` | `2024-03-15T06:00:00Z` | Model inference timestamp |
| `expiresAt` | `Date` | **Required** | `NONE` | `2024-03-22T06:00:00Z` | Cache validity expiration |


---

