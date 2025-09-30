# Better DALL-E Prompts for UI Shadow Images

DALL-E interpreted "claymorphism" as literal clay objects. Here are better prompts that specify UI elements:

## 1. Raised Card Shadow (Simple & Clear)

**Prompt:**
```
Minimalist UI design: A flat rectangular card shape on a solid #F7F5F3 background.
The rectangle has rounded corners and two subtle shadows:
a light white glow on the top-left edge and a soft gray shadow on the bottom-right.
The card itself is the same #F7F5F3 color as the background.
Flat 2D design, NOT 3D rendered. User interface element, not a physical object.
Simple, clean, modern web design style.
```

## 2. Alternative Raised Card Prompt

**Prompt:**
```
Create a neumorphic UI card design element. Flat design on #F7F5F3 colored background.
Show a rounded rectangle with soft embossed effect created by shadows only.
Light source from top-left creating white highlight and dark shadow on opposite corner.
This is a 2D graphic design element for a mobile app interface, not a 3D object.
Minimalist style similar to Apple's design language.
```

## 3. Even Simpler Approach

**Prompt:**
```
Flat UI button design with soft shadows. Cream colored (#F7F5F3) rounded rectangle
on matching cream background. Add subtle drop shadow effect with light coming from
top-left corner. This is a 2D user interface element for a mobile app.
Style: soft, minimal, modern UI design. NOT a 3D rendering.
```

## 4. Most Direct Prompt

**Prompt:**
```
Draw a simple rounded rectangle shape on a #F7F5F3 background.
Add a subtle white shadow on the top and left edges.
Add a subtle gray shadow on the bottom and right edges.
Keep it completely flat and 2D - this is for a mobile app UI.
Style: minimalist user interface design element.
```

## Alternative Approach: Generate just the shadows

**Prompt for Shadow Only:**
```
Create a soft shadow shape only (no solid object).
The shadow should be for a rounded rectangle card.
Show only the gray shadow part that would appear under a raised card.
Transparent background except for the shadow.
Soft, blurred edges. UI design element shadow.
```

## Tips for DALL-E with UI Elements:

1. **Avoid these terms:** claymorphism, clay, 3D, plastic, material
2. **Use these terms:** UI, interface, flat design, 2D, app design, web design, neumorphic
3. **Be explicit:** Always say "2D" and "flat design"
4. **Reference known styles:** "Like Apple's design" or "Material Design style"
5. **Specify purpose:** "for mobile app" or "user interface element"

## Manual Alternative:

If DALL-E keeps making 3D objects, you could:

1. Use Figma/Sketch to create the shadow effects
2. Use CSS in a web browser to create and screenshot the effects
3. Use online neumorphism generators like:
   - neumorphism.io
   - neumorphic.design
   - hype4.academy/tools/neumorphism-generator

Then export as PNG images for your React Native app.