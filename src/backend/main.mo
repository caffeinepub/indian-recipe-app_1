import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Int "mo:core/Int";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use migration pattern for persistent variables
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SessionId = Text;
  let SESSION_TIMEOUT = 5 * 60_000_000_000; // 5 minutes in nanoseconds

  // User profile management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Recipe management
  type RecipeId = Nat;
  var nextRecipeId = 1;

  public type Recipe = {
    id : Nat;
    name : Text;
    category : Text;
    ingredients : [Text];
    instructions : [Text];
    prepTime : Text;
    cookTime : Text;
    servingSize : Text;
    imageUrl : Text;
    rating : Float;
    description : Text;
    isVeg : Bool;
    videoUrl : ?Text;
    calories : ?Nat;
    chefTips : ?[Text];
    owner : Principal;
  };

  public type RecipeInput = {
    name : Text;
    category : Text;
    ingredients : [Text];
    instructions : [Text];
    prepTime : Text;
    cookTime : Text;
    servingSize : Text;
    imageUrl : Text;
    rating : Float;
    description : Text;
    isVeg : Bool;
    videoUrl : ?Text;
    calories : ?Nat;
    chefTips : ?[Text];
  };

  let recipes = Map.empty<RecipeId, Recipe>();

  public query ({ caller }) func getRecipes() : async [Recipe] {
    // No authorization required - public recipe browsing for all users including guests
    recipes.values().toArray();
  };

  public query ({ caller }) func getRecipeCount() : async Nat {
    recipes.size();
  };

  public shared ({ caller }) func addRecipe(input : RecipeInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add recipes");
    };
    let recipeId = nextRecipeId;
    nextRecipeId += 1;

    let recipe : Recipe = {
      id = recipeId;
      name = input.name;
      category = input.category;
      ingredients = input.ingredients;
      instructions = input.instructions;
      prepTime = input.prepTime;
      cookTime = input.cookTime;
      servingSize = input.servingSize;
      imageUrl = input.imageUrl;
      rating = input.rating;
      description = input.description;
      isVeg = input.isVeg;
      videoUrl = input.videoUrl;
      calories = input.calories;
      chefTips = input.chefTips;
      owner = caller;
    };

    recipes.add(recipeId, recipe);
    recipeId;
  };

  public shared ({ caller }) func updateRecipe(id : Nat, input : RecipeInput) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update recipes");
    };

    switch (recipes.get(id)) {
      case null { return false };
      case (?existingRecipe) {
        // Only the owner or an admin can update the recipe
        if (existingRecipe.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipe owner or admins can update this recipe");
        };

        let updatedRecipe : Recipe = {
          id = id;
          name = input.name;
          category = input.category;
          ingredients = input.ingredients;
          instructions = input.instructions;
          prepTime = input.prepTime;
          cookTime = input.cookTime;
          servingSize = input.servingSize;
          imageUrl = input.imageUrl;
          rating = input.rating;
          description = input.description;
          isVeg = input.isVeg;
          videoUrl = input.videoUrl;
          calories = input.calories;
          chefTips = input.chefTips;
          owner = existingRecipe.owner; // Preserve original owner
        };

        recipes.add(id, updatedRecipe);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteRecipe(id : Nat, input : RecipeInput) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete recipes");
    };

    switch (recipes.get(id)) {
      case null { return false };
      case (?existingRecipe) {
        // Only the owner or an admin can delete the recipe
        if (existingRecipe.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the recipe owner or admins can delete this recipe");
        };

        recipes.remove(id);
        true;
      };
    };
  };

  public query ({ caller }) func isSeeded() : async Bool {
    // No authorization required - public query
    not recipes.isEmpty();
  };

  public shared ({ caller }) func seedRecipes(seedRecipes : [RecipeInput]) : async () {
    if (not recipes.isEmpty()) { return };
    var id = 1;
    for (recipeInput in seedRecipes.values()) {
      let recipe : Recipe = {
        id = id;
        name = recipeInput.name;
        category = recipeInput.category;
        ingredients = recipeInput.ingredients;
        instructions = recipeInput.instructions;
        prepTime = recipeInput.prepTime;
        cookTime = recipeInput.cookTime;
        servingSize = recipeInput.servingSize;
        imageUrl = recipeInput.imageUrl;
        rating = recipeInput.rating;
        description = recipeInput.description;
        isVeg = recipeInput.isVeg;
        videoUrl = recipeInput.videoUrl;
        calories = recipeInput.calories;
        chefTips = recipeInput.chefTips;
        owner = caller;
      };
      recipes.add(id, recipe);
      id += 1;
    };
    nextRecipeId := id;
  };

  /// Force reseed: clears all existing seed recipes and reseeds with new full list.
  /// Used when the local recipe count exceeds the backend count (new recipes added).
  public shared ({ caller }) func forceReseed(newRecipes : [RecipeInput]) : async () {
    // Clear all existing recipes
    for ((id, _) in recipes.entries()) {
      recipes.remove(id);
    };
    // Re-seed with full list
    var id = 1;
    for (recipeInput in newRecipes.values()) {
      let recipe : Recipe = {
        id = id;
        name = recipeInput.name;
        category = recipeInput.category;
        ingredients = recipeInput.ingredients;
        instructions = recipeInput.instructions;
        prepTime = recipeInput.prepTime;
        cookTime = recipeInput.cookTime;
        servingSize = recipeInput.servingSize;
        imageUrl = recipeInput.imageUrl;
        rating = recipeInput.rating;
        description = recipeInput.description;
        isVeg = recipeInput.isVeg;
        videoUrl = recipeInput.videoUrl;
        calories = recipeInput.calories;
        chefTips = recipeInput.chefTips;
        owner = caller;
      };
      recipes.add(id, recipe);
      id += 1;
    };
    nextRecipeId := id;
  };

  // Rating system
  type RatingId = Nat;
  var nextRatingId = 1;

  public type RatingComment = {
    id : Nat;
    recipeId : Nat;
    stars : Nat;
    comment : Text;
    authorName : Text;
    timestamp : Int;
  };

  let ratings = Map.empty<RatingId, RatingComment>();

  public shared ({ caller }) func submitRating(recipeId : Nat, stars : Nat, comment : Text, authorName : Text) : async Nat {
    if (stars < 1 or stars > 5) {
      Runtime.trap("Invalid number of stars. Must be between 1 and 5.");
    };

    if (authorName == "") {
      Runtime.trap("Author name cannot be empty. Please provide a name.");
    };

    // Verify the recipe exists
    switch (recipes.get(recipeId)) {
      case null {
        Runtime.trap("Recipe not found. Cannot submit rating for non-existent recipe.");
      };
      case (?_) {
        // Recipe exists, proceed with rating submission
      };
    };

    let ratingId = nextRatingId;
    nextRatingId += 1;

    let rating : RatingComment = {
      id = ratingId;
      recipeId;
      stars;
      comment;
      authorName;
      timestamp = Time.now();
    };

    ratings.add(ratingId, rating);
    ratingId;
  };

  public query ({ caller }) func getRatings(recipeId : Nat) : async [RatingComment] {
    let filtered = List.empty<RatingComment>();
    for ((_, rating) in ratings.entries()) {
      if (rating.recipeId == recipeId) {
        filtered.add(rating);
      };
    };

    let array = filtered.toArray();
    array.sort(
      func(a, b) {
        Int.compare(b.timestamp, a.timestamp);
      }
    );
  };

  // Active user tracking
  let sessionPings = Map.empty<SessionId, Int>();

  /// Updates timestamp to current time
  /// No authorization required - allows tracking of all visitors including guests
  public shared ({ caller }) func pingUser(sessionId : SessionId) : async () {
    let now = Time.now();
    sessionPings.add(sessionId, now);
  };

  /// Returns count of unique sessions active within the last 5 minutes
  /// No authorization required - public metric
  public query ({ caller }) func getActiveUsers() : async Nat {
    let now = Time.now();
    var activeCount = 0;
    for ((sessionId, lastPing) in sessionPings.entries()) {
      if (now - lastPing <= SESSION_TIMEOUT) {
        activeCount += 1;
      };
    };
    activeCount;
  };
};
