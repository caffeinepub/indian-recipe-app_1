import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  public type UserProfile = {
    name : Text;
  };

  type OldActor = {};
  type NewActor = {
    sessionPings : Map.Map<Text, Int>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let sessionPings = Map.empty<Text, Int>();
    let userProfiles = Map.empty<Principal, UserProfile>();
    { sessionPings; userProfiles };
  };
};
