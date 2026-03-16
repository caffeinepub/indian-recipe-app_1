export type Language = "english" | "hindi" | "hinglish";

export type TranslationKey =
  | "app.title"
  | "app.tagline"
  | "app.tagline2"
  | "search.placeholder"
  | "category.all"
  | "category.breakfast"
  | "category.lunch"
  | "category.dinner"
  | "category.snacks"
  | "category.desserts"
  | "category.drinks"
  | "header.manage_recipes"
  | "recipes.count.one"
  | "recipes.count.many"
  | "recipes.not_found"
  | "recipes.clear_search"
  | "recipes.browse_all"
  | "recipes.for_query"
  | "recipes.in_category"
  | "detail.ingredients"
  | "detail.instructions"
  | "detail.prep"
  | "detail.cook"
  | "detail.serves"
  | "detail.servings"
  | "detail.close"
  | "detail.serving_label"
  | "badge.veg"
  | "badge.nonveg"
  | "admin.title"
  | "admin.add_recipe"
  | "admin.edit_recipe"
  | "admin.new_recipe"
  | "admin.update_recipe"
  | "admin.cancel"
  | "admin.recipe_name"
  | "admin.category"
  | "admin.type"
  | "admin.prep_time"
  | "admin.cook_time"
  | "admin.serving_size"
  | "admin.rating"
  | "admin.image_url"
  | "admin.description"
  | "admin.ingredients"
  | "admin.ingredients_hint"
  | "admin.instructions"
  | "admin.instructions_hint"
  | "admin.veg"
  | "admin.nonveg"
  | "admin.in_database"
  | "admin.close"
  | "footer.built_with"
  | "shopping.add_button"
  | "shopping.title"
  | "shopping.clear"
  | "shopping.share"
  | "shopping.copied"
  | "shopping.empty"
  | "shopping.items_left"
  | "shopping.added_toast"
  | "fridge.button"
  | "fridge.title"
  | "fridge.subtitle"
  | "fridge.search_input"
  | "fridge.find_button"
  | "fridge.results_title"
  | "fridge.no_results"
  | "fridge.match_label"
  | "fridge.clear"
  | "fridge.add";

type Translations = Record<TranslationKey, string>;

const english: Translations = {
  "app.title": "Rasoi",
  "app.tagline": "Explore the Flavors of India",
  "app.tagline2":
    "From crispy dosas to fragrant biryanis — discover the rich tapestry of Indian cuisine",
  "search.placeholder": "Search recipes or ingredients...",
  "category.all": "All",
  "category.breakfast": "Breakfast",
  "category.lunch": "Lunch",
  "category.dinner": "Dinner",
  "category.snacks": "Snacks",
  "category.desserts": "Desserts",
  "category.drinks": "Drinks",
  "header.manage_recipes": "Manage Recipes",
  "recipes.count.one": "recipe",
  "recipes.count.many": "recipes",
  "recipes.not_found": "No recipes found",
  "recipes.clear_search": "Clear search",
  "recipes.browse_all": "Browse all recipes",
  "recipes.for_query": "for",
  "recipes.in_category": "No recipes in the",
  "detail.ingredients": "Ingredients",
  "detail.instructions": "Instructions",
  "detail.prep": "Prep:",
  "detail.cook": "Cook:",
  "detail.serves": "Serves",
  "detail.servings": "Servings",
  "detail.close": "Close",
  "detail.serving_label": "Adjust Servings",
  "badge.veg": "Veg",
  "badge.nonveg": "Non-Veg",
  "admin.title": "Recipe Manager",
  "admin.add_recipe": "Add Recipe",
  "admin.edit_recipe": "Edit Recipe",
  "admin.new_recipe": "New Recipe",
  "admin.update_recipe": "Update Recipe",
  "admin.cancel": "Cancel",
  "admin.recipe_name": "Recipe Name",
  "admin.category": "Category",
  "admin.type": "Type",
  "admin.prep_time": "Prep Time",
  "admin.cook_time": "Cook Time",
  "admin.serving_size": "Serving Size",
  "admin.rating": "Rating (1-5)",
  "admin.image_url": "Image URL",
  "admin.description": "Description",
  "admin.ingredients": "Ingredients",
  "admin.ingredients_hint": "(one per line)",
  "admin.instructions": "Instructions",
  "admin.instructions_hint": "(one step per line)",
  "admin.veg": "🌿 Vegetarian",
  "admin.nonveg": "🍗 Non-Vegetarian",
  "admin.in_database": "recipes in database",
  "admin.close": "Close admin panel",
  "footer.built_with": "Built with",
  "shopping.add_button": "Add to Shopping List",
  "shopping.title": "Shopping List",
  "shopping.clear": "Clear List",
  "shopping.share": "Share",
  "shopping.copied": "Copied!",
  "shopping.empty": "No items in list",
  "shopping.items_left": "items left",
  "shopping.added_toast": "Added to shopping list!",
  "fridge.button": "Fridge Check",
  "fridge.title": "What's in your fridge?",
  "fridge.subtitle":
    "Select ingredients you have and we'll find matching recipes",
  "fridge.search_input": "Type an ingredient...",
  "fridge.find_button": "Find Recipes",
  "fridge.results_title": "Matching Recipes",
  "fridge.no_results": "No recipes found with these ingredients",
  "fridge.match_label": "match",
  "fridge.clear": "Clear All",
  "fridge.add": "Add",
};

