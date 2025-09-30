# Backend Fix Instructions - Preventing Invalid Product Data

## Problem
The backend is sending products with null, 0, or invalid price values to the frontend, causing NaN display issues.

## Root Cause
A recent backend script deactivates products with missing critical fields (like price), setting an `is_active` flag to FALSE. However, API endpoints are still returning these deactivated products.

## Backend Solution Required

### Step 1: Update All Product-Related API Endpoints

Modify the following SQL queries in your backend Python file to filter out inactive products:

#### 1. Search Endpoint (`/api/search`)
```sql
-- BEFORE
SELECT * FROM products
WHERE name ILIKE %s OR brand ILIKE %s;

-- AFTER (Add is_active filter)
SELECT * FROM products
WHERE (name ILIKE %s OR brand ILIKE %s)
AND is_active = TRUE;
```

#### 2. Product by ID Endpoint (`/api/products/{product_id}`)
```sql
-- BEFORE
SELECT * FROM products
WHERE product_id = %s;

-- AFTER
SELECT * FROM products
WHERE product_id = %s
AND is_active = TRUE;
```

#### 3. Product by Barcode Endpoint (`/api/products/by-barcode/{barcode}`)
```sql
-- BEFORE
SELECT * FROM products
WHERE barcode = %s;

-- AFTER
SELECT * FROM products
WHERE barcode = %s
AND is_active = TRUE;
```

#### 4. Any JOIN Queries
```sql
-- Example: When joining products with prices or stores
SELECT p.*, pr.price
FROM products p
LEFT JOIN prices pr ON p.product_id = pr.product_id
WHERE p.is_active = TRUE  -- Add this condition
AND pr.price IS NOT NULL   -- Also ensure price is not null
AND pr.price > 0;          -- And price is positive
```

### Step 2: Additional Price Validation (Optional but Recommended)

Add server-side validation before sending response:

```python
def filter_valid_products(products):
    """Remove products with invalid price data"""
    valid_products = []
    for product in products:
        # Check if product has valid price
        if product.get('price') and product['price'] > 0:
            valid_products.append(product)
        elif product.get('lowest_price') and product['lowest_price'] > 0:
            valid_products.append(product)
        # Skip products without valid prices
    return valid_products

# Apply before returning response
@app.get("/api/search")
async def search_products(q: str):
    products = query_database(...)  # Your existing query
    valid_products = filter_valid_products(products)
    return valid_products
```

### Step 3: Database Integrity Check

Run this query to verify the state of your products table:

```sql
-- Check how many products are inactive
SELECT
    COUNT(*) as total_products,
    SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_products,
    SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as inactive_products,
    SUM(CASE WHEN price IS NULL OR price = 0 THEN 1 ELSE 0 END) as invalid_price_count
FROM products;
```

## Frontend Protection (Already Implemented)

The frontend has been updated with defensive programming to handle any invalid data that might slip through:

1. **ProductCard.tsx** - Shows "Price unavailable" for invalid prices
2. **ProductDetailsScreen.tsx** - Prevents adding items without valid prices to cart
3. **CartContext.tsx** - Safely calculates totals, treating invalid prices as 0
4. **CartScreen.tsx** - Additional NaN protection for display
5. **CartItem.tsx** - Shows "Price unavailable" for items with invalid prices

## Testing After Implementation

1. **Backend Testing:**
   - Query products directly: `SELECT * FROM products WHERE is_active = FALSE LIMIT 5;`
   - Test each API endpoint to ensure no invalid products are returned
   - Monitor API response payloads for any price fields that are null, 0, or undefined

2. **Frontend Testing:**
   - Search for products and verify no NaN or 0 prices appear
   - Add items to cart and check the total calculation
   - Navigate through product details without seeing invalid prices

## Important Notes

- The `is_active` flag should be managed by your existing backend script that validates product data
- Never manually set `is_active = TRUE` for products with missing critical fields
- Consider implementing a scheduled job to periodically validate and update the `is_active` status
- Log any products that are deactivated for monitoring purposes

## Contact Support

If you need help implementing these changes or the `is_active` column doesn't exist in your database, you may need to:

1. Add the column: `ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;`
2. Run the validation script to set the initial values
3. Then implement the SQL query changes above