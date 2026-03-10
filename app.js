// @ts-nocheck
const SUPABASE_URL = "https://zpoqbwmgubfqphscngaz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3Fid21ndWJmcXBoc2NuZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIyNTEsImV4cCI6MjA4ODcwODI1MX0.Sv0ImWp-OUBB5DpmST2ZeLvuYl50cY60kdt7pwDC5vg"

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

// =============================================
// 1. INIT
// =============================================
async function init() {
  const { data: { user } } = await client.auth.getUser()
  if (!user) { window.location.href = "index.html"; return }

  document.getElementById("utente-email").textContent = user.email
  caricaProgetti()
  caricaInvitiRicevuti()
}

// =============================================
// 2. CARICA TUTTI I PROGETTI DELL'UTENTE
// =============================================
async function caricaProgetti() {
  const { data, error } = await client
    .from("progetti")
    .select("*, capitoli(count)")
    .order("creato_il", { ascending: false })

  if (error) { console.log("Errore:", error.message); return }

  const lista = document.getElementById("lista-progetti")
  lista.innerHTML = ""

  if (data.length === 0) {
    lista.innerHTML = "<p class='vuoto'>Nessun progetto ancora. Creane uno! 🚀</p>"
    return
  }

  data.forEach(progetto => lista.appendChild(creaCardProgetto(progetto)))
}

// =============================================
// 3. CREA LA CARD DI UN PROGETTO
// =============================================
function creaCardProgetto(progetto) {
  const card = document.createElement("div")
  card.className = "card-progetto"

  const numCapitoli = progetto.capitoli[0].count

  const titolo = document.createElement("h3")
  titolo.textContent = "📖 " + progetto.titolo

  const desc = document.createElement("p")
  desc.className = "card-desc"
  desc.textContent = progetto.descrizione || "Nessuna descrizione"

  const info = document.createElement("span")
  info.className = "card-info"
  info.textContent = numCapitoli + (numCapitoli === 1 ? " capitolo" : " capitoli")

  const btnApri = document.createElement("button")
  btnApri.textContent = "Apri →"
  btnApri.className = "btn-apri"
  btnApri.addEventListener("click", () => {
    localStorage.setItem("progetto_id", progetto.id)
    localStorage.setItem("progetto_titolo", progetto.titolo)
    window.location.href = "progetto.html"
  })

  const btnElimina = document.createElement("button")
  btnElimina.textContent = "🗑️"
  btnElimina.className = "btn-elimina"
  btnElimina.addEventListener("click", () => eliminaProgetto(progetto.id))

  const azioni = document.createElement("div")
  azioni.className = "card-azioni"
  azioni.appendChild(info)
  azioni.appendChild(btnApri)
  azioni.appendChild(btnElimina)

  card.appendChild(titolo)
  card.appendChild(desc)
  card.appendChild(azioni)

  return card
}

// =============================================
// 4. CREA UN NUOVO PROGETTO
// =============================================
document.getElementById("btn-crea").addEventListener("click", async function() {
  const titolo = document.getElementById("input-titolo").value.trim()
  const descrizione = document.getElementById("input-descrizione").value.trim()

  if (titolo === "") {
    mostraMessaggio("Inserisci almeno il titolo!", "errore")
    return
  }

  const { data: { user } } = await client.auth.getUser()

  const { error } = await client
    .from("progetti")
    .insert({ titolo, descrizione, user_id: user.id })

  if (error) {
    mostraMessaggio("Errore nella creazione ❌", "errore")
    console.log(error.message)
  } else {
    document.getElementById("input-titolo").value = ""
    document.getElementById("input-descrizione").value = ""
    mostraMessaggio("Progetto creato! ✅", "successo")
    caricaProgetti()
  }
})

// =============================================
// 5. ELIMINA UN PROGETTO
// =============================================
async function eliminaProgetto(id) {
  if (!confirm("Sei sicuro? Eliminerai anche tutti i capitoli!")) return
  const { error } = await client.from("progetti").delete().eq("id", id)
  if (!error) caricaProgetti()
}

// =============================================
// 6. LOGOUT
// =============================================
document.getElementById("btn-logout").addEventListener("click", async function() {
  await client.auth.signOut()
  window.location.href = "index.html"
})

// =============================================
// 7. MESSAGGI
// =============================================
function mostraMessaggio(testo, tipo) {
  const box = document.getElementById("messaggio")
  box.textContent = testo
  box.style.color = tipo === "errore" ? "red" : "green"
  box.style.backgroundColor = tipo === "errore" ? "#fff0f0" : "#f0fff4"
  box.style.padding = "10px"
  box.style.borderRadius = "8px"
  setTimeout(() => {
    box.textContent = ""
    box.style.backgroundColor = ""
    box.style.padding = ""
  }, 3000)
}

// =============================================
// 8. INVITI RICEVUTI
// =============================================
async function caricaInvitiRicevuti() {
  const { data: { user } } = await client.auth.getUser()

  const { data, error } = await client
    .from("inviti")
    .select("*, progetti(titolo)")
    .eq("email", user.email)
    .eq("accettato", false)

  if (error || !data || data.length === 0) return

  const pannello = document.getElementById("pannello-inviti")
  const lista = document.getElementById("lista-inviti-ricevuti")
  pannello.style.display = "block"
  lista.innerHTML = ""

  data.forEach(invito => {
    const div = document.createElement("div")
    div.className = "invito-card"

    const testo = document.createElement("p")
    testo.innerHTML = "Sei stato invitato a collaborare su <strong>"
      + invito.progetti.titolo + "</strong> come "
      + (invito.ruolo === "editor" ? "✏️ editor" : "👁️ lettore")

    const azioni = document.createElement("div")
    azioni.className = "invito-azioni"

    const btnAccetta = document.createElement("button")
    btnAccetta.textContent = "✅ Accetta"
    btnAccetta.className = "btn-accetta"
    btnAccetta.addEventListener("click", () => accettaInvito(invito, user))

    const btnRifiuta = document.createElement("button")
    btnRifiuta.textContent = "❌ Rifiuta"
    btnRifiuta.className = "btn-rifiuta"
    btnRifiuta.addEventListener("click", () => rifiutaInvito(invito.id))

    azioni.appendChild(btnAccetta)
    azioni.appendChild(btnRifiuta)
    div.appendChild(testo)
    div.appendChild(azioni)
    lista.appendChild(div)
  })
}

async function accettaInvito(invito, user) {
  await client.from("collaboratori").insert({
    progetto_id: invito.progetto_id,
    user_id: user.id,
    ruolo: invito.ruolo
  })
  await client.from("inviti").update({ accettato: true }).eq("id", invito.id)
  alert("Invito accettato! Trovi il progetto nella lista.")
  caricaInvitiRicevuti()
  caricaProgetti()
}

async function rifiutaInvito(id) {
  await client.from("inviti").delete().eq("id", id)
  caricaInvitiRicevuti()
}

init()