# Rasoi — Full Hinglish Conversion

## Current State
- App has 3 language modes: English, Hindi, Hinglish
- Hinglish mode converts UI labels via translations.ts
- Recipe content (ingredients, steps, descriptions, names) is in English
- hinglishConverter.ts provides partial smart fallback for ingredients/steps when Hinglish is selected
- User cannot understand recipe instructions in Hinglish mode because steps/ingredients remain mostly in English

## Requested Changes (Diff)

### Add
- Massively expanded hinglishConverter with 200+ replacement terms covering: all common Indian ingredients, cooking verbs, cooking methods, kitchen tools, time expressions, quantity descriptors, texture/taste words, and spice names
- Apply Hinglish conversion to recipe DESCRIPTIONS and recipe NAMES display in Hinglish mode
- Apply Hinglish to shopping list items when language is Hinglish

### Modify
- Set default language to 'hinglish' in LanguageContext (so app opens in Hinglish by default)
- RecipeDetail: apply toHinglish() to recipe.description display in Hinglish mode
- RecipeCard: apply toHinglish() to recipe.description in Hinglish mode
- hinglishConverter: expand REPLACEMENTS array to cover much broader vocabulary
- App.tsx: search "We couldn't find" hardcoded English strings — replace with t() keys

### Remove
- Nothing removed

## Implementation Plan
1. Expand hinglishConverter.ts with 200+ new replacement pairs
2. Update LanguageContext.tsx default to 'hinglish'
3. Update RecipeCard.tsx to apply toHinglish() to description when language === 'hinglish'
4. Update RecipeDetail.tsx to apply toHinglish() to recipe.description when language === 'hinglish'
5. Fix hardcoded English strings in App.tsx
6. Validate and build
