(async function () {
  const topics = window.CS_FUNDAMENTALS_TOPICS || [];
  const study = window.CSFundamentalsStudy;
  if (!topics.length || !study) {
    return;
  }

  const countsByTopic = {};
  const allCards = [];
  await Promise.all(
    topics.map(async (topic) => {
      try {
        const response = await fetch(`../../${topic.slug}/questions.json`);
        if (!response.ok) {
          countsByTopic[topic.slug] = [];
          return;
        }
        const json = await response.json();
        const cards = (json.questions || []).map((question) => ({
          ...question,
          topicSlug: topic.slug,
          topicTitle: topic.title,
        }));
        countsByTopic[topic.slug] = cards;
        allCards.push(...cards);
      } catch (error) {
        countsByTopic[topic.slug] = [];
      }
    })
  );

  const state = study.loadState();
  const today = study.todayIso();
  const sessions = state.sessions || [];
  const last7Days = sessions.filter((session) => session.date >= study.addDays(today, -6));
  const reviewedThisWeek = last7Days.reduce((sum, session) => sum + (session.reviewed || 0), 0);
  const correctThisWeek = last7Days.reduce((sum, session) => sum + (session.correct || 0), 0);
  const minutesThisWeek = last7Days.reduce((sum, session) => sum + (session.minutes || 0), 0);
  const retention = reviewedThisWeek ? Math.round((correctThisWeek / reviewedThisWeek) * 100) : 0;

  document.getElementById("stat-total").textContent = String(allCards.length);
  document.getElementById("stat-reviewed").textContent = String(reviewedThisWeek);
  document.getElementById("stat-retention").textContent = `${retention}%`;
  document.getElementById("stat-streak").textContent = String(study.calculateStreak(sessions));
  document.getElementById("stat-time").textContent = `${minutesThisWeek}m`;

  const tbody = document.getElementById("stats-body");
  tbody.innerHTML = topics
    .map((topic) => {
      const cards = countsByTopic[topic.slug] || [];
      const buckets = { new: 0, learning: 0, review: 0, mastered: 0, due: 0 };
      cards.forEach((card) => {
        const bucket = study.getCardBucket(state.cards[card.id], today);
        buckets[bucket] += 1;
      });
      return `
        <tr>
          <td>${topic.title}</td>
          <td>${cards.length}</td>
          <td>${buckets.new}</td>
          <td>${buckets.learning}</td>
          <td>${buckets.review}</td>
          <td>${buckets.mastered}</td>
          <td>${buckets.due}</td>
        </tr>
      `;
    })
    .join("");
})();
