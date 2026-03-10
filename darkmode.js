// Applica dark mode salvata
function applicaDarkMode() {
  const dark = localStorage.getItem("darkmode") === "true"
  document.body.classList.toggle("dark", dark)
  const btn = document.getElementById("btn-darkmode")
  if (btn) btn.textContent = dark ? "☀️" : "🌙"
}

// Toggle al click
function inizializzaDarkMode() {
  applicaDarkMode()
  const btn = document.getElementById("btn-darkmode")
  if (!btn) return
  btn.addEventListener("click", () => {
    const dark = document.body.classList.toggle("dark")
    localStorage.setItem("darkmode", dark)
    btn.textContent = dark ? "☀️" : "🌙"
  })
}

inizializzaDarkMode()