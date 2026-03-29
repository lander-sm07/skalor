document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file-input");
  const generateBtn = document.getElementById("generate-btn");
  const subjectSelect = document.getElementById("subject-select");
  const uploadStatus = document.getElementById("upload-status");

  let uploadedText = "";

  function setUploadStatus(message, type = "") {
    if (!uploadStatus) return;

    uploadStatus.textContent = message;
    uploadStatus.className = "upload-status";

    if (type) {
      uploadStatus.classList.add(type);
    }
  }

  if (!fileInput || !generateBtn || !subjectSelect) {
    console.log("file-input, generate-btn of subject-select niet gevonden");
    return;
  }

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) {
      setUploadStatus("Geen bestand geselecteerd.", "error");
      return;
    }

    if (!file.name.endsWith(".txt")) {
      setUploadStatus("Upload een .txt bestand.", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      uploadedText = event.target.result?.trim() || "";

      if (!uploadedText) {
        setUploadStatus("Het bestand is leeg.", "error");
        return;
      }

      setUploadStatus(`Document "${file.name}" succesvol geladen.`, "success");

      if (window.setActivity) {
        window.setActivity(`Document geladen voor ${subjectSelect.value}.`);
      }
    };

    reader.onerror = function () {
      setUploadStatus("Kon het bestand niet lezen.", "error");
    };

    reader.readAsText(file);
  });

  generateBtn.addEventListener("click", () => {
    if (!uploadedText) {
      setUploadStatus("Upload eerst een .txt bestand.", "error");
      return;
    }

    if (!window.questions || !Array.isArray(window.questions)) {
      setUploadStatus("Vragenlijst is nog niet beschikbaar.", "error");
      return;
    }

    const selectedSubject = subjectSelect.value;
    const newQuestion = generateQuestionFromText(uploadedText, selectedSubject);

    const existingIndex = window.questions.findIndex(
      (q) => q.subject === selectedSubject
    );

    if (existingIndex !== -1) {
      window.questions[existingIndex] = newQuestion;
    } else {
      window.questions.push(newQuestion);
    }

    if (window.setCoachMessage) {
      window.setCoachMessage(`Nieuwe quiz gegenereerd voor ${selectedSubject}.`);
    }

    if (window.setActivity) {
      window.setActivity(`${selectedSubject}-document verwerkt tot quiz.`);
    }

    setUploadStatus(
      `Quiz voor ${selectedSubject} succesvol gegenereerd.`,
      "success"
    );
  });

  function generateQuestionFromText(text, subject) {
    const cleanText = text.replace(/\s+/g, " ").trim();
    const sentences = cleanText.split(/[.!?]+/).filter(Boolean);

    let baseQuestion = sentences[0] || cleanText;
    baseQuestion = baseQuestion.trim();

    if (baseQuestion.length < 10) {
      baseQuestion = `Wat wordt bedoeld met deze tekst over ${subject}?`;
    }

    const fakeOptionsBySubject = {
      Biologie: [
        "Erfelijke informatie opslaan",
        "Zuurstof transporteren",
        "Energie verliezen"
      ],
      Nederlands: [
        "Een taalkundig begrip",
        "Een wiskundige formule",
        "Een chemische reactie"
      ],
      Wiskunde: [
        "Een correcte oplossing",
        "Een onjuiste berekening",
        "Een biologisch proces"
      ],
      Informatica: [
        "Een keuze op basis van een conditie",
        "Een chemische omzetting",
        "Een natuurkundige kracht"
      ],
      Chemie: [
        "Een chemisch begrip",
        "Een literair begrip",
        "Een programmeerstructuur"
      ],
      Fysica: [
        "Een natuurkundig begrip",
        "Een taaloefening",
        "Een biologisch kenmerk"
      ]
    };

    const rewards = {
      Biologie: 20,
      Nederlands: 20,
      Wiskunde: 25,
      Informatica: 20,
      Chemie: 20,
      Fysica: 20
    };

    const options = fakeOptionsBySubject[subject] || [
      "Correct antwoord",
      "Fout antwoord 1",
      "Fout antwoord 2"
    ];

    return {
      subject: subject,
      question: baseQuestion,
      options: options,
      correct: options[0],
      reward: rewards[subject] || 20
    };
  }
});