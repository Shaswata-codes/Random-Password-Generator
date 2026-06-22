document.addEventListener("DOMContentLoaded", () => {
  const passwordDisplay = document.getElementById("password-display");
  const copyBtn = document.getElementById("copy-btn");
  const strengthLabel = document.getElementById("strength-label");
  const lengthSlider = document.getElementById("length-slider");
  const lengthVal = document.getElementById("length-val");

  const optUppercase = document.getElementById("opt-uppercase");
  const optLowercase = document.getElementById("opt-lowercase");
  const optNumbers = document.getElementById("opt-numbers");
  const optSymbols = document.getElementById("opt-symbols");
  const generateBtn = document.getElementById("generate-btn");

  const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS_CHARS = "0123456789";
  const SYMBOLS_CHARS = "!@#$%^&*";

  lengthSlider.addEventListener("input", (e) => {
    lengthVal.textContent = e.target.value;
    generatePassword();
  });

  [optUppercase, optLowercase, optNumbers, optSymbols].forEach((cb) => {
    cb.addEventListener("change", () => {
      validateInputs();
      generatePassword();
    });
  });

  generateBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyToClipboard);

  function validateInputs() {
    const checked =
      optUppercase.checked ||
      optLowercase.checked ||
      optNumbers.checked ||
      optSymbols.checked;

    generateBtn.disabled = !checked;
    return checked;
  }

  function getRandomIndex(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  function generatePassword() {
    if (!validateInputs()) {
      passwordDisplay.value = "";
      updateStrengthUI("none");
      return;
    }

    const length = parseInt(lengthSlider.value, 10);
    let charPool = "";
    let guaranteedChars = [];

    if (optUppercase.checked) {
      charPool += UPPERCASE_CHARS;
      guaranteedChars.push(
        UPPERCASE_CHARS[getRandomIndex(UPPERCASE_CHARS.length)],
      );
    }

    if (optLowercase.checked) {
      charPool += LOWERCASE_CHARS;
      guaranteedChars.push(
        LOWERCASE_CHARS[getRandomIndex(LOWERCASE_CHARS.length)],
      );
    }

    if (optNumbers.checked) {
      charPool += NUMBERS_CHARS;
      guaranteedChars.push(NUMBERS_CHARS[getRandomIndex(NUMBERS_CHARS.length)]);
    }

    if (optSymbols.checked) {
      charPool += SYMBOLS_CHARS;
      guaranteedChars.push(SYMBOLS_CHARS[getRandomIndex(SYMBOLS_CHARS.length)]);
    }

    let passwordChars = [...guaranteedChars];
    const fillLength = length - guaranteedChars.length;

    for (let i = 0; i < fillLength; i++) {
      passwordChars.push(charPool[getRandomIndex(charPool.length)]);
    }

    passwordChars = shuffleArray(passwordChars);

    const generatedPassword = passwordChars.join("");
    passwordDisplay.value = generatedPassword;

    evaluateStrength(generatedPassword);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = getRandomIndex(i + 1);
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function evaluateStrength(password) {
    const length = password.length;

    let categories = 0;

    if (optUppercase.checked) categories++;
    if (optLowercase.checked) categories++;
    if (optNumbers.checked) categories++;
    if (optSymbols.checked) categories++;

    let strength = "weak";

    if (length >= 12 && categories >= 3) {
      strength = "strong";
    } else if (length >= 8 && categories >= 2) {
      strength = "medium";
    } else {
      strength = "weak";
    }

    updateStrengthUI(strength);
  }

  function updateStrengthUI(strength) {
    strengthLabel.className = "strength-text";

    if (strength === "none") {
      strengthLabel.textContent = "None";
      strengthLabel.classList.add("strength-none");
    } else if (strength === "weak") {
      strengthLabel.textContent = "Weak";
      strengthLabel.classList.add("strength-weak");
    } else if (strength === "medium") {
      strengthLabel.textContent = "Medium";
      strengthLabel.classList.add("strength-medium");
    } else if (strength === "strong") {
      strengthLabel.textContent = "Strong";
      strengthLabel.classList.add("strength-strong");
    }
  }

  function copyToClipboard() {
    const password = passwordDisplay.value;

    if (!password) return;

    navigator.clipboard
      .writeText(password)
      .then(() => {
        const originalText = copyBtn.textContent;

        copyBtn.textContent = "Copied!";
        copyBtn.style.backgroundColor = "#10b981";

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.backgroundColor = "";
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy password:", err);
      });
  }

  generatePassword();
});
