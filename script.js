const SUPABASE_URL = "https://zpoqbwmgubfqphscngaz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3Fid21ndWJmcXBoc2NuZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIyNTEsImV4cCI6MjA4ODcwODI1MX0.Sv0ImWp-OUBB5DpmST2ZeLvuYl50cY60kdt7pwDC5vg"

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

const inputEmail = document.getElementById("email")
const inputPassword = document.getElementById("password")
const btnLogin = document.getElementById("btn-login")

btnLogin.addEventListener("click", async function() {

  const email = inputEmail.value
  const password = inputPassword.value

  if (email === "" || password === "") {
    mostraMessaggio("Compila tutti i campi!", "errore")
    return
  }

  btnLogin.textContent = "Accesso in corso..."
  btnLogin.disabled = true

  const { data, error } = await client.auth.signInWithPassword({
    email: email,
    password: password
  })

  btnLogin.textContent = "Accedi"
  btnLogin.disabled = false

  if (error) {
    mostraMessaggio("Email o password errati ❌", "errore")
    console.log("Errore:", error.message)
  } else {
    mostraMessaggio("Accesso effettuato! ✅", "successo")
    setTimeout(() => {
      window.location.href = "app.html"
    }, 1000)
  }

})

function mostraMessaggio(testo, tipo) {
  const box = document.getElementById("messaggio")
  box.textContent = testo
  if (tipo === "errore") {
    box.style.color = "red"
    box.style.backgroundColor = "#fff0f0"
  } else {
    box.style.color = "green"
    box.style.backgroundColor = "#f0fff4"
  }
}