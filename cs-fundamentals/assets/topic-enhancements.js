(async function () {
  const slug = window.location.pathname.split("/").filter(Boolean).slice(-1)[0];
  const topic = (window.CS_FUNDAMENTALS_TOPICS || []).find((entry) => entry.slug === slug);
  const content = document.querySelector(".content");
  if (!topic || !content) {
    return;
  }

  async function safeFetch(filename) {
    try {
      const response = await fetch(`./${filename}`);
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      return null;
    }
  }

  const [questionBank, exerciseBank] = await Promise.all([
    safeFetch("questions.json"),
    safeFetch("exercises.json"),
  ]);

  if (!questionBank && !exerciseBank) {
    return;
  }

  function byTier(tier) {
    return (questionBank?.questions || []).filter((question) => question.tier === tier);
  }

  function renderQuestionColumn(tier, title, copy) {
    const questions = byTier(tier);
    if (!questions.length) {
      return "";
    }
    return `
      <section class="study-bank-column">
        <h3>${title}</h3>
        <p>${copy}</p>
        ${questions
          .map(
            (question) => `
          <details class="study-question-item">
            <summary>${escapeHtml(question.q)}</summary>
            <div class="study-question-answer">${escapeHtml(question.a)}</div>
            <div class="study-tags">
              ${(question.tags || []).map((tag) => `<span class="study-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </details>
        `
          )
          .join("")}
      </section>
    `;
  }

  function renderExerciseGroup(size, title, copy) {
    const exercises = (exerciseBank?.exercises || []).filter((exercise) => exercise.size === size);
    if (!exercises.length) {
      return "";
    }
    return `
      <section class="study-exercise-group">
        <h3>${title}</h3>
        <p>${copy}</p>
        ${exercises
          .map(
            (exercise) => `
          <article class="study-exercise-card">
            <div class="study-exercise-title">${escapeHtml(exercise.title)}</div>
            <p class="study-exercise-copy">${escapeHtml(exercise.description)}</p>
            <div class="study-command"><code>${escapeHtml(exercise.command)}</code></div>
            <div class="study-exercise-meta">Expected outcome: ${escapeHtml(exercise.expected_outcome)}</div>
            <div class="study-tags">
              ${(exercise.tags || []).map((tag) => `<span class="study-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </article>
        `
          )
          .join("")}
      </section>
    `;
  }

  const questionCount = questionBank?.questions?.length || 0;
  const exerciseCount = exerciseBank?.exercises?.length || 0;

  const section = document.createElement("section");
  section.className = "section study-bank-section";
  section.innerHTML = `
    <div class="section-num">Study / Active Recall</div>
    <div class="study-bank-header">
      <div>
        <h2>Question Bank & Practical Work</h2>
        <p>Use the drill flow for retrieval practice, then use the exercises to convert recall into procedural skill.</p>
      </div>
      <div class="study-bank-actions">
        <a class="study-pill-link" href="../drill/#topics=${slug}&mode=due">Drill this topic</a>
        <a class="study-pill-link" href="../drill/#topics=${slug}&mode=cram">Cram mode</a>
      </div>
    </div>
    <div class="study-bank-grid">
      <div class="study-stat-card">
        <span class="study-stat-kicker">Topic</span>
        <span class="study-stat-value">${topic.shortTitle}</span>
      </div>
      <div class="study-stat-card">
        <span class="study-stat-kicker">Questions</span>
        <span class="study-stat-value">${questionCount}</span>
      </div>
      <div class="study-stat-card">
        <span class="study-stat-kicker">Exercises</span>
        <span class="study-stat-value">${exerciseCount}</span>
      </div>
      <div class="study-stat-card">
        <span class="study-stat-kicker">Mix</span>
        <span class="study-stat-value">${byTier("A").length}/${byTier("B").length}/${byTier("C").length}</span>
      </div>
    </div>
    ${
      questionCount
        ? `
      <div class="study-bank-columns">
        ${renderQuestionColumn("A", "Tier A", "Fast, exact recall. Answer before opening the card.")}
        ${renderQuestionColumn("B", "Tier B", "Explain in one to three sentences with no hints.")}
        ${renderQuestionColumn("C", "Tier C", "Trade-offs and system-level reasoning prompts.")}
      </div>
    `
        : `<p class="study-bank-empty">Question bank will appear here once the topic JSON is added.</p>`
    }
    ${
      exerciseCount
        ? `
      <div class="study-bank-header" style="margin-top:2.2rem;">
        <div>
          <h2>Exercises</h2>
          <p>Small tasks build observational fluency. Medium and large tasks force applied understanding.</p>
        </div>
      </div>
      <div class="study-exercise-groups">
        ${renderExerciseGroup("small", "Small", "5-15 minute tasks focused on observing and explaining.")}
        ${renderExerciseGroup("medium", "Medium", "30-60 minute builds and experiments.")}
        ${renderExerciseGroup("large", "Large", "2-4 hour projects that force end-to-end understanding.")}
      </div>
    `
        : `<p class="study-bank-empty">Exercises will appear here once the topic JSON is added.</p>`
    }
  `;

  const existingQuizSection = content.querySelector(".quiz-section");
  if (existingQuizSection) {
    content.insertBefore(section, existingQuizSection);
  } else {
    content.appendChild(section);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
})();