const hindi: Translations = {
  "app.title": "रसोई",
  "app.tagline": "भारत के स्वादों की सैर करें",
  "app.tagline2": "कुरकुरे डोसे से सुगंधित बिरयानी तक — भारतीय खाने की विविधता खोजें",
  "search.placeholder": "रेसिपी या सामग्री खोजें...",
  "category.all": "सभी",
  "category.breakfast": "नाश्ता",
  "category.lunch": "दोपहर का खाना",
  "category.dinner": "रात का खाना",
  "category.snacks": "स्नैक्स",
  "category.desserts": "मिठाई",
  "category.drinks": "पेय",
  "header.manage_recipes": "रेसिपी प्रबंधित करें",
  "recipes.count.one": "रेसिपी",
  "recipes.count.many": "रेसिपियाँ",
  "recipes.not_found": "कोई रेसिपी नहीं मिली",
  "recipes.clear_search": "खोज हटाएं",
  "recipes.browse_all": "सभी रेसिपी देखें",
  "recipes.for_query": "के लिए",
  "recipes.in_category": "इस श्रेणी में कोई रेसिपी नहीं",
  "detail.ingredients": "सामग्री",
  "detail.instructions": "बनाने की विधि",
  "detail.prep": "तैयारी:",
  "detail.cook": "पकाने का समय:",
  "detail.serves": "परोसे",
  "detail.servings": "लोगों के लिए",
  "detail.close": "बंद करें",
  "detail.serving_label": "लोगों की संख्या",
  "badge.veg": "शाकाहारी",
  "badge.nonveg": "मांसाहारी",
  "admin.title": "रेसिपी प्रबंधक",
  "admin.add_recipe": "रेसिपी जोड़ें",
  "admin.edit_recipe": "रेसिपी संपादित करें",
  "admin.new_recipe": "नई रेसिपी",
  "admin.update_recipe": "रेसिपी अपडेट करें",
  "admin.cancel": "रद्द करें",
  "admin.recipe_name": "रेसिपी का नाम",
  "admin.category": "श्रेणी",
  "admin.type": "प्रकार",
  "admin.prep_time": "तैयारी का समय",
  "admin.cook_time": "पकाने का समय",
  "admin.serving_size": "कितने लोगों के लिए",
  "admin.rating": "रेटिंग (1-5)",
  "admin.image_url": "चित्र लिंक",
  "admin.description": "विवरण",
  "admin.ingredients": "सामग्री",
  "admin.ingredients_hint": "(एक पंक्ति में एक)",
  "admin.instructions": "बनाने की विधि",
  "admin.instructions_hint": "(एक पंक्ति में एक चरण)",
  "admin.veg": "🌿 शाकाहारी",
  "admin.nonveg": "🍗 मांसाहारी",
  "admin.in_database": "रेसिपियाँ डेटाबेस में",
  "admin.close": "एडमिन पैनल बंद करें",
  "footer.built_with": "के साथ बनाया गया",
  "shopping.add_button": "शॉपिंग लिस्ट में जोड़ें",
  "shopping.title": "शॉपिंग लिस्ट",
  "shopping.clear": "लिस्ट साफ करें",
  "shopping.share": "शेयर करें",
  "shopping.copied": "कॉपी हो गया!",
  "shopping.empty": "लिस्ट खाली है",
  "shopping.items_left": "आइटम बचे हैं",
  "shopping.added_toast": "शॉपिंग लिस्ट में जुड़ गया!",
  "fridge.button": "फ्रिज चेक",
  "fridge.title": "फ्रिज में क्या है?",
  "fridge.subtitle": "जो सामग्री आपके पास है वो चुनें",
  "fridge.search_input": "सामग्री लिखें...",
  "fridge.find_button": "रेसिपी खोजें",
  "fridge.results_title": "मिलती रेसिपी",
  "fridge.no_results": "कोई रेसिपी नहीं मिली",
  "fridge.match_label": "मिलान",
  "fridge.clear": "सब हटाएं",
  "fridge.add": "जोड़ें",
};

