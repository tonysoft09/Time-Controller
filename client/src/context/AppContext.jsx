import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

const generateId = () => Math.random().toString(36).substring(2, 15);

const getToday = () => new Date().toISOString().split("T")[0];

const defaultStats = {
  todayReviewed: 0,
  todayAdded: 0,
  totalCards: 0,
  hardCards: [],
  lastUpdated: getToday(),
};

export function AppProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(defaultStats);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCollections = localStorage.getItem("flashcard_collections");
      const savedCards = localStorage.getItem("flashcard_cards");
      const savedStats = localStorage.getItem("flashcard_stats");

      if (savedCollections) setCollections(JSON.parse(savedCollections));
      if (savedCards) setCards(JSON.parse(savedCards));
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        // Reset daily stats if it's a new day
        if (parsedStats.lastUpdated !== getToday()) {
          setStats({ ...defaultStats, totalCards: parsedStats.totalCards, hardCards: parsedStats.hardCards });
        } else {
          setStats(parsedStats);
        }
      }
    } catch (e) {
      console.error("Error loading data from localStorage:", e);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("flashcard_collections", JSON.stringify(collections));
    }
  }, [collections, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("flashcard_cards", JSON.stringify(cards));
    }
  }, [cards, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("flashcard_stats", JSON.stringify(stats));
    }
  }, [stats, isLoading]);

  // Collection CRUD
  const addCollection = useCallback((name, description = "") => {
    const newCollection = {
      id: generateId(),
      name,
      description,
      cardCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, newCollection]);
    return newCollection;
  }, []);

  const updateCollection = useCallback((id, updates) => {
    setCollections((prev) =>
      prev.map((col) => (col.id === id ? { ...col, ...updates } : col))
    );
  }, []);

  const deleteCollection = useCallback((id) => {
    setCollections((prev) => prev.filter((col) => col.id !== id));
    setCards((prev) => prev.filter((card) => card.collectionId !== id));
    if (activeCollectionId === id) {
      setActiveCollectionId(null);
    }
  }, [activeCollectionId]);

  // Card CRUD
  const addCard = useCallback((collectionId, front, back) => {
    const newCard = {
      id: generateId(),
      collectionId,
      front,
      back,
      difficulty: "medium",
      nextReviewDate: null,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCards((prev) => [...prev, newCard]);
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId ? { ...col, cardCount: col.cardCount + 1 } : col
      )
    );
    setStats((prev) => ({
      ...prev,
      todayAdded: prev.todayAdded + 1,
      totalCards: prev.totalCards + 1,
      lastUpdated: getToday(),
    }));
    return newCard;
  }, []);

  const updateCard = useCallback((id, updates) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updates } : card))
    );
  }, []);

  const deleteCard = useCallback((id) => {
    const card = cards.find((c) => c.id === id);
    if (card) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      setCollections((prev) =>
        prev.map((col) =>
          col.id === card.collectionId
            ? { ...col, cardCount: Math.max(0, col.cardCount - 1) }
            : col
        )
      );
      setStats((prev) => ({
        ...prev,
        totalCards: Math.max(0, prev.totalCards - 1),
        hardCards: prev.hardCards.filter((hid) => hid !== id),
      }));
    }
  }, [cards]);

  // Review actions
  const reviewCard = useCallback((cardId, action) => {
    const now = new Date();
    let nextReviewDate = null;
    let difficulty = "medium";

    // Simple spaced repetition (not ANKI's algorithm)
    switch (action) {
      case "known":
        // Review again in 7 days
        nextReviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        difficulty = "easy";
        break;
      case "later":
        // Review again in 1 day
        nextReviewDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString();
        difficulty = "medium";
        break;
      case "hard":
        // Review again in 10 minutes
        nextReviewDate = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
        difficulty = "hard";
        break;
    }

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? {
              ...card,
              nextReviewDate,
              difficulty,
              reviewCount: card.reviewCount + 1,
            }
          : card
      )
    );

    setStats((prev) => {
      const newHardCards =
        action === "hard"
          ? [...new Set([...prev.hardCards, cardId])]
          : prev.hardCards.filter((id) => id !== cardId);
      return {
        ...prev,
        todayReviewed: prev.todayReviewed + 1,
        hardCards: newHardCards,
        lastUpdated: getToday(),
      };
    });
  }, []);

  // Get cards due for review
  const getCardsForReview = useCallback((collectionId = null) => {
    const now = new Date();
    return cards.filter((card) => {
      if (collectionId && card.collectionId !== collectionId) return false;
      if (!card.nextReviewDate) return true; // New cards
      return new Date(card.nextReviewDate) <= now;
    });
  }, [cards]);

  // Export/Import
  const exportData = useCallback(() => {
    const data = {
      collections,
      cards,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [collections, cards]);

  const importData = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.collections && data.cards) {
        setCollections(data.collections);
        setCards(data.cards);
        // Update stats
        setStats((prev) => ({
          ...prev,
          totalCards: data.cards.length,
          hardCards: data.cards.filter((c) => c.difficulty === "hard").map((c) => c.id),
        }));
        return { success: true };
      }
      return { success: false, error: "Noto'g'ri format" };
    } catch (e) {
      return { success: false, error: "JSON parse xatosi" };
    }
  }, []);

  const value = {
    collections,
    cards,
    stats,
    activeCollectionId,
    isLoading,
    setActiveCollectionId,
    addCollection,
    updateCollection,
    deleteCollection,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    getCardsForReview,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
