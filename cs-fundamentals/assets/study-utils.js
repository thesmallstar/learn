(function () {
  const STORAGE_KEY = "learn.cs-fundamentals.drill.v1";
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(dateStr, days) {
    const date = new Date(dateStr + "T00:00:00Z");
    const next = new Date(date.getTime() + days * MS_PER_DAY);
    return next.toISOString().slice(0, 10);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { cards: {}, sessions: [] };
      }
      const parsed = JSON.parse(raw);
      return {
        cards: parsed.cards || {},
        sessions: parsed.sessions || [],
      };
    } catch (error) {
      return { cards: {}, sessions: [] };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getCardProgress(cardId, state) {
    return state.cards[cardId] || null;
  }

  function getCardStage(progress, today) {
    if (!progress) {
      return "new";
    }
    if ((progress.failures || 0) >= 3) {
      return "weak";
    }
    if (progress.nextDue <= today && (progress.reps || 0) > 0) {
      return "due";
    }
    if ((progress.reps || 0) >= 6 && (progress.interval || 0) >= 21) {
      return "mastered";
    }
    if ((progress.reps || 0) >= 3 && (progress.interval || 0) >= 7) {
      return "review";
    }
    return "learning";
  }

  function getCardBucket(progress, today) {
    if (!progress) {
      return "new";
    }
    if (progress.nextDue <= today) {
      return "due";
    }
    if ((progress.reps || 0) >= 6 && (progress.interval || 0) >= 21) {
      return "mastered";
    }
    if ((progress.reps || 0) >= 3) {
      return "review";
    }
    return "learning";
  }

  function applyRating(progress, rating, today) {
    const current = progress || {
      easeFactor: 2.5,
      interval: 0,
      reps: 0,
      failures: 0,
      lapses: 0,
      lastRating: null,
    };

    const updated = {
      ...current,
      lastReviewed: today,
      reps: current.reps || 0,
      failures: current.failures || 0,
      lapses: current.lapses || 0,
    };

    if (rating === "again") {
      updated.easeFactor = clamp((current.easeFactor || 2.5) - 0.2, 1.3, 3.0);
      updated.interval = 1;
      updated.nextDue = addDays(today, 1);
      updated.reps = 0;
      updated.failures += 1;
      updated.lapses += 1;
      updated.lastRating = "again";
      return updated;
    }

    if (rating === "hard") {
      updated.easeFactor = clamp((current.easeFactor || 2.5) - 0.05, 1.3, 3.0);
      updated.interval = current.interval ? Math.max(3, Math.round(current.interval * 1.2)) : 3;
      updated.nextDue = addDays(today, updated.interval);
      updated.reps += 1;
      updated.lastRating = "hard";
      return updated;
    }

    updated.easeFactor = clamp((current.easeFactor || 2.5) + 0.1, 1.3, 3.0);
    if (!current.interval) {
      updated.interval = 7;
    } else {
      updated.interval = Math.max(7, Math.round(current.interval * updated.easeFactor));
    }
    updated.nextDue = addDays(today, updated.interval);
    updated.reps += 1;
    updated.lastRating = "good";
    return updated;
  }

  function recordSessionReview(state, payload) {
    const today = payload.date;
    const sessions = state.sessions || [];
    const current = sessions.find((entry) => entry.date === today);
    if (current) {
      current.reviewed += 1;
      if (payload.rating === "good") {
        current.correct += 1;
      }
      current.minutes = (current.minutes || 0) + (payload.minutes || 1);
      current.topics = Array.from(new Set([...(current.topics || []), payload.topic]));
      return;
    }
    sessions.push({
      date: today,
      reviewed: 1,
      correct: payload.rating === "good" ? 1 : 0,
      minutes: payload.minutes || 1,
      topics: [payload.topic],
    });
  }

  function calculateStreak(sessions) {
    if (!sessions.length) {
      return 0;
    }
    const dates = Array.from(new Set(sessions.map((session) => session.date))).sort().reverse();
    let streak = 0;
    let cursor = todayIso();
    for (const date of dates) {
      if (date === cursor) {
        streak += 1;
        cursor = addDays(cursor, -1);
        continue;
      }
      if (streak === 0 && date === addDays(cursor, -1)) {
        streak += 1;
        cursor = addDays(date, -1);
        continue;
      }
      break;
    }
    return streak;
  }

  async function fetchTopicJson(slug, filename) {
    const response = await fetch(`../${slug}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename} for ${slug}`);
    }
    return response.json();
  }

  window.CSFundamentalsStudy = {
    STORAGE_KEY,
    addDays,
    applyRating,
    calculateStreak,
    fetchTopicJson,
    getCardBucket,
    getCardProgress,
    getCardStage,
    loadState,
    recordSessionReview,
    saveState,
    shuffle,
    todayIso,
  };
})();
