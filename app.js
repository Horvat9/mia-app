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
// 2. CARICA TUTTI I PROGETTI
//    — progetti (web app)
//    — projects  (GameBook Studio desktop/mobile)
// =============================================
async function caricaProgetti() {
  const { data: { user } } = await client.auth.getUser()

  // Progetti web app
  const { data: miei } = await client
    .from("progetti")
    .select("*, capitoli(count)")
    .eq("user_id", user.id)
    .order("creato_il", { ascending: false })

  // Progetti collaborati
  const { data: collab } = await client
    .from("collaboratori")
    .select("*, progetti(*, capitoli(count))")
    .eq("user_id", user.id)

  // Progetti GameBook Studio (C++ / iOS)
  const { data: desktopProj } = await client
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  const lista = document.getElementById("lista-progetti")
  lista.innerHTML = ""

  // ── Sezione progetti web ─────────────────────────────────
  const tuttiWeb = [...(miei || [])]
  collab?.forEach(c => {
    if (!tuttiWeb.find(p => p.id === c.progetti.id)) {
      tuttiWeb.push({ ...c.progetti, ruolo: c.ruolo })
    }
  })

  // ── Sezione progetti desktop/mobile ──────────────────────
  const desktop = desktopProj || []

  if (tuttiWeb.length === 0 && desktop.length === 0) {
    lista.innerHTML = "<p class='vuoto'>Nessun progetto ancora. Creane uno! 🚀</p>"
    return
  }

  // Progetti web app
  if (tuttiWeb.length > 0) {
    const intestazione = document.createElement("h3")
    intestazione.className = "sezione-titolo"
    intestazione.textContent = tr("Progetti Web")
    lista.appendChild(intestazione)

    tuttiWeb.forEach(progetto => {
      const card = creaCardProgetto(progetto)
      if (progetto.ruolo) {
        const badge = document.createElement("span")
        badge.className = "badge-condiviso"
        badge.textContent = progetto.ruolo === "editor" ? "✏️ Condiviso" : "👁️ Sola lettura"
        card.querySelector(".card-azioni").prepend(badge)
      }
      lista.appendChild(card)
    })
  }

  // Progetti GameBook Studio
  if (desktop.length > 0) {
    const intestazione = document.createElement("h3")
    intestazione.className = "sezione-titolo"
    intestazione.textContent = tr("Progetti GameBook Studio")
    lista.appendChild(intestazione)

    desktop.forEach(p => {
      const card = creaCardDesktop(p)
      lista.appendChild(card)
    })
  }
}

// =============================================
// 3. CARD PROGETTO WEB
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
  info.textContent = numCapitoli + " " + tr(numCapitoli === 1 ? "capitolo" : "capitoli")

  const btnApri = document.createElement("button")
  btnApri.textContent = tr("Apri →")
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
// 4. CARD PROGETTO DESKTOP (GameBook Studio)
// =============================================
function creaCardDesktop(p) {
  const card = document.createElement("div")
  card.className = "card-progetto card-desktop"

  const titolo = document.createElement("h3")
  titolo.textContent = "📱 " + p.name

  const desc = document.createElement("p")
  desc.className = "card-desc"
  desc.textContent = p.description || "Nessuna descrizione"

  // Conta i paragrafi dal campo data JSONB
  let numParagrafi = 0
  try {
    const data = typeof p.data === "string" ? JSON.parse(p.data) : p.data
    numParagrafi = data?.paragraphs?.length || 0
  } catch(e) {}

  const info = document.createElement("span")
  info.className = "card-info"
  info.textContent = numParagrafi + " " + tr(numParagrafi === 1 ? "paragrafo" : "paragrafi")

  const badge = document.createElement("span")
  badge.className = "badge-condiviso"
  badge.textContent = "🖥️ GameBook Studio"

  const btnApri = document.createElement("button")
  btnApri.textContent = tr("Apri →")
  btnApri.className = "btn-apri"
  btnApri.addEventListener("click", () => {
    localStorage.setItem("desktop_project_id", p.id)
    window.location.href = "progetto_desktop.html"
  })

  const btnElimina = document.createElement("button")
  btnElimina.textContent = "🗑️"
  btnElimina.className = "btn-elimina"
  btnElimina.addEventListener("click", () => eliminaDesktop(p.id))

  const azioni = document.createElement("div")
  azioni.className = "card-azioni"
  azioni.appendChild(badge)
  azioni.appendChild(info)
  azioni.appendChild(btnApri)
  azioni.appendChild(btnElimina)

  card.appendChild(titolo)
  card.appendChild(desc)
  card.appendChild(azioni)
  return card
}

// =============================================
// 5. CREA NUOVO PROGETTO WEB
// =============================================
document.getElementById("btn-crea").addEventListener("click", async function() {
  const titolo = document.getElementById("input-titolo").value.trim()
  const descrizione = document.getElementById("input-descrizione").value.trim()

  if (titolo === "") { mostraMessaggio(tr("Inserisci almeno il titolo!"), "errore"); return }

  const { data: { user } } = await client.auth.getUser()
  const { error } = await client
    .from("progetti")
    .insert({ titolo, descrizione, user_id: user.id })

  if (error) {
    mostraMessaggio(tr("Errore nella creazione ❌"), "errore")
    console.log(error.message)
  } else {
    document.getElementById("input-titolo").value = ""
    document.getElementById("input-descrizione").value = ""
    mostraMessaggio(tr("Progetto creato! ✅"), "successo")
    caricaProgetti()
  }
})

// =============================================
// 6. ELIMINA PROGETTO
// =============================================
async function eliminaProgetto(id) {
  if (!confirm(tr("Sei sicuro? Eliminerai anche tutti i capitoli!"))) return
  const { error } = await client.from("progetti").delete().eq("id", id)
  if (!error) caricaProgetti()
}

async function eliminaDesktop(id) {
  if (!confirm(tr("Sei sicuro? Eliminerai anche tutti i capitoli?"))) return
  const { error } = await client.from("projects").delete().eq("id", id)
  if (!error) caricaProgetti()
}

// =============================================
// 7. LOGOUT
// =============================================
document.getElementById("btn-logout").addEventListener("click", async function() {
  await client.auth.signOut()
  window.location.href = "index.html"
})

// =============================================
// 8. MESSAGGI
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
// 9. INVITI RICEVUTI
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
  alert(tr("Invito accettato!"))
  caricaInvitiRicevuti()
  caricaProgetti()
}

async function rifiutaInvito(id) {
  await client.from("inviti").delete().eq("id", id)
  caricaInvitiRicevuti()
}

init()