const hinglish: Translations = {
  "app.title": "Rasoi",
  "app.tagline": "India ke Zaikon ka Safar",
  "app.tagline2":
    "Crispy dose se lekar fragrant biryani tak — Indian khane ki duniya explore karo",
  "search.placeholder": "Recipe dhundho ya samagri likhein...",
  "category.all": "Sab",
  "category.breakfast": "Nashta",
  "category.lunch": "Dopahar",
  "category.dinner": "Raat ka Khana",
  "category.snacks": "Snacks",
  "category.desserts": "Mithai",
  "category.drinks": "Peena",
  "header.manage_recipes": "Recipes Manage Karo",
  "recipes.count.one": "recipe",
  "recipes.count.many": "recipes",
  "recipes.not_found": "Koi recipe nahi mili",
  "recipes.clear_search": "Search hatao",
  "recipes.browse_all": "Saari recipes dekho",
  "recipes.for_query": "ke liye",
  "recipes.in_category": "Is category mein koi recipe nahi",
  "detail.ingredients": "Samagri",
  "detail.instructions": "Banane ka Tarika",
  "detail.prep": "Taiyari:",
  "detail.cook": "Pakane ka Waqt:",
  "detail.serves": "Logo ke liye",
  "detail.servings": "Log",
  "detail.close": "Band Karo",
  "detail.serving_label": "Kitne log khayenge?",
  "badge.veg": "Veg",
  "badge.nonveg": "Non-Veg",
  "admin.title": "Recipe Manager",
  "admin.add_recipe": "Recipe Jodo",
  "admin.edit_recipe": "Recipe Badlo",
  "admin.new_recipe": "Nayi Recipe",
  "admin.update_recipe": "Recipe Update Karo",
  "admin.cancel": "Ruk Jao",
  "admin.recipe_name": "Recipe ka Naam",
  "admin.category": "Category",
  "admin.type": "Prakar",
  "admin.prep_time": "Taiyari ka Waqt",
  "admin.cook_time": "Pakane ka Waqt",
  "admin.serving_size": "Kitne Logo ke Liye",
  "admin.rating": "Rating (1-5)",
  "admin.image_url": "Image Link",
  "admin.description": "Kya Hai Yeh Dish",
  "admin.ingredients": "Samagri",
  "admin.ingredients_hint": "(ek line mein ek cheez)",
  "admin.instructions": "Banane ka Tarika",
  "admin.instructions_hint": "(ek line mein ek step)",
  "admin.veg": "🌿 Vegetarian",
  "admin.nonveg": "🍗 Non-Vegetarian",
  "admin.in_database": "recipes hain database mein",
  "admin.close": "Admin panel band karo",
  "footer.built_with": "Banaya gaya",
  "shopping.add_button": "Shopping List mein Add karo",
  "shopping.title": "Shopping List",
  "shopping.clear": "List Clear Karo",
  "shopping.share": "Share Karo",
  "shopping.copied": "Copy ho gaya!",
  "shopping.empty": "List mein kuch nahi",
  "shopping.items_left": "items bache hain",
  "shopping.added_toast": "Shopping list mein add ho gaya!",
  "fridge.button": "Fridge Check",
  "fridge.title": "Fridge mein kya hai?",
  "fridge.subtitle": "Jo samagri hai wo chunein",
  "fridge.search_input": "Samagri likhein...",
  "fridge.find_button": "Recipe Dhundho",
  "fridge.results_title": "Milti Recipes",
  "fridge.no_results": "Koi recipe nahi mili",
  "fridge.match_label": "match",
  "fridge.clear": "Sab Hatao",
  "fridge.add": "Add Karo",
};

export const translations: Record<Language, Translations> = {
  english,
  hindi,
  hinglish,
};
