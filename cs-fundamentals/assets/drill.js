(async function () {
  const topics = window.CS_FUNDAMENTALS_TOPICS || [];
  const study = window.CSFundamentalsStudy;
  if (!topics.length || !study) {
    return;
  }

  const els = {
    topicGrid: document.getElementById("topic-grid"),
    cardHost: document.getElementById("card-host"),
    selectedCount: document.getElementById("selected-count"),
    totalCount: document.getElementById("total-count"),
    dueCount: document.getElementById("due-count"),
    streakCount: document.getElementById("streak-count"),
    modePills: Array.from(document.querySelectorAll("[data-mode]")),
    selectAll: document.getElementById("select-all"),
    clearAll: document.getElementById("clear-all"),
    indexLink: document.getElementById("stats-link"),
  };

  const urlState = parseHash();
  let selectedTopics = new Set(
    urlState.topics.length
      ? urlState.topics
      : defaultTopicsForMode(urlState.mode || "due")
  );
  let mode = urlState.mode || "due";
  let allCards = [];
  let sessionReviewed = 0;
  let cardQueue = [];
  let revealed = false;
  let currentCard = null;
  let topicCardCounts = {};

  els.modePills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.mode === mode);
    pill.addEventListener("click", () => {
      const nextMode = pill.dataset.mode;
      const allTopicsSelected = selectedTopics.size === topics.length;
      if (nextMode === "cram" && allTopicsSelected) {
        selectedTopics = new Set();
        renderTopicGrid();
      }
      mode = nextMode;
      els.modePills.forEach((entry) => entry.classList.toggle("active", entry === pill));
      persistHash();
      resetQueue();
      render();
    });
  });

  els.selectAll.addEventListener("click", () => {
    selectedTopics = new Set(topics.map((topic) => topic.slug));
    persistHash();
    renderTopicGrid();
    resetQueue();
    render();
  });

  els.clearAll.addEventListener("click", () => {
    selectedTopics = new Set();
    persistHash();
    renderTopicGrid();
    resetQueue();
    render();
  });

  await loadCards();
  renderTopicGrid();
  resetQueue();
  render();

  function parseHash() {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    return {
      topics: (params.get("topics") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      mode: params.get("mode"),
    };
  }

  function defaultTopicsForMode(currentMode) {
    if (currentMode === "cram") {
      return [];
    }
    return topics.map((topic) => topic.slug);
  }

  function persistHash() {
    const params = new URLSearchParams();
    params.set("topics", Array.from(selectedTopics).join(","));
    params.set("mode", mode);
    window.location.hash = params.toString();
  }

  async function loadCards() {
    const result = await Promise.all(
      topics.map(async (topic) => {
        try {
          const response = await fetch(`../${topic.slug}/questions.json`);
          if (!response.ok) {
            return [];
          }
          const json = await response.json();
          topicCardCounts[topic.slug] = (json.questions || []).length;
          return (json.questions || []).map((question) => ({
            ...question,
            topicSlug: topic.slug,
            topicTitle: topic.title,
            category: topic.category,
          }));
        } catch (error) {
          topicCardCounts[topic.slug] = 0;
          return [];
        }
      })
    );
    allCards = result.flat();
    updateHeroStats();
  }

  function updateHeroStats() {
    const state = study.loadState();
    const today = study.todayIso();
    const due = allCards.filter((card) => {
      const progress = study.getCardProgress(card.id, state);
      return selectedTopics.has(card.topicSlug) && (!progress || progress.nextDue <= today);
    }).length;
    els.totalCount.textContent = String(allCards.length);
    els.dueCount.textContent = String(due);
    els.streakCount.textContent = String(study.calculateStreak(state.sessions || []));
  }

  function renderTopicGrid() {
    els.topicGrid.innerHTML = topics
      .map((topic) => {
        const checked = selectedTopics.has(topic.slug);
        return `
          <label class="topic-option">
            <input type="checkbox" data-topic="${topic.slug}" ${checked ? "checked" : ""}>
            <span>
              <span class="topic-option-title">${topic.title}</span>
              <span class="topic-option-copy">${topic.description}</span>
            </span>
            <span class="topic-option-count">${topicCardCounts[topic.slug] || 0}</span>
          </label>
        `;
      })
      .join("");

    els.topicGrid.querySelectorAll("input[data-topic]").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          selectedTopics.add(input.dataset.topic);
        } else {
          selectedTopics.delete(input.dataset.topic);
        }
        persistHash();
        resetQueue();
        render();
      });
    });
  }

  function buildQueue() {
    const state = study.loadState();
    const today = study.todayIso();
    const selectedCards = allCards.filter((card) => selectedTopics.has(card.topicSlug));
    const filtered = selectedCards.filter((card) => {
      const progress = study.getCardProgress(card.id, state);
      if (mode === "cram") {
        return true;
      }
      if (mode === "new") {
        return !progress;
      }
      if (mode === "weak") {
        return progress && (progress.failures || 0) >= 3;
      }
      return !progress || progress.nextDue <= today;
    });
    return study.shuffle(filtered);
  }

  function resetQueue() {
    cardQueue = buildQueue();
    currentCard = cardQueue[0] || null;
    revealed = false;
    updateHeroStats();
  }

  function render() {
    const state = study.loadState();
    const today = study.todayIso();
    const selectedCards = allCards.filter((card) => selectedTopics.has(card.topicSlug));
    const dueCards = selectedCards.filter((card) => {
      const progress = study.getCardProgress(card.id, state);
      return !progress || progress.nextDue <= today;
    });

    els.selectedCount.textContent = String(selectedTopics.size);

    if (!selectedTopics.size) {
      els.cardHost.innerHTML = `
        <section class="empty-state">
          <h2>Select at least one topic</h2>
          <p>The drill queue is built from the checked topics on the left. Pick a set of topics, then start revealing cards.</p>
        </section>
      `;
      return;
    }

    if (!currentCard) {
      els.cardHost.innerHTML = `
        <section class="empty-state">
          <h2>No cards in this mode</h2>
          <p>Selected topics: ${selectedCards.length} cards total, ${dueCards.length} due today. Try another mode or add more topics.</p>
        </section>
      `;
      return;
    }

    const progress = study.getCardProgress(currentCard.id, state);
    const stage = study.getCardStage(progress, today);
    els.cardHost.innerHTML = `
      <section class="panel session-bar">
        <div class="session-progress">
          <div class="hero-kicker">Session</div>
          <div style="margin-top:0.4rem;font-size:0.75rem;color:var(--text2);">
            ${dueCards.length} due today · ${selectedCards.length} cards selected · Mode: ${mode}
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${cardQueue.length + sessionReviewed ? (sessionReviewed / (cardQueue.length + sessionReviewed)) * 100 : 0}%"></div></div>
        </div>
        <div style="font-size:0.72rem;color:var(--muted);">
          <div>Queue remaining: ${cardQueue.length}</div>
          <div>Session reviewed: ${sessionReviewed}</div>
        </div>
      </section>
      <section class="card-face">
        <div class="card-head">
          <div>
            <div class="card-topic">${currentCard.topicTitle}</div>
            <div class="card-tier">Tier ${currentCard.tier}</div>
          </div>
          <span class="card-stage stage-${stage}">${stage}</span>
        </div>
        <div class="card-question">${escapeHtml(currentCard.q)}</div>
        <div class="card-answer ${revealed ? "visible" : ""}" id="answer-box">${escapeHtml(currentCard.a)}</div>
        <div class="card-actions">
          ${
            revealed
              ? `
            <button class="rate-again" data-rating="again">Didn't know</button>
            <button class="rate-hard" data-rating="hard">Vague</button>
            <button class="rate-good" data-rating="good">Got it</button>
          `
              : `<button class="primary-btn" id="reveal-btn">Reveal Answer</button>`
          }
        </div>
      </section>
    `;

    const revealBtn = document.getElementById("reveal-btn");
    if (revealBtn) {
      revealBtn.addEventListener("click", () => {
        revealed = true;
        render();
      });
    }

    els.cardHost.querySelectorAll("[data-rating]").forEach((button) => {
      button.addEventListener("click", () => rateCard(button.dataset.rating));
    });
  }

  function rateCard(rating) {
    const state = study.loadState();
    const today = study.todayIso();
    const existing = study.getCardProgress(currentCard.id, state);
    state.cards[currentCard.id] = study.applyRating(existing, rating, today);
    study.recordSessionReview(state, {
      date: today,
      rating,
      topic: currentCard.topicSlug,
      minutes: 1,
    });
    study.saveState(state);
    sessionReviewed += 1;
    cardQueue = cardQueue.filter((card) => card.id !== currentCard.id);
    currentCard = cardQueue[0] || null;
    revealed = false;
    updateHeroStats();
    render();
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
})();
