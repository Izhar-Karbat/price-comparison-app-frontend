# Backend API Requirements for Price Comparison App

## Current Issue
The frontend is ready to display price comparisons across multiple retailers, but the API currently only returns a single `lowest_price` field without any retailer information.

## Current API Response (from `/api/search`)
```json
{
  "barcode": "7290008110853",
  "name": "VITAMIN C 500 MG 100 TAB",
  "brand": "Unknown",
  "image_url": "https://...",
  "lowest_price": 66.0
}
```

## Required API Response Structure

### Option 1: Update existing `/api/search` endpoint
Each product in the search results should include a `prices` array:

```json
{
  "barcode": "7290008110853",
  "name": "VITAMIN C 500 MG 100 TAB",
  "brand": "Unknown",
  "image_url": "https://...",
  "lowest_price": 66.0,  // Keep for backward compatibility
  "highest_price": 89.0,
  "prices": [
    {
      "retailer_id": 1,
      "retailer_name": "Super-Pharm",
      "store_id": 101,
      "store_name": "Super-Pharm Dizengoff",
      "store_address": "Dizengoff 50, Tel Aviv",
      "price": 66.0,
      "currency": "ILS",
      "in_stock": true,
      "last_updated": "2024-01-15T10:30:00Z"
    },
    {
      "retailer_id": 2,
      "retailer_name": "BE",
      "store_id": 202,
      "store_name": "BE Ramat Gan",
      "store_address": "Bialik 15, Ramat Gan",
      "price": 72.90,
      "currency": "ILS",
      "in_stock": true,
      "last_updated": "2024-01-15T09:15:00Z"
    },
    {
      "retailer_id": 3,
      "retailer_name": "Good Pharm",
      "store_id": 303,
      "store_name": "Good Pharm Central",
      "store_address": "Allenby 45, Tel Aviv",
      "price": 89.0,
      "currency": "ILS",
      "in_stock": false,
      "last_updated": "2024-01-14T18:45:00Z"
    }
  ]
}
```

### Option 2: Create a separate endpoint for price details
Keep `/api/search` lightweight and create a new endpoint:

**Endpoint:** `GET /api/products/{barcode}/prices`

**Response:**
```json
{
  "product": {
    "barcode": "7290008110853",
    "name": "VITAMIN C 500 MG 100 TAB",
    "brand": "Unknown"
  },
  "price_comparison": {
    "lowest_price": 66.0,
    "highest_price": 89.0,
    "average_price": 75.97,
    "total_retailers": 3,
    "last_updated": "2024-01-15T10:30:00Z"
  },
  "prices": [
    // Same price array structure as Option 1
  ]
}
```

## Additional Requirements

### 1. Sorting
- The `prices` array should be sorted by price (ascending) by default
- The first item should always be the cheapest option

### 2. Filtering (Optional but useful)
- Consider adding query parameters for filtering:
  - `?in_stock_only=true` - Only return prices from stores with stock
  - `?retailer_ids=1,2` - Filter by specific retailers
  - `?max_distance=5000` - Filter by distance from user location (if location services are implemented)

### 3. Barcode Search Endpoint
Currently returns 404. Should be implemented:

**Endpoint:** `GET /api/barcode/{barcode}`

**Response:** Same structure as search results but for a single product with full price details

## Database Schema Assumptions
Based on the app's needs, the backend likely needs these tables:
- `products` - Core product information
- `retailers` - Retailer chains (Super-Pharm, BE, etc.)
- `stores` - Individual store locations
- `product_prices` - Price at each store for each product
- `price_history` (optional) - Track price changes over time

## Priority
**High Priority:** Include the `prices` array in the `/api/search` response (Option 1) so users can immediately see price comparisons without additional API calls.

## Testing
Please provide at least 5-10 products that have prices at multiple retailers so we can properly test the price comparison feature.

## Contact
If you need any clarification or have questions about these requirements, please reach out to the frontend team.