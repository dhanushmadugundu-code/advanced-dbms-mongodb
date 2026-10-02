/**
 * Smart E-Commerce Management System using MongoDB
 * Phase 6: Advanced MongoDB Queries & Data Aggregation Module
 * 
 * Course: Advanced Database Management Systems (Term Project)
 * Scope:
 * 1. Comparison Operators ($gt, $gte, $lt, $lte, $eq, $ne, $in)
 * 2. Logical Operators ($and, $or, $not, $nor)
 * 3. Nested/Embedded Field Queries (Dot Notation)
 * 4. Array Queries ($in, $all, $elemMatch)
 * 5. Field Projection
 * 6. Sorting (Ascending & Descending)
 * 7. Limiting (limit)
 * 8. Combined Queries (Filter + Sort + Limit + Projection)
 * 9. Aggregation Pipelines ($match, $group, $sort, $limit, $project, $unwind)
 * 10. Multi-Collection Joins ($lookup)
 * 
 * Read-Only & Safe: Does not insert, update, or delete any data.
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

async function runAdvancedQueries() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI not found in environment variables (.env).');
    process.exit(1);
  }

  console.log('================================================================================================');
  console.log('  SMART E-COMMERCE MANAGEMENT SYSTEM — PHASE 6: ADVANCED QUERIES & AGGREGATION');
  console.log('  Course: Advanced Database Management Systems (Term Project)');
  console.log('  Executing against Live MongoDB Atlas Cluster');
  console.log('================================================================================================\n');

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas cluster.\n');

    const customerDb = client.db('customer_db');
    const productDb = client.db('product_db');
    const orderDb = client.db('order_db');
    const inventoryDb = client.db('inventory_db');
    const analyticsDb = client.db('analytics_db');

    // =========================================================================
    // SECTION 1: COMPARISON OPERATORS ($gt, $gte, $lt, $lte, $eq, $ne, $in)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 1: COMPARISON OPERATORS ($gt, $gte, $lt, $lte, $eq, $ne, $in)');
    console.log('================================================================================================');

    // 1A. $gte & $lte (Range Query on Product Selling Price)
    console.log('Query 1A [$gte, $lte]: Premium Products between ₹50,000 and ₹1,30,000');
    console.log('Collection: product_db.products');
    const q1A = await productDb.collection('products')
      .find(
        { sellingPriceINR: { $gte: 50000, $lte: 130000 } },
        { projection: { _id: 0, productId: 1, name: 1, sellingPriceINR: 1, ratingAverage: 1 } }
      )
      .limit(3)
      .toArray();

    q1A.forEach((p, i) => console.log(`   [#${i + 1}] ${p.productId} | ${p.name.padEnd(45)} | Price: ₹${p.sellingPriceINR.toLocaleString('en-IN')} | Rating: ${p.ratingAverage}⭐`));
    console.log('');

    // 1B. $gt & $lt (Customer Metrics with High Order Count and Low Churn Probability)
    console.log('Query 1B [$gt, $lt]: Highly Engaged Customers (Orders > 5 AND Churn Probability < 0.12)');
    console.log('Collection: analytics_db.customer_metrics');
    const q1B = await analyticsDb.collection('customer_metrics')
      .find(
        { totalOrdersCount: { $gt: 5 }, churnProbability: { $lt: 0.12 } },
        { projection: { _id: 0, customerId: 1, totalOrdersCount: 1, totalSpendINR: 1, churnProbability: 1, customerSegment: 1 } }
      )
      .limit(3)
      .toArray();

    q1B.forEach((c, i) => console.log(`   [#${i + 1}] ${c.customerId} | Lifetime Orders: ${c.totalOrdersCount} | Total Spend: ₹${c.totalSpendINR.toLocaleString('en-IN')} | Churn: ${c.churnProbability} | Segment: ${c.customerSegment}`));
    console.log('');

    // 1C. $eq & $ne (Delivered Orders with Non-Zero Delivery Charges)
    console.log('Query 1C [$eq, $ne]: Delivered Orders where shipping fee is NOT zero ($ne: 0)');
    console.log('Collection: order_db.orders');
    const q1C = await orderDb.collection('orders')
      .find(
        { orderStatus: { $eq: 'DELIVERED' }, shippingFeeINR: { $ne: 0 } },
        { projection: { _id: 0, orderId: 1, customerId: 1, totalAmountINR: 1, shippingFeeINR: 1, orderStatus: 1 } }
      )
      .limit(3)
      .toArray();

    q1C.forEach((o, i) => console.log(`   [#${i + 1}] ${o.orderId} | Customer: ${o.customerId} | Order Total: ₹${o.totalAmountINR.toLocaleString('en-IN')} | Shipping Fee: ₹${o.shippingFeeINR}`));
    console.log('');

    // 1D. $in (Products from Specific Strategic Brand Partner Codes)
    console.log('Query 1D [$in]: Catalog Products belonging to Brands [ BRD-10001, BRD-10002, BRD-10003 ]');
    console.log('Collection: product_db.products');
    const q1D = await productDb.collection('products')
      .find(
        { brandId: { $in: ['BRD-10001', 'BRD-10002', 'BRD-10003'] } },
        { projection: { _id: 0, productId: 1, brandId: 1, name: 1, sellingPriceINR: 1 } }
      )
      .limit(3)
      .toArray();

    q1D.forEach((b, i) => console.log(`   [#${i + 1}] ${b.productId} | Brand Ref: ${b.brandId} | ${b.name.padEnd(45)} | Price: ₹${b.sellingPriceINR.toLocaleString('en-IN')}`));
    console.log('\n');

    // =========================================================================
    // SECTION 2: LOGICAL OPERATORS ($and, $or, $not, $nor)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 2: LOGICAL OPERATORS ($and, $or, $not, $nor)');
    console.log('================================================================================================');

    // 2A. $and with $or (High-Rated Flagships OR Luxury Price Category)
    console.log('Query 2A [$and, $or]: Active products that are EITHER rated >= 4.5 OR base price > ₹1,00,000');
    console.log('Collection: product_db.products');
    const q2A = await productDb.collection('products')
      .find({
        $and: [
          { status: 'ACTIVE' },
          {
            $or: [
              { ratingAverage: { $gte: 4.5 } },
              { basePriceINR: { $gt: 100000 } }
            ]
          }
        ]
      }, { projection: { _id: 0, productId: 1, name: 1, sellingPriceINR: 1, basePriceINR: 1, ratingAverage: 1 } })
      .limit(3)
      .toArray();

    q2A.forEach((p, i) => console.log(`   [#${i + 1}] ${p.productId} | ${p.name.padEnd(42)} | MRP: ₹${p.basePriceINR.toLocaleString('en-IN')} | Rating: ${p.ratingAverage}⭐`));
    console.log('');

    // 2B. $not (Discount Amount NOT Equal to Zero)
    console.log('Query 2B [$not]: Orders where promotional discount is NOT equal to zero');
    console.log('Collection: order_db.orders');
    const q2B = await orderDb.collection('orders')
      .find({
        discountAmountINR: { $not: { $eq: 0 } }
      }, { projection: { _id: 0, orderId: 1, customerId: 1, subtotalAmountINR: 1, discountAmountINR: 1, totalAmountINR: 1 } })
      .limit(3)
      .toArray();

    q2B.forEach((o, i) => console.log(`   [#${i + 1}] ${o.orderId} | Subtotal: ₹${o.subtotalAmountINR.toLocaleString('en-IN')} | Discount: ₹${o.discountAmountINR.toLocaleString('en-IN')} | Final: ₹${o.totalAmountINR.toLocaleString('en-IN')}`));
    console.log('');

    // 2C. $nor (Exclude Discontinued and Low-Value Items)
    console.log('Query 2C [$nor]: Products that are NEITHER Discontinued NOR priced under ₹2,000');
    console.log('Collection: product_db.products');
    const q2C = await productDb.collection('products')
      .find({
        $nor: [
          { status: 'DISCONTINUED' },
          { sellingPriceINR: { $lt: 2000 } }
        ]
      }, { projection: { _id: 0, productId: 1, name: 1, status: 1, sellingPriceINR: 1 } })
      .limit(3)
      .toArray();

    q2C.forEach((p, i) => console.log(`   [#${i + 1}] ${p.productId} | ${p.name.padEnd(45)} | Status: ${p.status} | Price: ₹${p.sellingPriceINR.toLocaleString('en-IN')}`));
    console.log('\n');

    // =========================================================================
    // SECTION 3: NESTED & EMBEDDED DOCUMENT FILTERING (Dot Notation)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 3: FILTERING NESTED / EMBEDDED FIELDS (Dot Notation)');
    console.log('================================================================================================');

    // 3A. Nested Geographic Coordinates
    console.log('Query 3A: Warehouses with latitude between 12.0°N and 19.5°N (South & Central Hubs)');
    console.log('Collection: inventory_db.warehouses -> "geoCoordinates.latitude"');
    const q3A = await inventoryDb.collection('warehouses')
      .find({
        'geoCoordinates.latitude': { $gte: 12.0, $lte: 19.5 }
      }, { projection: { _id: 0, warehouseId: 1, warehouseName: 1, city: 1, state: 1, geoCoordinates: 1 } })
      .limit(3)
      .toArray();

    q3A.forEach((w, i) => console.log(`   [#${i + 1}] ${w.warehouseId} | ${w.city}, ${w.state.padEnd(12)} | Lat: ${w.geoCoordinates.latitude}°N, Lng: ${w.geoCoordinates.longitude}°E`));
    console.log('');

    // 3B. Nested Search Filter Criteria in Analytics
    console.log('Query 3B: Search history where user applied minimum price filter >= ₹5,000');
    console.log('Collection: analytics_db.search_history -> "appliedFilterDetails.priceMin"');
    const q3B = await analyticsDb.collection('search_history')
      .find({
        'appliedFilterDetails.priceMin': { $gte: 5000 }
      }, { projection: { _id: 0, searchId: 1, customerId: 1, searchQuery: 1, appliedFilterDetails: 1 } })
      .limit(3)
      .toArray();

    q3B.forEach((s, i) => console.log(`   [#${i + 1}] ${s.searchId} | Query: "${s.searchQuery.padEnd(35)}" | Min: ₹${s.appliedFilterDetails.priceMin}, Max: ₹${s.appliedFilterDetails.priceMax}`));
    console.log('\n');

    // =========================================================================
    // SECTION 4: ARRAY QUERIES ($in, $all, Array Membership)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 4: ARRAY QUERIES ($in, $all, Array Matching)');
    console.log('================================================================================================');

    // 4A. $all: Matches documents where array contains ALL specified elements
    console.log('Query 4A [$all]: Products that possess BOTH "5G" AND "Flagship" tags');
    console.log('Collection: product_db.products -> tags: { $all: ["5G", "Flagship"] }');
    const q4A = await productDb.collection('products')
      .find({
        tags: { $all: ['5G', 'Flagship'] }
      }, { projection: { _id: 0, productId: 1, name: 1, tags: 1, sellingPriceINR: 1 } })
      .limit(3)
      .toArray();

    q4A.forEach((p, i) => console.log(`   [#${i + 1}] ${p.productId} | ${p.name.padEnd(45)} | Tags: [${p.tags.join(', ')}]`));
    console.log('');

    // 4B. $in on Array: Matches documents where array contains ANY of the elements
    console.log('Query 4B [$in on array]: Customers tagged with EITHER "VIP" OR "FREQUENT_BUYER"');
    console.log('Collection: customer_db.customers -> tags: { $in: ["VIP", "FREQUENT_BUYER"] }');
    const q4C = await customerDb.collection('customers')
      .find({
        tags: { $in: ['VIP', 'FREQUENT_BUYER'] }
      }, { projection: { _id: 0, customerId: 1, firstName: 1, lastName: 1, tags: 1 } })
      .limit(3)
      .toArray();

    q4C.forEach((c, i) => console.log(`   [#${i + 1}] ${c.customerId} | ${c.firstName} ${c.lastName.padEnd(12)} | Segmentation Tags: [${c.tags.join(', ')}]`));
    console.log('\n');

    // =========================================================================
    // SECTION 5: PROJECTION, SORTING & LIMITING (Combined Queries)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 5: COMBINED QUERIES (Filtering + Sorting + Limiting + Projection)');
    console.log('================================================================================================');

    // 5A. Top 5 Highest Value Orders (Descending Sort + Projection + Limit)
    console.log('Query 5A: Top 5 Highest Grossing Sales Orders (Descending by totalAmountINR)');
    console.log('Collection: order_db.orders (Filter: orderStatus = "DELIVERED", Sort: -1, Limit: 5)');
    const q5A = await orderDb.collection('orders')
      .find({ orderStatus: 'DELIVERED' })
      .project({ _id: 0, orderId: 1, customerId: 1, totalAmountINR: 1, orderDate: 1 })
      .sort({ totalAmountINR: -1 })
      .limit(5)
      .toArray();

    q5A.forEach((o, i) => console.log(`   Rank #${i + 1} | Order: ${o.orderId} | Customer: ${o.customerId} | Amount: ₹${o.totalAmountINR.toLocaleString('en-IN')} | Date: ${o.orderDate.toISOString().split('T')[0]}`));
    console.log('');

    // 5B. Most Recently Registered Customers (Ascending/Descending Sort)
    console.log('Query 5B: Verified Customers Sorted by Account Registration Date (Descending)');
    console.log('Collection: customer_db.customers (Filter: kycVerified = true, Sort: registeredAt: -1, Limit: 4)');
    const q5B = await customerDb.collection('customers')
      .find({ kycVerified: true })
      .project({ _id: 0, customerId: 1, firstName: 1, lastName: 1, email: 1, registeredAt: 1 })
      .sort({ registeredAt: -1 })
      .limit(4)
      .toArray();

    q5B.forEach((c, i) => console.log(`   [#${i + 1}] ${c.customerId} | ${c.firstName} ${c.lastName.padEnd(15)} | ${c.email.padEnd(30)} | Registered: ${c.registeredAt.toISOString().split('T')[0]}`));
    console.log('\n');

    // =========================================================================
    // SECTION 6: DATA AGGREGATION PIPELINES ($match, $group, $sort, $limit, $project)
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 6: AGGREGATION PIPELINES ($match, $group, $sort, $limit, $project)');
    console.log('================================================================================================');

    // Pipeline 1: Sales Metrics Grouped by Order Status
    console.log('Pipeline 6A: Sales Totals, Average Order Value, and Range Grouped by Order Status');
    console.log('Pipeline: $match -> $group -> $project -> $sort');
    console.log('Collection: order_db.orders\n');

    const aggStatusResults = await orderDb.collection('orders').aggregate([
      { $match: { totalAmountINR: { $gt: 10000 } } },
      {
        $group: {
          _id: '$orderStatus',
          orderCount: { $sum: 1 },
          grossRevenueINR: { $sum: '$totalAmountINR' },
          avgOrderValueINR: { $avg: '$totalAmountINR' },
          maxOrderValueINR: { $max: '$totalAmountINR' },
          minOrderValueINR: { $min: '$totalAmountINR' }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          orderCount: 1,
          grossRevenueINR: 1,
          avgOrderValueINR: { $round: ['$avgOrderValueINR', 2] },
          maxOrderValueINR: 1,
          minOrderValueINR: 1
        }
      },
      { $sort: { grossRevenueINR: -1 } }
    ]).toArray();

    aggStatusResults.forEach(r => {
      console.log(`   Status: [ ${r.status.padEnd(12)} ] | Orders: ${String(r.orderCount).padEnd(2)} | Gross Revenue: ₹${r.grossRevenueINR.toLocaleString('en-IN').padEnd(12)} | AOV: ₹${r.avgOrderValueINR.toLocaleString('en-IN')}`);
    });
    console.log('');

    // Pipeline 2: Array Unwinding & Frequency Analysis on Product Tags ($unwind)
    console.log('Pipeline 6B [$unwind]: Product Catalog Tag Frequency and Average Price Distribution');
    console.log('Pipeline: $match -> $unwind("$tags") -> $group -> $sort -> $limit');
    console.log('Collection: product_db.products\n');

    const aggTagResults = await productDb.collection('products').aggregate([
      { $match: { status: 'ACTIVE' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          totalProducts: { $sum: 1 },
          averagePriceINR: { $avg: '$sellingPriceINR' }
        }
      },
      {
        $project: {
          _id: 0,
          tag: '$_id',
          totalProducts: 1,
          averagePriceINR: { $round: ['$averagePriceINR', 2] }
        }
      },
      { $sort: { totalProducts: -1, averagePriceINR: -1 } },
      { $limit: 6 }
    ]).toArray();

    aggTagResults.forEach(t => {
      console.log(`   Tag: [ ${t.tag.padEnd(15)} ] | Total Catalog Products: ${String(t.totalProducts).padEnd(2)} | Avg Selling Price: ₹${t.averagePriceINR.toLocaleString('en-IN')}`);
    });
    console.log('');

    // Pipeline 3: Customer Segment Analysis (RFM spend groups in Analytics)
    console.log('Pipeline 6C: Customer Lifetime Value & Churn Risk by Customer Segment');
    console.log('Pipeline: $match -> $group -> $project -> $sort');
    console.log('Collection: analytics_db.customer_metrics\n');

    const aggCustomerMetrics = await analyticsDb.collection('customer_metrics').aggregate([
      { $match: { totalSpendINR: { $gte: 30000 } } },
      {
        $group: {
          _id: '$customerSegment',
          totalCustomers: { $sum: 1 },
          cumulativeSpendINR: { $sum: '$totalSpendINR' },
          avgSpendPerCustomer: { $avg: '$totalSpendINR' },
          avgChurnProbability: { $avg: '$churnProbability' }
        }
      },
      {
        $project: {
          _id: 0,
          segment: '$_id',
          totalCustomers: 1,
          cumulativeSpendINR: 1,
          avgSpendPerCustomer: { $round: ['$avgSpendPerCustomer', 2] },
          avgChurnRisk: { $round: ['$avgChurnProbability', 3] }
        }
      },
      { $sort: { cumulativeSpendINR: -1 } }
    ]).toArray();

    aggCustomerMetrics.forEach(s => {
      console.log(`   Segment: [ ${s.segment.padEnd(18)} ] | Customers: ${String(s.totalCustomers).padEnd(2)} | Total Spend: ₹${s.cumulativeSpendINR.toLocaleString('en-IN').padEnd(12)} | Churn Risk: ${s.avgChurnRisk}`);
    });
    console.log('\n');

    // =========================================================================
    // SECTION 7: MULTI-COLLECTION JOINS USING $lookup
    // =========================================================================
    console.log('================================================================================================');
    console.log('  SECTION 7: MULTI-COLLECTION JOINS ($lookup)');
    console.log('================================================================================================');

    // Lookup 1: Orders Joined with Line Items (order_db.orders ↔ order_db.order_items)
    console.log('Join 7A [$lookup]: Orders with Embedded Itemized Line Items');
    console.log('Relationship: order_db.orders.orderId === order_db.order_items.orderId\n');

    const lookupOrdersWithItems = await orderDb.collection('orders').aggregate([
      { $match: { totalAmountINR: { $gte: 75000 } } },
      {
        $lookup: {
          from: 'order_items',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'orderItems'
        }
      },
      {
        $project: {
          _id: 0,
          orderId: 1,
          customerId: 1,
          totalAmountINR: 1,
          orderStatus: 1,
          lineItemCount: { $size: '$orderItems' },
          items: {
            $map: {
              input: '$orderItems',
              as: 'item',
              in: {
                orderItemId: '$$item.orderItemId',
                productId: '$$item.productId',
                quantity: '$$item.quantity',
                totalPrice: '$$item.totalItemPriceINR'
              }
            }
          }
        }
      },
      { $sort: { totalAmountINR: -1 } },
      { $limit: 2 }
    ]).toArray();

    lookupOrdersWithItems.forEach((o, i) => {
      console.log(`   [#${i + 1}] Order ${o.orderId} | Customer: ${o.customerId} | Total: ₹${o.totalAmountINR.toLocaleString('en-IN')} | Status: ${o.orderStatus}`);
      console.log(`       Joined Line Items (${o.lineItemCount} items):`, JSON.stringify(o.items));
    });
    console.log('');

    // Lookup 2: Products Joined with Available Variants (product_db.products ↔ product_db.product_variants)
    console.log('Join 7B [$lookup]: Product Master Catalog Joined with Product Variants');
    console.log('Relationship: product_db.products.productId === product_db.product_variants.productId\n');

    const lookupProductsWithVariants = await productDb.collection('products').aggregate([
      { $match: { sellingPriceINR: { $gte: 60000 } } },
      {
        $lookup: {
          from: 'product_variants',
          localField: 'productId',
          foreignField: 'productId',
          as: 'variants'
        }
      },
      {
        $project: {
          _id: 0,
          productId: 1,
          name: 1,
          basePriceINR: 1,
          sellingPriceINR: 1,
          totalVariantsFound: { $size: '$variants' },
          variants: {
            $map: {
              input: '$variants',
              as: 'v',
              in: {
                variantId: '$$v.variantId',
                variantName: '$$v.variantName',
                finalPriceINR: '$$v.finalPriceINR',
                stockQuantity: '$$v.stockQuantity'
              }
            }
          }
        }
      },
      { $sort: { sellingPriceINR: -1 } },
      { $limit: 2 }
    ]).toArray();

    lookupProductsWithVariants.forEach((p, i) => {
      console.log(`   [#${i + 1}] Product: ${p.productId} | ${p.name.padEnd(45)} | Price: ₹${p.sellingPriceINR.toLocaleString('en-IN')}`);
      console.log(`       Joined Variants (${p.totalVariantsFound} variants):`, JSON.stringify(p.variants));
    });
    console.log('');

    // Lookup 3: Orders Joined with Frozen Delivery Address (order_db.orders ↔ order_db.delivery_addresses)
    console.log('Join 7C [$lookup + $unwind]: Orders Joined with Legal Delivery Addresses');
    console.log('Relationship: order_db.orders.orderId === order_db.delivery_addresses.orderId\n');

    const lookupOrdersWithAddresses = await orderDb.collection('orders').aggregate([
      { $match: { orderStatus: 'DELIVERED' } },
      {
        $lookup: {
          from: 'delivery_addresses',
          localField: 'orderId',
          foreignField: 'orderId',
          as: 'addressDoc'
        }
      },
      { $unwind: '$addressDoc' },
      {
        $project: {
          _id: 0,
          orderId: 1,
          customerId: 1,
          totalAmountINR: 1,
          recipient: '$addressDoc.recipientName',
          city: '$addressDoc.city',
          state: '$addressDoc.state',
          pinCode: '$addressDoc.pinCode'
        }
      },
      { $sort: { totalAmountINR: -1 } },
      { $limit: 2 }
    ]).toArray();

    lookupOrdersWithAddresses.forEach((o, i) => {
      console.log(`   [#${i + 1}] Order ${o.orderId} | Consignee: ${o.recipient} | Destination: ${o.city}, ${o.state} (PIN: ${o.pinCode}) | Amount: ₹${o.totalAmountINR.toLocaleString('en-IN')}`);
    });
    console.log('\n');

    // =========================================================================
    // EXECUTION AUDIT SUMMARY
    // =========================================================================
    console.log('================================================================================================');
    console.log('  PHASE 6 EXECUTION AUDIT SUMMARY');
    console.log('================================================================================================');
    console.log('Comparison Operators Tested : $gt, $gte, $lt, $lte, $eq, $ne, $in ✅');
    console.log('Logical Operators Tested    : $and, $or, $not, $nor ✅');
    console.log('Nested Field Filters Tested : Dot notation on geoCoordinates.latitude & appliedFilterDetails.priceMin ✅');
    console.log('Array Operators Tested      : $all, $in on tags array ✅');
    console.log('Projection, Sort, Limit     : Tested with selective fields, asc/desc sort, and pagination limits ✅');
    console.log('Aggregation Pipelines       : $match, $group, $sort, $limit, $project, $unwind demonstrated ✅');
    console.log('$lookup Multi-Collection    : 3 realistic joins executed (orders↔items, products↔variants, orders↔addresses) ✅');
    console.log('Read-Only Assurance         : Zero insertions, updates, or deletions executed ✅');
    console.log('System Databases Preserved  : admin, local, config, sample_* untouched ✅');
    console.log('Overall Phase 6 Status      : ALL ADVANCED QUERIES & AGGREGATIONS READY FOR EVALUATION 🎉');
    console.log('================================================================================================\n');

  } catch (error) {
    console.error('❌ Advanced query execution failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed cleanly.\n');
  }
}

if (require.main === module) {
  runAdvancedQueries();
}

module.exports = { runAdvancedQueries };
