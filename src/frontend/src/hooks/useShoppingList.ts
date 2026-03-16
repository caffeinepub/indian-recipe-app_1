import { useCallback, useState } from "react";

const KEY_PREFIX = "rasoi-shopping-";

export interface ShoppingListItem {
  text: string;
  checked: boolean;
}

export interface ShoppingList {
  recipeName: string;
  recipeId: number;
  items: ShoppingListItem[];
  savedAt: number;
}

function getKey(recipeId: number) {
  return `${KEY_PREFIX}${recipeId}`;
}

function loadList(recipeId: number): ShoppingList | null {
  try {
    const raw = localStorage.getItem(getKey(recipeId));
    return raw ? (JSON.parse(raw) as ShoppingList) : null;
  } catch {
    return null;
  }
}

function saveList(list: ShoppingList) {
  try {
    localStorage.setItem(getKey(list.recipeId), JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export function useShoppingList() {
  const [, forceRender] = useState(0);
  const refresh = useCallback(() => forceRender((n) => n + 1), []);

  const addToList = useCallback(
    (recipeId: number, recipeName: string, ingredients: string[]) => {
      const list: ShoppingList = {
        recipeId,
        recipeName,
        items: ingredients.map((text) => ({ text, checked: false })),
        savedAt: Date.now(),
      };
      saveList(list);
      refresh();
    },
    [refresh],
  );

  const getList = useCallback((recipeId: number) => loadList(recipeId), []);

  const toggleItem = useCallback(
    (recipeId: number, index: number) => {
      const list = loadList(recipeId);
      if (!list) return;
      list.items[index] = {
        ...list.items[index],
        checked: !list.items[index].checked,
      };
      saveList(list);
      refresh();
    },
    [refresh],
  );

  const clearList = useCallback(
    (recipeId: number) => {
      try {
        localStorage.removeItem(getKey(recipeId));
      } catch {
        // ignore
      }
      refresh();
    },
    [refresh],
  );

  const getAllLists = useCallback((): ShoppingList[] => {
    const lists: ShoppingList[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(KEY_PREFIX)) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) lists.push(JSON.parse(raw) as ShoppingList);
        } catch {
          // skip corrupt entries
        }
      }
    }
    return lists.sort((a, b) => b.savedAt - a.savedAt);
  }, []);

  return { addToList, getList, toggleItem, clearList, getAllLists };
}
