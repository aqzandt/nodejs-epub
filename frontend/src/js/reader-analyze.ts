// Get elements
const analyzeButton = document.getElementById("analyzeButton") as HTMLButtonElement;
const kanjiModal = document.getElementById("kanjiModal") as HTMLDivElement;
const closeModalBtn = document.getElementById("closeModal") as HTMLButtonElement;
const kanjiTableBody = document.getElementById("kanjiTableBody") as HTMLTableSectionElement;

// Extract book ID from URL
const bookId = window.location.pathname.split("/").pop();

// Event listeners
analyzeButton.addEventListener("click", openAnalysis);
closeModalBtn.addEventListener("click", closeModal);
kanjiModal.addEventListener("click", (e) => {
  if (e.target === kanjiModal) {
    closeModal();
  }
});

async function openAnalysis() {
  try {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Loading...";

    const response = await fetch(`/book/${bookId}/analyze`);
    if (!response.ok) {
      throw new Error(`Failed to fetch kanji analysis: ${response.statusText}`);
    }

    const kanjiData: Array<[string, number]> = await response.json();

    // Clear previous rows
    kanjiTableBody.innerHTML = "";

    // Populate table
    kanjiData.forEach(([kanji, frequency]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${kanji}</td>
        <td>${frequency}</td>
      `;
      kanjiTableBody.appendChild(row);
    });

    // Show modal
    kanjiModal.classList.add("show");
  } catch (error) {
    console.error("Error analyzing kanji:", error);
    showToast("Failed to analyze kanji");
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = "Analyze Kanji";
  }
}

function closeModal() {
  kanjiModal.classList.remove("show");
}

function showToast(message: string) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.add("show");
  });
  const ttl = 1800;
  setTimeout(() => {
    el.remove();
  }, ttl + 250);
}
