# PharmMate Database Schema Documentation

## Database Information
- **Database Name**: `price_comparison_app_v2`
- **Host**: localhost
- **Port**: 5432
- **User**: postgres
- **Password**: 025655358

## Table Structure

### 1. **products**
Main product catalog containing all unique products.

| Column | Type | Description |
|--------|------|-------------|
| product_id | integer (PK) | Unique product identifier |
| canonical_name | text | Standardized product name |
| brand | text | Product brand name |
| description | text | Product description |
| image_url | text | URL to product image |
| embedding | vector(512) | Vector embedding for similarity search |
| created_at | timestamp with timezone | Record creation timestamp |
| updated_at | timestamp with timezone | Last update timestamp |
| attributes | jsonb | Product attributes (size_value, size_unit, etc.) |

**Indexes**:
- Primary Key: `product_id`
- Unique: `lower(canonical_name), lower(brand)`

### 2. **retailers**
Stores information about retail chains.

| Column | Type | Description |
|--------|------|-------------|
| retailerid | integer (PK) | Unique retailer identifier |
| retailername | varchar(100) | Retailer name |
| chainid | varchar(50) | Chain identifier |
| pricetransparencyportalurl | varchar(255) | URL to price transparency portal |
| fileformat | varchar(20) | Data file format (default: 'XML') |
| notes | text | Additional notes |
| createdat | timestamp with timezone | Record creation timestamp |
| updatedat | timestamp with timezone | Last update timestamp |

**Important Retailer IDs for Pharmacy**:
- 52: Pharmacy chain 1
- 150: Pharmacy chain 2  
- 97: Pharmacy chain 3

### 3. **stores**
Physical store locations for each retailer.

| Column | Type | Description |
|--------|------|-------------|
| storeid | integer (PK) | Unique store identifier |
| retailerid | integer (FK) | References retailers.retailerid |
| retailerspecificstoreid | varchar(50) | Retailer's internal store ID |
| storename | varchar(255) | Store name |
| address | text | Full address |
| city | varchar(100) | City name |
| postalcode | varchar(20) | Postal/ZIP code |
| latitude | numeric(9,6) | Geographic latitude |
| longitude | numeric(9,6) | Geographic longitude |
| isactive | boolean | Store active status (default: true) |
| rawstoredata | jsonb | Raw store data from source |
| createdat | timestamp with timezone | Record creation timestamp |
| updatedat | timestamp with timezone | Last update timestamp |
| subchainid | text | Sub-chain identifier |
| subchainname | varchar(255) | Sub-chain name |
| storetype | text | Type of store |
| lastupdatedfromstoresfile | text | Last update source file |

### 4. **retailer_products**
Junction table linking products to retailers.

| Column | Type | Description |
|--------|------|-------------|
| retailer_product_id | integer (PK) | Unique retailer-product identifier |
| product_id | integer (FK) | References products.product_id |
| retailer_id | integer (FK) | References retailers.retailerid |
| retailer_item_code | varchar(100) | Retailer's internal product code |
| original_retailer_name | text | Original product name from retailer |

**Indexes**:
- Primary Key: `retailer_product_id`
- Unique: `retailer_id, retailer_item_code`
- Index: `product_id`

### 5. **prices**
Historical and current price data.

| Column | Type | Description |
|--------|------|-------------|
| price_id | bigint (PK) | Unique price record identifier |
| retailer_product_id | integer (FK) | References retailer_products.retailer_product_id |
| store_id | integer (FK) | References stores.storeid |
| price | numeric(10,2) | Product price |
| price_timestamp | timestamp with timezone | When price was valid |
| scraped_at | timestamp with timezone | When data was collected |
| promotion_id | bigint (FK) | References promotions.promotion_id (nullable) |

**Indexes**:
- Primary Key: `price_id`
- Unique: `retailer_product_id, store_id, price_timestamp`
- Index: `price_timestamp DESC`

### 6. **product_groups**
Groups related products together.

| Column | Type | Description |
|--------|------|-------------|
| group_id | integer (PK) | Unique group identifier |
| created_at | timestamp with timezone | Group creation timestamp |

### 7. **product_group_links**
Links products to their groups.

| Column | Type | Description |
|--------|------|-------------|
| product_id | integer (FK) | References products.product_id |
| group_id | integer (FK) | References product_groups.group_id |

### 8. **promotions**
Store promotional campaigns.

