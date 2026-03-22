// Extra data for all 100 recipes: calories (kcal per serving) + chefTips in Hinglish
export interface RecipeExtra {
  calories: number;
  chefTips: string[];
}

export const RECIPE_EXTRAS: Record<number, RecipeExtra> = {
  1: {
    // Masala Dosa
    calories: 220,
    chefTips: [
      "Batter ko raat bhar ferment karne do — spongy dosa milega.",
      "Tawa ko medium-high heat pe rakho, thanda tawa pe dosa chipakta hai.",
      "Batter spread karte waqt ek hi baar circular motion mein ghoomao — baar baar mat ghoomao.",
    ],
  },
  2: {
    // Idli
    calories: 150,
    chefTips: [
      "Urad dal bilkul smooth grind karo — idli soft milegi.",
      "Mould ko pehle tel lagao, idli chipkegi nahi.",
      "Steam karne ke baad 2 min wait karo phir nikalo — toot nahi jayegi.",
    ],
  },
  3: {
    // Butter Chicken
    calories: 420,
    chefTips: [
      "Chicken ko pehle marinate karo kam se kam 4 ghante — flavor andar tak jaata hai.",
      "Gravy mein cream add karne ke baad flame low kar do, warna cream split ho jaati hai.",
      "Kasuri methi last mein dalo aur haath se crush karo — aroma double ho jaata hai.",
    ],
  },
  4: {
    // Chicken Biryani
    calories: 480,
    chefTips: [
      "Rice ko 70% pakao before dum — final dum mein puri pakegi.",
      "Dum pe rakhne se pehle tawa ke upar dekchi rakh do, base nahi jallega.",
      "Saffron ko warm milk mein 10 min soak karo, color aur mehak dono better honge.",
    ],
  },
  5: {
    // Samosa
    calories: 280,
    chefTips: [
      "Maida dough tight karo aur 30 min rest do — samosa crispy banega.",
      "Filling bilkul thandi ho phir samosa band karo, nahi toh dough soft ho jaata hai.",
      "Medium flame pe fry karo, high flame pe andar kacha reh jaata hai.",
    ],
  },
  6: {
    // Gulab Jamun
    calories: 320,
    chefTips: [
      "Khoya aur maida mix karte waqt gentle ho — dough zyada knead mat karo.",
      "Chashni ka temperature sahi ho — 1 taar ki chashni chahiye.",
      "Warm chashni mein hi jamun daalo, thandi mein nahi bhigte.",
    ],
  },
  7: {
    // Mango Lassi
    calories: 180,
    chefTips: [
      "Pake hue Alphonso ya Kesar aam use karo — taste best hoga.",
      "Dahi thanda ho toh extra refreshing lagta hai.",
      "Chini ki jagah honey use karo — healthier aur natural sweetness.",
    ],
  },
  8: {
    // Palak Paneer
    calories: 340,
    chefTips: [
      "Palak blanch karne ke baad ice water mein dip karo — color bright green rahega.",
      "Paneer ko pehle shallow fry karo — texture better hoti hai.",
      "Cream daalne se pehle flame ekdum low karo.",
    ],
  },
  9: {
    // Chole Bhature
    calories: 420,
    chefTips: [
      "Chole raat bhar bhigo do aur pressure cooker mein pakao — jaldi aur soft.",
      "Bhature ka dough maida aur sooji mix se banao — extra puffy banega.",
      "Amchur powder aur anardana dal lo chole mein — authentic taste aata hai.",
    ],
  },
  10: {
    // Dal Tadka
    calories: 280,
    chefTips: [
      "Dal pakane ke baad ek baar aur pressure cooker mein dal do — creamy texture milti hai.",
      "Tadka mein ghee use karo, oil nahi — flavor alag hi hota hai.",
      "Last mein lemon squeeze karo — freshness aa jaati hai.",
    ],
  },
  11: {
    // Masala Chai
    calories: 80,
    chefTips: [
      "Adrak aur elaichi pehle crush karke daalo — aroma double ho jaata hai.",
      "Chai ko boil karne se pehle low flame pe 5 min pakao — strong flavor aata hai.",
      "Kadak chai ke liye pani kam rakho, doodh zyada.",
    ],
  },
  12: {
    // Kheer
    calories: 300,
    chefTips: [
      "Kheer ko slow flame pe pakao aur lagaataar chalate raho — base nahi lagega.",
      "Doodh thoda reduce karo pehle phir rice daalo — creamy kheer milegi.",
      "Elaichi aur kesar last mein daalo, flavor zyada intense hoga.",
    ],
  },
  13: {
    // Aloo Paratha
    calories: 310,
    chefTips: [
      "Aloo bilkul dry mash karo, pani bilkul mat rakhna — paratha nahi phatega.",
      "Dough medium soft karo — na zyada hard na zyada soft.",
      "Dono taraf ghee laga ke seko — crispy aur golden milega.",
    ],
  },
  14: {
    // Pani Puri
    calories: 200,
    chefTips: [
      "Suji ki puri ke liye dough ekdum tight banao — crispy puri banega.",
      "Pani mein imli ka pani, pudina aur jeera powder sahi ratio mein daalo.",
      "Puri fry karte waqt ladle se press karo — phul jayegi.",
    ],
  },
  15: {
    // Rajma Chawal
    calories: 380,
    chefTips: [
      "Rajma raat bhar bhigo do aur pehle pressure cooker mein ache se pakao.",
      "Masala bhuno tab tak jab tak tel alag na ho jaaye — thick gravy milegi.",
      "Amchur ya tomato ka khattapan zaroor dalo.",
    ],
  },
  16: {
    // Paneer Tikka
    calories: 290,
    chefTips: [
      "Paneer ko pehle cubes mein kaat ke marinade mein raat bhar rakho.",
      "Tawa ya grill dono pe chal jaata hai — char marks ke liye high heat use karo.",
      "Marinade mein mustard oil zaroor dalo — authentic smoky flavor aata hai.",
    ],
  },
  17: {
    // Jalebi
    calories: 370,
    chefTips: [
      "Batter 2 din ferment karo — asli khatta swad aata hai.",
      "Chashni ek taar ki honi chahiye — zyada tight hogi toh jalebi sookh jayegi.",
      "Fry karte waqt circular motion mein batter daalo, bich se start karo.",
    ],
  },
  18: {
    // Rose Sharbat
    calories: 90,
    chefTips: [
      "Rose syrup asli gulab petals se banaya hua use karo — color aur fragrance better.",
      "Thanda paani use karo aur ice cubes dalo — summer mein best lagta hai.",
      "Basil seeds (sabja) dalo extra texture ke liye.",
    ],
  },
  19: {
    // Tandoori Chicken
    calories: 380,
    chefTips: [
      "Chicken pe deep cuts karo marinade se pehle — andar tak flavor jaata hai.",
      "Double marinade karo — pehle lemon aur salt, phir masala wala.",
      "Grill karne se pehle chicken room temperature pe lao — even cooking hogi.",
    ],
  },
  20: {
    // Pav Bhaji
    calories: 340,
    chefTips: [
      "Sabziyaan pressure cooker mein pakao pehle, phir mash karo achhe se.",
      "Butter generous amount mein dalo — yahi hai real taste.",
      "Pav ko butter lagake tawa pe seko jab tak golden brown na ho.",
    ],
  },
  21: {
    // Poha
    calories: 200,
    chefTips: [
      "Poha ko sirf 2-3 min pani mein bhigo — zyada nahi, warna soggy ho jaata hai.",
      "Tadka mein mustard seeds, curry leaves aur peanuts zaroor dalo.",
      "Nimbu ka ras aur hara dhania last mein dalo — freshness aati hai.",
    ],
  },
  22: {
    // Upma
    calories: 220,
    chefTips: [
      "Suji ko dry roast karo pehle jab tak golden na ho — raw smell jaati hai.",
      "Pani boiling hona chahiye jab suji daalo — lumps nahi banenge.",
      "Zyada vegetables dalo — nutritious aur colorful lagta hai.",
    ],
  },
  23: {
    // Uttapam
    calories: 240,
    chefTips: [
      "Batter dosa se thoda thick rakho — uttapam phula hua milega.",
      "Vegetables batter ke upar sprinkle karo aur halka press karo.",
      "Dhakkan lagake pako — vegetables andar tak pak jayengi.",
    ],
  },
  24: {
    // Vegetable Biryani
    calories: 360,
    chefTips: [
      "Basmati rice 30 min pehle bhigo do — long grain milega.",
      "Vegetables ko alag se sauté karo pehle, direct mat daalo.",
      "Dum ke time tight lid use karo ya atta se seal karo.",
    ],
  },
  25: {
    // Dal Makhani
    calories: 380,
    chefTips: [
      "Urad dal 8 ghante pehle bhigo do — jaldi pakegi.",
      "Slow flame pe ghanton pakao — creamy texture ke liye time chahiye.",
      "Last mein butter aur cream dalo aur 10 min slow flame pe pakao.",
    ],
  },
  26: {
    // Kadai Paneer
    calories: 350,
    chefTips: [
      "Sabse pehle dry spices ko kadai mein roast karo phir coarsely grind karo.",
      "Capsicum aur paneer ko alag se stir fry karo — texture maintain hoti hai.",
      "Masala bhuno jab tak tel alag na ho jaaye — flavors develop honge.",
    ],
  },
  27: {
    // Mutton Curry
    calories: 480,
    chefTips: [
      "Mutton ko kachchi papita ya dahi ke saath marinate karo — tender hoga.",
      "Slow cooking best hai mutton ke liye — pressure cooker mein 5-6 seeti lo.",
      "Whole spices pehle ghee mein bhuno — aroma puri curry mein phailega.",
    ],
  },
  28: {
    // Egg Curry
    calories: 320,
    chefTips: [
      "Ande ko pehle boil karne ke baad fork se prick karo — masala andar jaata hai.",
      "Shallow fry ande ko boiling se pehle — golden color aur better texture.",
      "Gravy mein aam pulp ya tomato paste dalo — richness aati hai.",
    ],
  },
  29: {
    // Kerala Fish Curry
    calories: 350,
    chefTips: [
      "Kudampuli (Gambooge) asli Kerala taste ke liye zaroor dalo.",
      "Coconut oil aur coconut milk use karo — authentic flavor.",
      "Fish dalte waqt zyada mat hilaao — toot jaati hai.",
    ],
  },
  30: {
    // Bhel Puri
    calories: 180,
    chefTips: [
      "Bhel serve karne se pehle hi banao — baad mein soggy ho jaata hai.",
      "Teen chutneys zaroor ho — meethi, teekhi aur hara dhania wali.",
      "Sev generous amount mein dalo last mein — crunch ke liye.",
    ],
  },
  31: {
    // Vada Pav
    calories: 310,
    chefTips: [
      "Vada ka batter medium thick rakho — zyada thin ho toh oil absorb hota hai.",
      "Chutney dry aur green dono lagao — yahi hai Mumbai wala taste.",
      "Vada hot serve karo, thanda vada pav ka maza aadha ho jaata hai.",
    ],
  },
  32: {
    // Aloo Tikki
    calories: 260,
    chefTips: [
      "Aloo mash karne se pehle steam karo, boil mat karo — drier hogi tikki.",
      "Cornflour ya arrowroot mix karo — tikki toot nahi gi.",
      "Tikki ko dono taraf golden brown hone do, bich mein mat palto baar baar.",
    ],
  },
  33: {
    // Dhokla
    calories: 160,
    chefTips: [
      "Besan batter raat bhar ferment karo — spongy dhokla milega.",
      "Baking soda aur citric acid last mein daalo aur fold karo gently.",
      "Steam pe dhakna lagao aur bich mein mat kholo.",
    ],
  },
  34: {
    // Rasgulla
    calories: 280,
    chefTips: [
      "Chhena ache se press karo — smooth, lump-free hona chahiye.",
      "Chashni wide pan mein banao taaki rasgulla phool sakein.",
      "Rasgulla thanda ho jaane ke baad hi serve karo — flavor settle hota hai.",
    ],
  },
  35: {
    // Gajar ka Halwa
    calories: 340,
    chefTips: [
      "Gajar ko kheene se pehle chhil lo — mote grater se nahi, thin grater se karo.",
      "Doodh mein pehle gaajar pakao jab tak doodh absorb na ho jaaye.",
      "Ghee generous amount mein dalo aur ache se bhuno — halwa shiny banega.",
    ],
  },
  36: {
    // Kaju Katli
    calories: 390,
    chefTips: [
      "Kaju bilkul dry grind karo — bina pani ke.",
      "Chashni ek taar ki honi chahiye — zyada pakane pe barfi hard ho jaati hai.",
      "Mixture warm ho tab roll out karo, thanda hone pe crumble ho jaata hai.",
    ],
  },
  37: {
    // Nimbu Pani
    calories: 60,
    chefTips: [
      "Black salt zaroor dalo — special flavor aata hai.",
      "Nimbu ko roll karo table pe pressing ke saath — zyada ras niklega.",
      "Pudina aur jeera powder dalo — spiced lemonade ban jaata hai.",
    ],
  },
  38: {
    // Thandai
    calories: 140,
    chefTips: [
      "Dry fruits aur spices raat bhar doodh mein bhigo do — rich flavor aata hai.",
      "Smooth paste banao — grainy thandai acchi nahi lagti.",
      "Thande doodh ke saath serve karo ekdum thanda — Holi ka mazaa!",
    ],
  },
  39: {
    // Aam Panna
    calories: 80,
    chefTips: [
      "Kacha aam roast karo — smoky flavor aata hai.",
      "Black salt aur jeera zaroor dalo — pura flavour is se aata hai.",
      "Concentrate banake rakh lo, serve karte waqt pani aur ice dalo.",
    ],
  },
  40: {
    // Chaas
    calories: 70,
    chefTips: [
      "Dahi fresh aur thanda use karo — khaata nahi hona chahiye.",
      "Jeera ko dry roast karke crush karo — flavour intense hota hai.",
      "Hari mirch aur adrak bilkul thodi matra mein dalo — mild kick aati hai.",
    ],
  },
  41: {
    // Laccha Paratha
    calories: 290,
    chefTips: [
      "Dough soft aur smooth karo — layers clearly banenge.",
      "Ghee aur dry flour each layer pe use karo — flaky laccha milega.",
      "Medium heat pe pakao, high heat pe layers nahi banteen.",
    ],
  },
  42: {
    // Shahi Paneer
    calories: 400,
    chefTips: [
      "Kaju aur khas khas ki paste gravy ka base hogi — zyada cook mat karo.",
      "Cream add karne ke baad heat low karo.",
      "Rose water ki ek chhoti boond last mein dalo — royal flavor aata hai.",
    ],
  },
  43: {
    // Chicken Korma
    calories: 450,
    chefTips: [
      "Fried onion paste banao pehle — korma ki base yehi hoti hai.",
      "Dahi room temperature pe hona chahiye — gravy split nahi hogi.",
      "Kewra water last mein dalo — traditional korma aroma ke liye.",
    ],
  },
  44: {
    // Baingan Bharta
    calories: 220,
    chefTips: [
      "Baingan seedha gas flame pe jalaao — asli smoky flavor sirf isi se aata hai.",
      "Baingan puri tarah jal jaaye andar se — check karo toothpick se.",
      "Sarson ka tel use karo — authentic Punjabi taste.",
    ],
  },
  45: {
    // Misal Pav
    calories: 320,
    chefTips: [
      "Matki usal ko karkara pakao, zyada gila mat karo.",
      "Farsan (mixture) generous amount mein dalo — crunch zaroor hona chahiye.",
      "Teekha tarri alag se serve karo jisse log apni pasand ka spice adjust kar sakein.",
    ],
  },
  46: {
    // Seekh Kebab
    calories: 300,
    chefTips: [
      "Keema ache se pasao — roasted chana powder dalo binding ke liye.",
      "Seekh pe lagane ke baad fridge mein 30 min rakho — better shape milta hai.",
      "Charcoal grill se banaoge toh smoky flavor aayega.",
    ],
  },
  47: {
    // Besan Ladoo
    calories: 360,
    chefTips: [
      "Besan ko low flame pe ghee mein roast karo — zyada time lagega par taste lajawab hoga.",
      "Besan ka color golden honey jaisa hona chahiye, dark nahi.",
      "Mix thanda hone par hi balls banao, warna haath pe chipkta hai.",
    ],
  },
  48: {
    // Shrikhand
    calories: 280,
    chefTips: [
      "Dahi ko muslin cloth mein 8 ghante hang karo — puri chakka ban jaati hai.",
      "Powdered sugar use karo — granular chini dissolve nahi hoti.",
      "Saffron warm doodh mein mix karo pehle phir dalo.",
    ],
  },
  49: {
    // Matar Paneer
    calories: 310,
    chefTips: [
      "Fresh matar use karo season mein — frozen bhi chalta hai par fresh best hai.",
      "Paneer pehle water mein soak karo — soft rahega.",
      "Tomato-onion paste ache se bhuno jab tak masala oil release na kare.",
    ],
  },
  50: {
    // Kadhi Pakora
    calories: 290,
    chefTips: [
      "Dahi sour hona chahiye kadhi ke liye — khatti kadhi best hoti hai.",
      "Besan-dahi mix mein koi lumps na ho — smooth mix se smooth kadhi.",
      "Tadka mein red mirch aur methi daana zaroor dalo.",
    ],
  },
  51: {
    // Chicken 65
    calories: 350,
    chefTips: [
      "Chicken ke pieces chhote kato — jaldi fry hote hain aur crispy bante hain.",
      "Double fry karo — pehle medium flame, phir high flame pe.",
      "Curry leaves aur green chili tarka last mein dalo.",
    ],
  },
  52: {
    // Pista Kulfi
    calories: 260,
    chefTips: [
      "Doodh ko 1/3 reduce karo slow flame pe — rich creamy base milega.",
      "Kulfi moulds mein daalte waqt koi air bubbles na rahe.",
      "Set hone ke baad 6 ghante minimum freezer mein rakho.",
    ],
  },
  53: {
    // Pesarattu
    calories: 190,
    chefTips: [
      "Moong dal 4 ghante bhigo do — easy grind hota hai.",
      "Batter mein hing aur ginger zaroor daalo.",
      "Tawa hot hona chahiye — medium flame pe banao crispy pesarattu ke liye.",
    ],
  },
  54: {
    // Appam
    calories: 200,
    chefTips: [
      "Rice batter smooth aur pouring consistency mein rakho.",
      "Special appam pan (chatty) use karo — center thick edges thin ho.",
      "Coconut milk ya egg curry ke saath serve karo — perfect Kerala breakfast.",
    ],
  },
  55: {
    // Prawn Masala
    calories: 320,
    chefTips: [
      "Jhinga fresh use karo aur de-vein zaroor karo.",
      "Zyada mat pakao — jhinga rubber ban jaata hai.",
      "Coconut milk dalo last mein aur 2 min se zyada mat pakao.",
    ],
  },
  56: {
    // Saag Aloo
    calories: 240,
    chefTips: [
      "Saag ko blanch karne ke baad coarsely chop karo — bilkul smooth puree mat banao.",
      "Aloo ko pehle shallow fry karo — crispy edges se dish ka texture acha lagta hai.",
      "Makhan ya ghee se finish karo.",
    ],
  },
  57: {
    // Sweet Lassi
    calories: 150,
    chefTips: [
      "Thick dahi use karo — watery dahi se thin lassi banti hai.",
      "Malai wali cream top pe lagao — restaurant style lassi.",
      "Gulab water ki 2 boond dalo — rose flavor aayega.",
    ],
  },
  58: {
    // Badam Milk
    calories: 160,
    chefTips: [
      "Badam raat bhar bhigo do aur chhilka utaaro — smooth paste banta hai.",
      "Full fat doodh use karo — rich aur creamy milkshake.",
      "Warm ya thanda dono tarah serve kar sakte hain — dono mein mazaa hai.",
    ],
  },
  59: {
    // Haleem
    calories: 420,
    chefTips: [
      "Gosht aur dals ko raat bhar bhigo do aur 3-4 ghante cook karo.",
      "Blend karne ke baad kuch meat ke pieces chhodte rehne do — texture ke liye.",
      "Fried onion, nimbu aur ginger julienne garnish zaroori hai.",
    ],
  },
  60: {
    // Fish Tikka
    calories: 280,
    chefTips: [
      "Fish ke thick pieces kato — thin pieces tikke se pehle toot jaate hain.",
      "Carom seeds (ajwain) marinade mein zaroor dalo — fish ka swad enhance hota hai.",
      "Grill se pehle fish ko paper towel se dry karo — better char marks.",
    ],
  },
  61: {
    // Dahi Vada
    calories: 220,
    chefTips: [
      "Vade ko warm paani mein 30 min soak karo fry ke baad — soft hote hain.",
      "Dahi mein sugar dalo — meetha-khatta balance perfect lagta hai.",
      "Teekhi chutney, meethi chutney aur roasted jeera powder zaroor dalo.",
    ],
  },
  62: {
    // Medu Vada
    calories: 230,
    chefTips: [
      "Urad dal batter bilkul fluffy phento — vada crispy banega.",
      "Batter mein ice cold water dalo — vada phula hua banega.",
      "Wet haath se shape do aur sidha oil mein daal do.",
    ],
  },
  63: {
    // Rava Idli
    calories: 180,
    chefTips: [
      "Suji ko dry roast karo pehle — raw smell chali jaati hai.",
      "Batter ko 20 min rest do pehle steaming ke — suji phool jaati hai.",
      "Eno fruit salt last mein dalo aur turant steam karo.",
    ],
  },
  64: {
    // Chicken Tikka Masala
    calories: 460,
    chefTips: [
      "Tikka pehle grill ya broil karo, phir gravy mein daalo — smoky flavor.",
      "Gravy mein cashew paste dalo richness ke liye.",
      "Butter aur cream ka balance sahi rakho — gravy smooth aur glossy hogi.",
    ],
  },
  65: {
    // Rogan Josh
    calories: 490,
    chefTips: [
      "Kashmiri red chili use karo — deep red color aata hai bina zyada teekha hue.",
      "Mawal flowers use karo agar milein — authentic Kashmiri color aata hai.",
      "Slow cook karo at least 1.5 ghante — mutton melt-in-mouth hoga.",
    ],
  },
  66: {
    // Achari Paneer
    calories: 330,
    chefTips: [
      "Achar masala ready-made use kar sakte hain ya ghar pe bana sakte hain.",
      "Sarson ka tel use karo — achari flavor authentic hota hai.",
      "Paneer ko zyada mat pakao warna rubbery ho jaata hai.",
    ],
  },
  67: {
    // Moong Dal Khichdi
    calories: 260,
    chefTips: [
      "Dal aur rice ki ratio 1:1 rakho — creamy khichdi milegi.",
      "Ghee ka tadka generous amount mein dalo — comfort food yahi se banta hai.",
      "Dahi ya papad ke saath serve karo — classic combination.",
    ],
  },
  68: {
    // Mysore Pak
    calories: 380,
    chefTips: [
      "Ghee bahut zyada lagta hai — real Mysore pak mein ghee equal amount hota hai.",
      "Besan mix karte waqt lumps bilkul nahi hone chahiye.",
      "Set karne ke liye greased plate pe dalo aur fan ke neeche thanda karo.",
    ],
  },
  69: {
    // Rasmalai
    calories: 290,
    chefTips: [
      "Chhena bilkul smooth hona chahiye — rasmalai soft milegi.",
      "Balls ko boiling chashni mein daalo aur dhak ke pakao.",
      "Rab (rabdi) ko bahut slow flame pe ghantaon pakao — thick hoga.",
    ],
  },
  70: {
    // Ghevar
    calories: 350,
    chefTips: [
      "Batter bilkul pani ki tarah thin hona chahiye — thick batter se structure nahi banta.",
      "Oil bahut garam hona chahiye — batter daalnse pe khud structure banana chahiye.",
      "Chashni mein dip karo aur rabdi se garnish karo — traditional style.",
    ],
  },
  71: {
    // Kachori
    calories: 290,
    chefTips: [
      "Maida dough mein moyan (ghee ya oil) zaroor dalo — crispy kachori milegi.",
      "Filling mein dal sahi se pakao aur dry rakho.",
      "Medium heat pe fry karo — agar garam oil mein daali toh fatt jaayegi.",
    ],
  },
  72: {
    // Dahi Puri
    calories: 210,
    chefTips: [
      "Puri tap karo pehle, phir filling bharo aur turant serve karo.",
      "Dahi thanda aur beaten hona chahiye — smooth pour ke liye.",
      "Sev last mein dalo — crunch bana rahe.",
    ],
  },
  73: {
    // Litti Chokha
    calories: 340,
    chefTips: [
      "Sattu mein pickle oil ya sarson ka tel zaroor milao — asli Bihar wala taste.",
      "Litti ko direct coals pe seko — smoky flavor asli wala aata hai.",
      "Chokha ke liye baigan seedha aag pe bhuno.",
    ],
  },
  74: {
    // Chicken Chettinad
    calories: 470,
    chefTips: [
      "Kalpasi aur marathi mokku use karo — ye rare Chettinad spices hain.",
      "Freshly ground spice paste use karo — readymade powder se alag taste hota hai.",
      "Coconut aur khas khas paste dal ke gravy thick banao.",
    ],
  },
  75: {
    // Methi Thepla
    calories: 210,
    chefTips: [
      "Methi ko salt lagake 10 min rakho aur nichar lo — bitterness kum hoti hai.",
      "Dahi dough mein dalo — thepla soft rehta hai kaafi din tak.",
      "Thin roll karo — jitna thin utna crispy.",
    ],
  },
  76: {
    // Suji Halwa
    calories: 330,
    chefTips: [
      "Suji ko ghee mein golden brown tak roast karo — raw smell aur flavor done hoga.",
      "Pani ya doodh garam daalo — ek saath daalte waqt be careful raho.",
      "Cardamom aur kesar dalo — classic halwa flavour.",
    ],
  },
  77: {
    // Kokum Sharbat
    calories: 70,
    chefTips: [
      "Kokum concentrate pehle banao — concentrate refrigerator mein 2 week tak chalta hai.",
      "Black salt aur roasted jeera powder dalo — digestive bhi banta hai.",
      "Ice cold pani use karo — coconut water se bhi bana sakte hain.",
    ],
  },
  78: {
    // Sol Kadhi
    calories: 60,
    chefTips: [
      "Fresh coconut milk ghare pe nikalo — tetrapak se better hota hai.",
      "Kokum ko pani mein 30 min soak karo pehle.",
      "Serve karne se pehle strain karo — smooth sol kadhi milegi.",
    ],
  },
  79: {
    // Boondi Raita
    calories: 140,
    chefTips: [
      "Boondi ko warm paani mein 10 min soak karo phir dahi mein daalo — soft hogi.",
      "Dahi pehle smooth phento — lumps nahi rahne chahiye.",
      "Roasted cumin powder aur black salt zaroor dalo.",
    ],
  },
  80: {
    // Tandoori Roti
    calories: 130,
    chefTips: [
      "Dough medium soft karo — na bahut stiff na bahut loose.",
      "Tawa pe banate waqt direct flame pe thodi der ke liye rakh do — char spots aate hain.",
      "Butter ya ghee hot roti pe lagao aur khao.",
    ],
  },
  81: {
    // Pongal
    calories: 260,
    chefTips: [
      "Rice aur moong dal 2:1 ratio mein lo.",
      "Ghee generous amount mein dalo — less ghee Pongal ka mazaa kum kar deta hai.",
      "Curry leaves, ginger aur black pepper zaroor dalo.",
    ],
  },
  82: {
    // Bread Pakora
    calories: 280,
    chefTips: [
      "Besan batter thick rakho — pura bread coat hona chahiye.",
      "Filling ke liye spiced aloo paste use karo — bland nahi lagega.",
      "Chaat masala sprinkle karo serve karte waqt.",
    ],
  },
  83: {
    // Malai Kofta
    calories: 440,
    chefTips: [
      "Paneer ya aloo mixture mein cornstarch dalo — kofta fry karte waqt tootega nahi.",
      "Gravy ke liye kaju-onion paste use karo — rich creamy gravy milegi.",
      "Kofte ko gravy mein sirf serve karne se pehle daalo — soggy nahi honge.",
    ],
  },
  84: {
    // Paneer Bhurji
    calories: 270,
    chefTips: [
      "Paneer medium rough crumble karo — zyada fine mat karo.",
      "Onion aur capsicum ache se sauté karo pehle.",
      "Kasuri methi aur amchur dalo — tanginess aati hai.",
    ],
  },
  85: {
    // Chana Masala
    calories: 290,
    chefTips: [
      "Kala chana ya white chana dono se banta hai — kale ka flavor stronger hota hai.",
      "Pomegranate powder (anardana) dalo — sour flavor unique hoti hai.",
      "Chai ki patti wali tea bag saath mein pressure cooker mein pakao — dark color.",
    ],
  },
  86: {
    // Keema Matar
    calories: 380,
    chefTips: [
      "Keema ache quality ka lo — fat-to-meat ratio sahi hona chahiye.",
      "Masala dry roast karke grind karo — better flavour.",
      "Matar last mein daalo — zyada pakane pe mushy ho jaate hain.",
    ],
  },
  87: {
    // Aloo Gobi
    calories: 200,
    chefTips: [
      "Gobi ko alag se roast karo oven ya kadai mein — caramelized flavor aata hai.",
      "Zyada paani mat dalo — dry style aloo gobi best hoti hai.",
      "Kasuri methi aur amchur last mein dalo.",
    ],
  },
  88: {
    // Momos
    calories: 250,
    chefTips: [
      "Maida dough hard karo — thin wrap ke liye zaroor.",
      "Pleating practice lagti hai — YouTube pe dekh ke sikho step by step.",
      "Schezwan chutney ke saath serve karo — classic pairing.",
    ],
  },
  89: {
    // Sabudana Khichdi
    calories: 290,
    chefTips: [
      "Sabudana 4-6 ghante bhigo do — grains alag alag rehne chahiye.",
      "Before cooking test karo — ek grain press karo, smoothly crush ho jaaye toh ready hai.",
      "Mungfali ka powder dalo — authentic taste aur texture.",
    ],
  },
  90: {
    // Malpua
    calories: 360,
    chefTips: [
      "Batter mein fennel seeds aur cardamom dalo — traditional flavor.",
      "Chashni mein sidha dip karo hot malpua ko — soak hone do.",
      "Rabdi ke saath serve karo — royal meetha banta hai.",
    ],
  },
  91: {
    // Kulcha
    calories: 280,
    chefTips: [
      "Dough mein dahi dalo — kulcha soft milega.",
      "Filling mein amchur aur chaat masala zaroor dalo.",
      "Tawa pe ek taraf pakao phir direct flame pe dono taraf char marks lao.",
    ],
  },
  92: {
    // Veg Pulao
    calories: 310,
    chefTips: [
      "Basmati rice 20 min bhigo do aur drain karo pehle.",
      "Masale ko ghee mein ache se bhuno before vegetables daalne ke.",
      "Rice:Water ratio 1:1.75 — ekdum perfect fluffy pulao.",
    ],
  },
  93: {
    // Handi Chicken
    calories: 430,
    chefTips: [
      "Mitti ki handi use karo agar ho sake — earthy flavor aata hai.",
      "Dum pe pakao tight lid se — sabke juices andar rehte hain.",
      "Garnish mein hara dhania aur cream zaroor lagao.",
    ],
  },
  94: {
    // Aloo Bonda
    calories: 240,
    chefTips: [
      "Aloo mix dry honi chahiye — paani wali filling se bonda fatt jaata hai.",
      "Batter medium thick rakho — na bahut thin na bahut thick.",
      "Coconut chutney ke saath serve karo — South Indian style.",
    ],
  },
  95: {
    // Veg Korma
    calories: 360,
    chefTips: [
      "Kaju aur coconut ki paste gravy ka base hai — smooth grind karo.",
      "Spices ko ache se bhuno aur paste ke saath mix karo.",
      "Cream ya coconut milk last mein dalo — korma velvety hogi.",
    ],
  },
  96: {
    // Imarti
    calories: 340,
    chefTips: [
      "Urad dal batter thick aur smooth hona chahiye.",
      "Piping bag ya squeezy bottle use karo — symmetrical design ke liye.",
      "Chashni mein kesar aur orange color dalo — professional look.",
    ],
  },
  97: {
    // Matka Kulfi
    calories: 260,
    chefTips: [
      "Doodh ko slow flame pe 1/3 reduce karo pehle — rich base.",
      "Dry fruits aur rose water dalo — flavour premium hota hai.",
      "Mitti ke matke mein set karo — mitti ka flavor kulfi ko unique bana deta hai.",
    ],
  },
  98: {
    // Sheer Khurma
    calories: 310,
    chefTips: [
      "Seviyan ko ghee mein golden brown tak fry karo — crispy texture.",
      "Full fat doodh use karo aur slow flame pe pakao.",
      "Dry fruits generous amount mein dalo — jitne zyada utna better.",
    ],
  },
  99: {
    // Jaljeera
    calories: 65,
    chefTips: [
      "Tamarind water, mint, aur roasted cumin ka balance perfect hona chahiye.",
      "Fresh pudina paste use karo — bottle wala pudina flavour nahi deta.",
      "Serve karne se pehle thanda karo — jaljeera thanda hi best lagta hai.",
    ],
  },
  100: {
    // Kesar Lassi
    calories: 170,
    chefTips: [
      "Kesar ko warm doodh mein 15 min soak karo — rich orange color milega.",
      "Thick dahi aur fresh malai use karo — royal taste.",
      "Dry rose petals se garnish karo — presentation beautiful hogi.",
    ],
  },
};
