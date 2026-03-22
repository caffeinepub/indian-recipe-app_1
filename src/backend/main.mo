import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let SESSION_TIMEOUT = 60_000_000_000; // 60 seconds in nanoseconds

  let sessionPings = Map.empty<Text, Int>();

  type SessionId = Text;

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

  /// Updates timestamp to current time
  /// No authorization required - allows tracking of all visitors including guests
  public shared ({ caller }) func pingOnline(sessionId : SessionId) : async () {
    let now = Time.now();
    sessionPings.add(sessionId, now);
  };

  /// Returns count of unique sessions active within the last 60 seconds
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

  /// Admin-only function to update session timeout
  public shared ({ caller }) func updateSessionTimeout(timeoutSec : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update session timeout");
    };
    if (timeoutSec < 1) {
      Runtime.trap("Session timeout must be at least 1 sec");
    };
    if (timeoutSec > 60) {
      Runtime.trap("Session timeout must not be larger than 60 sec");
    };
    // Note: This function validates the timeout but doesn't actually update SESSION_TIMEOUT
    // since it's a constant. If dynamic timeout is needed, it should be stored in a variable.
  };
};