| Column | Type | Description |
|--------|------|-------------|
| promotion_id | bigint (PK) | Unique promotion identifier |
| retailer_id | integer (FK) | References retailers.retailerid |
| promotion_name | text | Promotion name |
| start_date | date | Promotion start date |
| end_date | date | Promotion end date |

### 9. **promotion_product_links**
Links products to promotions.

| Column | Type | Description |
|--------|------|-------------|
| retailer_product_id | integer (FK) | References retailer_products.retailer_product_id |
| promotion_id | bigint (FK) | References promotions.promotion_id |

### 10. **categories**
Product categories (if used).

| Column | Type | Description |
|--------|------|-------------|
| category_id | integer (PK) | Unique category identifier |
| category_name | text | Category name |
| parent_category_id | integer | Parent category for hierarchy |

### 11. **barcode_to_canonical_map**
Maps barcodes to canonical products.

| Column | Type | Description |
|--------|------|-------------|
| barcode | varchar | Product barcode |
| product_id | integer (FK) | References products.product_id |

### 12. **filesprocessed**
Tracks processed data files.

| Column | Type | Description |
|--------|------|-------------|
| file_id | integer (PK) | Unique file identifier |
| retailer_id | integer (FK) | References retailers.retailerid |
| store_id | integer (FK) | References stores.storeid |
| filename | text | Processed file name |
| processed_at | timestamp | Processing timestamp |

## API Endpoints

### Search Products
```
GET /api/search/pharma?q={search_term}
```
Returns aggregated product search results with minimum price across stores.

### Get Product Details
```
GET /api/search/pharma?product_id={product_id}
```
Returns detailed price information for a specific product across all stores.

Response includes:
- Product information (name, brand, attributes)
- Price at each store location
- Store name and city
- Retailer name

## Key Relationships

1. **Product → Retailer**: Many-to-Many through `retailer_products`
2. **Retailer → Store**: One-to-Many
3. **Product → Price**: One-to-Many through `retailer_products`
4. **Store → Price**: One-to-Many
5. **Product → Group**: Many-to-Many through `product_group_links`
6. **Promotion → Product**: Many-to-Many through `promotion_product_links`

## Data Flow

1. Products are registered in the `products` table with canonical names
2. Each retailer lists products with their own codes in `retailer_products`
3. Prices are tracked per store in the `prices` table with timestamps
4. The API aggregates this data to show:
   - Product search results with lowest prices
   - Detailed price comparisons across all stores
   - Store-specific availability

## Important Notes

- The `attributes` JSONB field typically contains:
  - `size_value`: Numeric size value
  - `size_unit`: Unit of measurement (ml, g, tablets, etc.)
- Pharmacy retailers are filtered by `retailerid IN (52, 150, 97)`
- Prices are tracked with timestamps for historical analysis
- The latest price is determined by `price_timestamp DESC`
- All Hebrew text is stored in UTF-8 encoding

## Sample Queries

### Get latest prices for a product across all stores:
```sql
WITH LatestPrices AS (
    SELECT 
        pr.retailer_product_id,
        pr.store_id,
        pr.price,
        ROW_NUMBER() OVER(PARTITION BY pr.retailer_product_id, pr.store_id 
                         ORDER BY pr.price_timestamp DESC) as rn
    FROM prices pr
)
SELECT 
    p.product_id,
    p.canonical_name,
    p.brand,
    r.retailername,
    s.storename,
    s.city,
    lp.price
FROM products p
JOIN retailer_products rp ON p.product_id = rp.product_id
JOIN retailers r ON rp.retailer_id = r.retailerid
JOIN LatestPrices lp ON rp.retailer_product_id = lp.retailer_product_id AND lp.rn = 1
JOIN stores s ON lp.store_id = s.storeid
WHERE p.product_id = {product_id}
    AND r.retailerid IN (52, 150, 97)  -- Pharmacy retailers
ORDER BY lp.price ASC;
```

### Search products by name:
```sql
WITH AggregatedPrices AS (
    SELECT
        rp.product_id,
        MIN(pr.price) as min_price,
        COUNT(DISTINCT pr.store_id) as store_count
    FROM prices pr
    JOIN retailer_products rp ON pr.retailer_product_id = rp.retailer_product_id
    WHERE rp.retailer_id IN (52, 150, 97)
    GROUP BY rp.product_id
)
SELECT
    p.product_id,
    p.canonical_name,
    p.brand,
    p.attributes,
    ap.min_price,
    ap.store_count
FROM products p
JOIN AggregatedPrices ap ON p.product_id = ap.product_id
WHERE p.canonical_name ILIKE '%{search_term}%'
ORDER BY ap.min_price ASC;
```