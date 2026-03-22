import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type SessionId = string;
export interface RecipeInput {
    calories?: bigint;
    name: string;
    chefTips?: Array<string>;
    cookTime: string;
    description: string;
    instructions: Array<string>;
    imageUrl: string;
    servingSize: string;
    prepTime: string;
    category: string;
    rating: number;
    isVeg: boolean;
    videoUrl?: string;
    ingredients: Array<string>;
}
export interface Recipe {
    id: bigint;
    owner: Principal;
    calories?: bigint;
    name: string;
    chefTips?: Array<string>;
    cookTime: string;
    description: string;
    instructions: Array<string>;
    imageUrl: string;
    servingSize: string;
    prepTime: string;
    category: string;
    rating: number;
    isVeg: boolean;
    videoUrl?: string;
    ingredients: Array<string>;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRecipe(input: RecipeInput): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteRecipe(id: bigint, input: RecipeInput): Promise<boolean>;
    /**
     * / Returns count of unique sessions active within the last 5 minutes
     * / No authorization required - public metric
     */
    getActiveUsers(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getRecipes(): Promise<Array<Recipe>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSeeded(): Promise<boolean>;
    /**
     * / Updates timestamp to current time
     * / No authorization required - allows tracking of all visitors including guests
     */
    pingUser(sessionId: SessionId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedRecipes(seedRecipes: Array<RecipeInput>): Promise<void>;
    updateRecipe(id: bigint, input: RecipeInput): Promise<boolean>;
}
