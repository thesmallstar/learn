(async function () {
  const topics = window.CS_FUNDAMENTALS_TOPICS || [];
  const study = window.CSFundamentalsStudy;
  if (!topics.length || !study) {
    return;
  }

  const state = study.loadState();
  const today = study.todayIso();
  let totalCards = 0;
  let dueCards = 0;

  await Promise.all(
    topics.map(async (topic) => {
      try {
        const response = await fetch(`./${topic.slug}/questions.json`);
        if (!response.ok) {
          return;
        }
        const json = await response.json();
        const questions = json.questions || [];
        totalCards += questions.length;
        const topicDue = questions.filter((question) => {
          const progress = state.cards[question.id];
          return !progress || progress.nextDue <= today;
        }).length;
        dueCards += topicDue;

        const card = document.querySelector(`a.card[href="${topic.slug}/"]`);
        if (!card) {
          return;
        }
        const meta = document.createElement("div");
        meta.className = "card-meta";
        meta.innerHTML = `
          <span class="card-badge">${questions.length} cards</span>
          <span class="card-badge due">${topicDue} due</span>
        `;
        card.appendChild(meta);
      } catch (error) {
      }
    })
  );

  const totalNode = document.getElementById("stat-total-cards");
  const dueNode = document.getElementById("stat-due-cards");
  if (totalNode) {
    totalNode.textContent = String(totalCards);
  }
  if (dueNode) {
    dueNode.textContent = String(dueCards);
  }
})();
