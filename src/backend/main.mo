import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed recipes");
    };
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
        owner = caller; // Admin who seeds becomes the owner
      };
      recipes.add(id, recipe);
      id += 1;
    };
    nextRecipeId := id;
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

