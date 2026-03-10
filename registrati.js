const SUPABASE_URL = "https://zpoqbwmgubfqphscngaz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3Fid21ndWJmcXBoc2NuZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIyNTEsImV4cCI6MjA4ODcwODI1MX0.Sv0ImWp-OUBB5DpmST2ZeLvuYl50cY60kdt7pwDC5vg"

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

document.getElementById("btn-registrati").addEventListener("click", async function() {
  const email    = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const password2 = document.getElementById("password2").value

  // Validazione
  if (!email || !password || !password2) {
    mostraMessaggio("Compila tutti i campi!", "errore")
    return
  }

  if (!email.includes("@")) {
    mostraMessaggio("Inserisci un'email valida!", "errore")
    return
  }

  if (password.length < 6) {
    mostraMessaggio("La password deve avere almeno 6 caratteri!", "errore")
    return
  }

  if (password !== password2) {
    mostraMessaggio("Le password non coincidono!", "errore")
    return
  }

  const btn = document.getElementById("btn-registrati")
  btn.textContent = "Registrazione in corso..."
  btn.disabled = true

  const { data, error } = await client.auth.signUp({ email, password })

  btn.textContent = "Crea account"
  btn.disabled = false

  if (error) {
    mostraMessaggio(error.message, "errore")
  } else {
    mostraMessaggio("Account creato! ✅ Accesso in corso...", "successo")
    setTimeout(() => {
      window.location.href = "app.html"
    }, 1500)
  }
})

function mostraMessaggio(testo, tipo) {
  const box = document.getElementById("messaggio")
  box.textContent = testo
  box.style.color = tipo === "errore" ? "red" : "green"
  box.style.backgroundColor = tipo === "errore" ? "#fff0f0" : "#f0fff4"
  box.style.padding = "10px"
  box.style.borderRadius = "8px"
}