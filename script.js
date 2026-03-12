const SUPABASE_URL = "https://zpoqbwmgubfqphscngaz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3Fid21ndWJmcXBoc2NuZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIyNTEsImV4cCI6MjA4ODcwODI1MX0.Sv0ImWp-OUBB5DpmST2ZeLvuYl50cY60kdt7pwDC5vg"

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

const inputEmail    = document.getElementById("email")
const inputPassword = document.getElementById("password")
const btnLogin      = document.getElementById("btn-login")

btnLogin.addEventListener("click", async function() {
  const email    = inputEmail.value
  const password = inputPassword.value

  if (email === "" || password === "") {
    mostraMessaggio(tr("Compila tutti i campi!"), "errore"); return
  }

  btnLogin.textContent = tr("Accesso in corso...")
  btnLogin.disabled = true

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  btnLogin.textContent = tr("Accedi")
  btnLogin.disabled = false

  if (error) {
    mostraMessaggio(tr("Email o password errati ❌"), "errore")
  } else {
    mostraMessaggio(tr("Accesso effettuato! ✅"), "successo")
    setTimeout(() => { window.location.href = "app.html" }, 1000)
  }
})

function mostraMessaggio(testo, tipo) {
  const box = document.getElementById("messaggio")
  box.textContent = testo
  box.style.color = tipo === "errore" ? "red" : "green"
  box.style.backgroundColor = tipo === "errore" ? "#fff0f0" : "#f0fff4"
}
