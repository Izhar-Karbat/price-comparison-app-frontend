# Detailed Component Generation Specifications

Based on the reference design, here are the exact components I need generated with precise specifications:

---

## 1. SAVINGS METER (Main Circular Progress Ring)

### **Visual Requirements:**
- **Base**: Large circular container, ~200px diameter
- **Background**: Cream (#F7F5F3) with strong raised effect
- **Progress Ring**: Sage green (#8FBF9F), ~14px thick stroke
- **Accent Arc**: Yellow (#F7E6A3), thin ~3px stroke, positioned at top
- **Center Heart**: Green circle (#8FBF9F) with white heart icon
- **Typography**: "3345" in large bold black, "saved" in smaller gray

### **Depth Effect Needed:**
- **Outer Ring**: Highly raised from background (8-12px depth illusion)
- **Shadow**: Large, soft, bottom-right (offset 8px, 8px)
- **Inner Surface**: Slightly recessed to create depth contrast
- **Heart Button**: Additional raised effect within the meter

### **States:**
- Static display state (what we see in reference)
- Potential animated progress state for future

---

## 2. FEATURED PRODUCT CARD

### **Visual Requirements:**
- **Container**: Large rectangular card, full-width minus margins
- **Background**: Cream (#F7F5F3) with prominent raised effect
- **Content Layout**:
  - Left: Product image (~80x100px, rounded corners)
  - Center: Text content (label, name, price)
  - Right: Green circular "+" button
- **Save Badge**: Pink background (#FFE5E5) with red text "Save 30%"

### **Depth Effect Needed:**
- **Card Body**: Strong raised effect (6-10px depth illusion)
- **Add Button**: Additional raised green circle with shadow
- **Image Area**: Slightly recessed or flat within card
- **Save Badge**: Subtle raised pill shape

### **Interactive States:**
- Default: Raised appearance
- Pressed: Slightly inset (pressed down effect)
- Add button: Independent press state

---

## 3. TAB BUTTONS (This Week's Picks / Trending)

### **Visual Requirements:**
- **Shape**: Rounded pill buttons, full-width of container
- **Active State**: Green (#8FBF9F) background, white text
- **Inactive State**: Cream background, gray text
- **Typography**: Medium weight, ~14px font

### **Depth Effect Needed:**
- **Active Button**: Raised effect with green shadow glow
- **Inactive Button**: Subtle raised effect or flat
- **Press States**: Both buttons have inset effect when pressed
- **Transition**: Smooth 200ms between active/inactive

### **Measurements:**
- Height: ~46px
- Border radius: ~23px (half of height)
- Horizontal padding: ~20px

---

## 4. PRODUCT CARDS (Horizontal Scroll)

### **Visual Requirements:**
- **Size**: ~140px wide, variable height
- **Layout**: Product image on top, text below
- **Content**: Product name, brand, price (green), crossed-out old price
- **Background**: Cream (#F7F5F3)
- **Corner Radius**: ~16px

### **Depth Effect Needed:**
- **Card Container**: Medium raised effect (4-6px depth)
- **Product Image**: Flush with card or slightly recessed
- **Press State**: Inset effect when touched

### **Measurements:**
- Width: 140px
- Image height: ~120px
- Padding: 12px
- Text spacing: 2-6px between elements

---

## 5. SECONDARY PRODUCT CARDS (Bottom Grid)

### **Visual Requirements:**
- **Layout**: 2 cards side-by-side
- **Content**: Large product image area, price, brand below
- **Background**: Cream (#F7F5F3)
- **Shape**: Rectangular with rounded corners

### **Depth Effect Needed:**
- **Card Body**: Similar to product cards but potentially taller
- **Image Container**: Recessed area or padded space
- **Press State**: Inset effect when touched

---

## 6. BOTTOM NAVIGATION BUTTONS

### **Visual Requirements:**
- **Count**: 3 circular buttons (List, Scan, Heart)
- **Center Button**: Larger than sides (~64px diameter)
- **Side Buttons**: Standard size (~50px diameter)
- **Icons**: List (lines), Scan (square), Heart (outline)
- **Colors**: Gray for inactive, green for active/center

### **Depth Effect Needed:**
- **All Buttons**: Raised circular effect
- **Center Button**: More prominent raise (deeper shadows)
- **Press States**: Inset effect when touched
- **Icon Treatment**: Icons sit on raised surface

---

## 7. HEADER ELEMENTS

### **Visual Requirements:**
- **Menu Button**: Pink hamburger lines (#F4B2B2)
- **Logo**: "PharmMate" text, medium weight
- **Cart Icon**: Simple bag outline, black
- **Profile Button**: Pink circular background (#F4B2B2), white person icon

### **Depth Effect Needed:**
- **Profile Button**: Small raised pink circle
- **Other Elements**: Flat or minimal raise
- **Press States**: Subtle inset effects

---

## 8. GENERAL UI ELEMENTS

### **Input Fields** (for other screens):
- **Shape**: Rounded rectangles
- **State**: Recessed/inset appearance (opposite of raised)
- **Focus**: Subtle glow or border change
- **Background**: Slightly darker cream

### **Modal Containers**:
- **Background**: Cream with strong raised effect
- **Size**: Various sizes for different modals
- **Corner Radius**: 20-24px for large modals, 16px for smaller

### **List Items**:
- **Background**: Cream with subtle raised effect
- **Separator**: Either raised divider lines or spacing
- **Press State**: Inset effect

---

## TECHNICAL SPECIFICATIONS

### **Color Palette:**
```
Primary Background: #F7F5F3 (Cream)
Primary Green: #8FBF9F (Sage)
Accent Pink: #F4B2B2 (Coral)
Text Dark: #3A3937 (Charcoal)
Text Light: #8A8680 (Gray)
Shadow Color: #D4D0CC (Darker cream)
Highlight: #FFFFFF (White)
```

### **Shadow System (5 Levels):**

1. **Subtle** (flat elements): offset 1,1 blur 2 opacity 0.1
2. **Light** (minor raised): offset 2,2 blur 4 opacity 0.15
3. **Medium** (standard raised): offset 4,4 blur 8 opacity 0.2
4. **Raised** (prominent): offset 6,6 blur 12 opacity 0.25
5. **Prominent** (hero elements): offset 8,8 blur 16 opacity 0.3

### **Inset Shadows (Pressed States):**
- **Light Press**: inset 2,2 blur 4 opacity 0.15
- **Medium Press**: inset 4,4 blur 6 opacity 0.2
- **Deep Press**: inset 6,6 blur 8 opacity 0.25

### **Animation Timings:**
- **Button Press**: 150ms ease-out
- **Tab Switch**: 200ms ease-in-out
- **Modal Appear**: 300ms ease-out
- **Scroll Physics**: Natural iOS bounce

---

## PRIORITY ORDER FOR GENERATION:

### **Phase 1 - Critical (Need First):**
1. Savings Meter (hero element)
2. Featured Product Card
3. Tab Buttons (active/inactive states)
4. Basic Product Cards

### **Phase 2 - Layout (Need Second):**
5. Bottom Navigation Buttons
6. Secondary Product Cards
7. Header Elements

### **Phase 3 - Polish (Need Last):**
8. Input Fields
9. Modal Containers
10. List Items

---

## GENERATION NOTES:

### **For AI Generation:**
- Focus on **realistic clay/ceramic texture**
- Shadows should look like **actual physical depth**
- Colors should be **soft and matte**, not glossy
- **Subtle texture** on surfaces (very fine grain)
- **Organic, hand-crafted feel** rather than digital

### **Reference Style:**
- Think **pottery studio aesthetic**
- **Warm, tactile materials**
- **Soft natural lighting** from top-left
- **Slight imperfections** that make it feel handmade
- **Consistent light source** across all components

### **Output Format Needed:**
- High-resolution PNG with transparency
- Multiple states per component (normal, pressed, active/inactive)
- Consistent lighting and perspective across all components
- Web-optimized file sizes for mobile performance

This specification gives you everything needed to generate the exact neumorphic components matching the reference design. Each component should feel like a physical clay object you could touch and press.