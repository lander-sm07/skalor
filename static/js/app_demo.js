/* First evaluate before push! */ 
/* vervang html sectie quiz + font awesome link + json + css icon kleuren + coin*/
document.addEventListener("DOMContentLoaded", async () => {
  let coins = 120;
  let level = 1;
  let completedSkills = 0;

  window.questions = [];

  const coinCount = document.getElementById("coin-count");
  const playerLevel = document.getElementById("player-level");
  const coachText = document.getElementById("coach-text");
  const skillButtons = document.querySelectorAll(".skill-btn");

  function updateUI() {
    if (coinCount) {
      coinCount.textContent = coins;
      animate(coinCount);
    }
    if (playerLevel) {
      playerLevel.textContent = level;
      animate(playerLevel);
    }
  }

  function setCoachMessage(message) {
    if (coachText) coachText.textContent = message;
  }

  function setActivity(message) {
    console.log("[ACTIVITY]", message);
  }

  window.setCoachMessage = setCoachMessage;
  window.setActivity = setActivity;

  async function loadQuestions() {
    try {
      const response = await fetch("../static/data/questions_demo.json");

      if (!response.ok) {
        throw new Error(`Kon questions_demo.json niet laden: ${response.status}`);
      }

      window.questions = await response.json();
      setActivity("Demo gestart. Vragen geladen vanuit JSON.");
      console.log("Questions geladen:", window.questions);
    } catch (error) {
      console.error(error);
      setCoachMessage("Kon de vragen niet laden. Controleer je JSON-bestand.");
      setActivity("Fout bij laden van vragen.");
    }
  }

  function getQuestionForSkill(skillName) {
    return window.questions.find((q) => q.subject === skillName) || null;
  }

  function markSkillCompleted(skillButton, reward) {
    completedSkills += 1;
    coins += reward;

    skillButton.classList.remove("unlockable");
    skillButton.classList.add("unlocked", "is-completed");

    const icon = skillButton.querySelector(".feature-icon i");
    const text = skillButton.querySelector("p");
    const title = skillButton.querySelector("h3")?.textContent || "Skill";

    if (icon) {
      icon.className = "fa-solid fa-circle-check";
    }

    if (text) {
      text.textContent = `Voltooid · +${reward} Coins`;
    }

    if (completedSkills >= 2 && level === 1) {
      level = 2;
    } else if (completedSkills >= 5 && level === 2) {
      level = 3;
    }

    updateUI();
    setCoachMessage(`Mooi. Je voltooide ${title} en verdiende ${reward} Coins.`);
    setActivity(`Skill voltooid: ${title} (+${reward} Coins)`);
  }

  function createQuizModalIfNeeded() {
    let quizModal = document.getElementById("quiz-modal");

    if (quizModal) {
      return quizModal;
    }

    const modalHtml = `
      <div id="quiz-modal" class="quiz-modal hidden" aria-hidden="true">
        <div class="quiz-box glass-card">
          <p class="eyebrow">Mini-opdracht</p>
          <h2 id="quiz-question">Vraag komt hier</h2>

          <div class="quiz-options">
            <button class="quiz-option" data-answer="" id="quiz-option-a">Optie A</button>
            <button class="quiz-option" data-answer="" id="quiz-option-b">Optie B</button>
            <button class="quiz-option" data-answer="" id="quiz-option-c">Optie C</button>
          </div>

          <p id="quiz-feedback"></p>

          <div class="quiz-actions">
            <button id="quiz-close" class="btn btn-outline">Sluiten</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);
    return document.getElementById("quiz-modal");
  }

  createQuizModalIfNeeded();

  const quizModal = document.getElementById("quiz-modal");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptionA = document.getElementById("quiz-option-a");
  const quizOptionB = document.getElementById("quiz-option-b");
  const quizOptionC = document.getElementById("quiz-option-c");
  const quizOptions = document.querySelectorAll(".quiz-option");
  const quizFeedback = document.getElementById("quiz-feedback");
  const quizClose = document.getElementById("quiz-close");

  let activeQuizSkill = null;
  let activeQuestion = null;

  function resetQuizOptions() {
    quizOptions.forEach((option) => {
      option.classList.remove("correct", "wrong");
      option.disabled = false;
    });

    if (quizFeedback) {
      quizFeedback.textContent = "";
    }
  }

  function openQuiz(skillButton) {
    const skillName = skillButton.dataset.skill;
    const questionData = getQuestionForSkill(skillName);

    if (!questionData) {
      setCoachMessage(`Geen vraag gevonden voor ${skillName}.`);
      setActivity(`Geen JSON-vraag gevonden voor ${skillName}.`);
      return;
    }

    activeQuizSkill = skillButton;
    activeQuestion = questionData;

    if (quizQuestion) quizQuestion.textContent = questionData.question;

    if (quizOptionA) {
      quizOptionA.textContent = questionData.options[0] || "Optie A";
      quizOptionA.dataset.answer = questionData.options[0] || "";
    }

    if (quizOptionB) {
      quizOptionB.textContent = questionData.options[1] || "Optie B";
      quizOptionB.dataset.answer = questionData.options[1] || "";
    }

    if (quizOptionC) {
      quizOptionC.textContent = questionData.options[2] || "Optie C";
      quizOptionC.dataset.answer = questionData.options[2] || "";
    }

    resetQuizOptions();

    if (quizModal) {
      quizModal.classList.remove("hidden");
      quizModal.setAttribute("aria-hidden", "false");
    }
  }

  function closeQuiz() {
    if (quizModal) {
      quizModal.classList.add("hidden");
      quizModal.setAttribute("aria-hidden", "true");
    }

    activeQuizSkill = null;
    activeQuestion = null;
    resetQuizOptions();
  }

  skillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const title = button.querySelector("h3")?.textContent || button.dataset.skill || "Skill";

      if (button.classList.contains("is-completed")) {
        setCoachMessage("Deze skill is al voltooid.");
        setActivity(`Reeds voltooide skill bekeken: ${title}`);
        return;
      }

      if (button.classList.contains("interactive-skill")) {
        openQuiz(button);
        setCoachMessage(`Los de mini-opdracht van ${title} op om coins te verdienen.`);
        setActivity(`Mini-quiz gestart voor ${title}`);
        return;
      }

      if (button.classList.contains("unlockable")) {
        const reward = Number(button.dataset.reward || 20);
        markSkillCompleted(button, reward);
      }
    });
  });

  quizOptions.forEach((option) => {
    option.addEventListener("click", () => {
      if (!activeQuizSkill || !activeQuestion) {
        return;
      }

      const selectedAnswer = option.dataset.answer;
      const correctAnswer = activeQuestion.correct;
      const reward = Number(activeQuestion.reward || 20);
      const title = activeQuizSkill.querySelector("h3")?.textContent || activeQuestion.subject || "Skill";

      quizOptions.forEach((button) => {
        button.disabled = true;
      });

      if (selectedAnswer === correctAnswer) {
        option.classList.add("correct");

        if (quizFeedback) {
          quizFeedback.textContent = `Correct! +${reward} Coins`;
        }

        markSkillCompleted(activeQuizSkill, reward);

        setTimeout(() => {
          closeQuiz();
        }, 900);
      } else {
        option.classList.add("wrong");

        quizOptions.forEach((button) => {
          if (button.dataset.answer === correctAnswer) {
            button.classList.add("correct");
          }
        });

        if (quizFeedback) {
          quizFeedback.textContent = "Niet correct. Bekijk het juiste antwoord.";
        }

        setCoachMessage(`Bij ${title} was het juiste antwoord: ${correctAnswer}.`);
        setActivity(`Mini-quiz fout beantwoord: ${title}`);

        setTimeout(() => {
          closeQuiz();
        }, 1400);
      }
    });
  });

  if (quizClose) {
    quizClose.addEventListener("click", closeQuiz);
  }

  if (quizModal) {
    quizModal.addEventListener("click", (event) => {
      if (event.target === quizModal) {
        closeQuiz();
      }
    });
  }

  await loadQuestions();
  updateUI();
});