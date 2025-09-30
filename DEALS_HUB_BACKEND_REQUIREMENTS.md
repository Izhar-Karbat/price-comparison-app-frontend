# Deals Hub Backend API Requirements

## Overview
The frontend needs two backend API changes to support the Deals Hub feature:
1. A new endpoint to fetch all active deals
2. An update to the existing product details endpoint to include promotions

---

## 1. New Endpoint: Get All Deals

**Route:** `GET /api/deals`

**Purpose:** Fetch a list of all currently active promotions for display in the Deals Hub screen.

**Query Parameters (Optional):**
- `limit` (number): Limit the number of results
- `retailer_id` (number): Filter deals by specific retailer

**Response Format:**

```json
[
  {
    "deal_id": 101,
    "retailer_name": "Super-Pharm",
    "title": "Buy 1, Get 1 Free",
    "description": "On all Nivea skincare products.",
    "image_url": "https://example.com/nivea_deal.jpg"
  },
  {
    "deal_id": 102,
    "retailer_name": "Be",
    "title": "30% Off All Vitamins",
    "description": "For club members only.",
    "image_url": "https://example.com/vitamins_deal.jpg"
  }
]
```

**Field Specifications:**
- `deal_id` (number, required): Unique identifier for the deal
- `retailer_name` (string, required): Display name of the retailer offering the deal
- `title` (string, required): Short, attention-grabbing title
- `description` (string, required): Details about the promotion
- `image_url` (string, optional): URL to promotional image

**Error Responses:**
- `500`: Server error fetching deals

---

## 2. Update Endpoint: Get Product Details

**Route:** `GET /api/products/{product_id}`

**Purpose:** Extend the existing product details endpoint to include any promotions that apply to the product.

**Updated Response Structure:**

```json
{
  "product_id": 123,
  "name": "Nivea Face Cream",
  "brand": "Nivea",
  "barcode": "7290001234567",
  "image_url": "https://example.com/nivea_cream.jpg",
  "description": "Moisturizing face cream for all skin types",
  "category": "Skincare",
  "health_score": 85,
  "prices": [
    {
      "store_id": 1,
      "store_name": "Super-Pharm",
      "price": 29.90,
      "currency": "ILS"
    }
  ],
  "promotions": [
    {
      "deal_id": 101,
      "title": "Buy 1, Get 1 Free",
      "description": "On all Nivea skincare products.",
      "retailer_name": "Super-Pharm"
    }
  ]
}
```

**New Field: `promotions`**
- Type: Array of promotion objects
- Can be empty array `[]` if no promotions apply
- Each promotion object contains:
  - `deal_id` (number, required): ID of the promotion
  - `title` (string, required): Promotion title
  - `description` (string, required): Promotion details
  - `retailer_name` (string, required): Which retailer offers this deal

---

## Implementation Notes

1. **Deal Matching Logic:** The backend should determine which deals apply to a product based on:
   - Product category
   - Product brand
   - Specific product ID
   - Retailer availability

2. **Caching:** Consider caching the deals list since it doesn't change frequently

3. **Image URLs:** Ensure all image URLs are publicly accessible and properly formatted

4. **Active Deals Only:** Only return deals that are currently active (check start/end dates)

---

## Testing Checklist

- [ ] `/api/deals` returns valid JSON array
- [ ] `/api/deals` handles empty results gracefully
- [ ] `/api/products/{id}` includes `promotions` array
- [ ] `promotions` array is empty when no deals apply
- [ ] Deal images load properly in frontend
- [ ] Hebrew text in titles/descriptions renders correctly