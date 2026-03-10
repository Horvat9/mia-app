// @ts-nocheck
const SUPABASE_URL = "https://zpoqbwmgubfqphscngaz.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwb3Fid21ndWJmcXBoc2NuZ2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzIyNTEsImV4cCI6MjA4ODcwODI1MX0.Sv0ImWp-OUBB5DpmST2ZeLvuYl50cY60kdt7pwDC5vg"

const { createClient } = supabase
const client = createClient(SUPABASE_URL, SUPABASE_KEY)

// Stato globale
const stato = {
  progettoId: localStorage.getItem("progetto_id"),
  progettoTitolo: localStorage.getItem("progetto_titolo"),
  capitoloSelezionato: null,
  personaggioSelezionato: null
}

let utenteCorrente = null


// =============================================
// 1. INIT
// =============================================
async function init() {
  const { data: { user } } = await client.auth.getUser()
  if (!user) { window.location.href = "index.html"; return }
  if (!stato.progettoId) { window.location.href = "app.html"; return }

  utenteCorrente = user
  document.getElementById("titolo-progetto").textContent = stato.progettoTitolo

  caricaCapitoli()
  caricaPersonaggi()
  caricaNote()
}


// =============================================
// 2. CAPITOLI
// =============================================
async function caricaCapitoli() {
  const { data, error } = await client
    .from("capitoli")
    .select("*")
    .eq("progetto_id", stato.progettoId)
    .order("ordine", { ascending: true })

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-capitoli")
  lista.innerHTML = ""

  data.forEach(capitolo => {
    const li = document.createElement("li")
    li.className = "sidebar-item" + (stato.capitoloSelezionato?.id === capitolo.id ? " selezionato" : "")
    li.textContent = capitolo.titolo
    li.addEventListener("click", () => apriCapitolo(capitolo))

    const btnDel = document.createElement("button")
    btnDel.textContent = "×"
    btnDel.className = "btn-del"
    btnDel.addEventListener("click", (e) => {
      e.stopPropagation()
      eliminaCapitolo(capitolo.id)
    })

    li.appendChild(btnDel)
    lista.appendChild(li)
  })

  aggiornaMappa(data)
}

async function aggiungiCapitolo() {
  const titolo = prompt("Titolo del capitolo:")
  if (!titolo) return

  const { data: tutti } = await client
    .from("capitoli")
    .select("ordine")
    .eq("progetto_id", stato.progettoId)
    .order("ordine", { ascending: false })
    .limit(1)

  const nuovoOrdine = tutti.length > 0 ? tutti[0].ordine + 1 : 0

  const { error } = await client
    .from("capitoli")
    .insert({ titolo, progetto_id: stato.progettoId, ordine: nuovoOrdine })

  if (!error) caricaCapitoli()
}

async function eliminaCapitolo(id) {
  if (!confirm("Eliminare questo capitolo?")) return
  await client.from("capitoli").delete().eq("id", id)
  stato.capitoloSelezionato = null
  document.getElementById("editor-attivo").style.display = "none"
  document.getElementById("placeholder-scrittura").style.display = "block"
  caricaCapitoli()
}

function apriCapitolo(capitolo) {
  stato.capitoloSelezionato = capitolo

  document.getElementById("placeholder-scrittura").style.display = "none"
  document.getElementById("editor-attivo").style.display = "flex"

  document.getElementById("titolo-capitolo").value = capitolo.titolo
  document.getElementById("testo-capitolo").value = capitolo.contenuto || ""
  aggiornaContatore()

  caricaCapitoli()
  cambiaSscheda("scrittura")
  caricaImmagini(capitolo.id)
  renderizzaLink()
}

async function salvaCapitolo() {
  if (!stato.capitoloSelezionato) return

  const titolo = document.getElementById("titolo-capitolo").value
  const contenuto = document.getElementById("testo-capitolo").value

  mostraSalvataggio("Salvataggio...")

  const { error } = await client
    .from("capitoli")
    .update({ titolo, contenuto })
    .eq("id", stato.capitoloSelezionato.id)

  if (error) {
    mostraSalvataggio("Errore ❌")
  } else {
    stato.capitoloSelezionato.titolo = titolo
    mostraSalvataggio("Salvato ✅")
    caricaCapitoli()
    setTimeout(() => mostraSalvataggio(""), 2000)
  }
}


// =============================================
// 3. PERSONAGGI
// =============================================
async function caricaPersonaggi() {
  const { data, error } = await client
    .from("personaggi")
    .select("*")
    .eq("progetto_id", stato.progettoId)

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-personaggi")
  lista.innerHTML = ""

  data.forEach(p => {
    const li = document.createElement("li")
    li.className = "sidebar-item" + (stato.personaggioSelezionato?.id === p.id ? " selezionato" : "")
    li.textContent = p.nome
    li.addEventListener("click", () => apriPersonaggio(p))

    const btnDel = document.createElement("button")
    btnDel.textContent = "×"
    btnDel.className = "btn-del"
    btnDel.addEventListener("click", (e) => {
      e.stopPropagation()
      eliminaPersonaggio(p.id)
    })

    li.appendChild(btnDel)
    lista.appendChild(li)
  })
}

async function aggiungiPersonaggio() {
  const nome = prompt("Nome del personaggio:")
  if (!nome) return

  const { error } = await client
    .from("personaggi")
    .insert({ nome, progetto_id: stato.progettoId })

  if (!error) caricaPersonaggi()
}

async function eliminaPersonaggio(id) {
  if (!confirm("Eliminare questo personaggio?")) return
  await client.from("personaggi").delete().eq("id", id)
  stato.personaggioSelezionato = null
  document.getElementById("editor-personaggio").style.display = "none"
  document.getElementById("placeholder-personaggio").style.display = "block"
  caricaPersonaggi()
}

function apriPersonaggio(p) {
  stato.personaggioSelezionato = p

  document.getElementById("placeholder-personaggio").style.display = "none"
  document.getElementById("editor-personaggio").style.display = "flex"

  document.getElementById("nome-personaggio").value = p.nome
  document.getElementById("ruolo-personaggio").value = p.ruolo || ""
  document.getElementById("desc-personaggio").value = p.descrizione || ""

  caricaPersonaggi()
  cambiaSscheda("personaggio")
}

async function salvaPersonaggio() {
  if (!stato.personaggioSelezionato) return

  const nome = document.getElementById("nome-personaggio").value
  const ruolo = document.getElementById("ruolo-personaggio").value
  const descrizione = document.getElementById("desc-personaggio").value

  const { error } = await client
    .from("personaggi")
    .update({ nome, ruolo, descrizione })
    .eq("id", stato.personaggioSelezionato.id)

  if (!error) {
    mostraSalvataggio("Personaggio salvato ✅")
    setTimeout(() => mostraSalvataggio(""), 2000)
    caricaPersonaggi()
  }
}


// =============================================
// 4. NOTE
// =============================================
async function caricaNote() {
  const { data, error } = await client
    .from("note")
    .select("*")
    .eq("progetto_id", stato.progettoId)
    .order("creato_il", { ascending: false })

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-note")
  lista.innerHTML = ""

  data.forEach(nota => {
    const div = document.createElement("div")
    div.className = "nota-item"

    const testo = document.createElement("p")
    testo.textContent = nota.testo

    const btnDel = document.createElement("button")
    btnDel.textContent = "🗑️"
    btnDel.addEventListener("click", () => eliminaNota(nota.id))

    div.appendChild(testo)
    div.appendChild(btnDel)
    lista.appendChild(div)
  })
}

async function aggiungiNota() {
  const testo = document.getElementById("input-nota").value.trim()
  if (!testo) return

  const { error } = await client
    .from("note")
    .insert({ testo, progetto_id: stato.progettoId })

  if (!error) {
    document.getElementById("input-nota").value = ""
    caricaNote()
  }
}

async function eliminaNota(id) {
  await client.from("note").delete().eq("id", id)
  caricaNote()
}


// =============================================
// 5. MAPPA CAPITOLI
// =============================================
function aggiornaMappa(capitoli) {
  const canvas = document.getElementById("canvas-mappa")
  canvas.innerHTML = ""

  if (capitoli.length === 0) {
    canvas.innerHTML = "<p class='placeholder'>Aggiungi capitoli per vedere la mappa</p>"
    return
  }

  capitoli.forEach((cap, index) => {
    const nodo = document.createElement("div")
    nodo.className = "nodo-mappa"
    nodo.textContent = cap.titolo

    nodo.style.left = (index % 3) * 220 + 20 + "px"
    nodo.style.top = Math.floor(index / 3) * 120 + 20 + "px"

    nodo.addEventListener("click", () => apriCapitolo(cap))
    canvas.appendChild(nodo)
  })
}


// =============================================
// 6. SCHEDE
// =============================================
function cambiaSscheda(nome) {
  document.querySelectorAll(".contenuto-scheda").forEach(s => s.style.display = "none")
  document.querySelectorAll(".scheda").forEach(s => s.classList.remove("attiva"))

  document.getElementById("scheda-" + nome).style.display = "block"
  document.querySelector("[data-scheda='" + nome + "']").classList.add("attiva")
}

document.querySelectorAll(".scheda").forEach(btn => {
  btn.addEventListener("click", () => cambiaSscheda(btn.dataset.scheda))
})


// =============================================
// 7. CONTATORE PAROLE
// =============================================
function aggiornaContatore() {
  const testo = document.getElementById("testo-capitolo").value.trim()
  const parole = testo === "" ? 0 : testo.split(/\s+/).length
  document.getElementById("contatore-parole").textContent = parole + " parole"
}

document.getElementById("testo-capitolo").addEventListener("input", aggiornaContatore)
document.getElementById("testo-capitolo").addEventListener("input", renderizzaLink)


// =============================================
// 8. BOTTONI
// =============================================
document.getElementById("btn-nuovo-capitolo").addEventListener("click", aggiungiCapitolo)
document.getElementById("btn-nuovo-personaggio").addEventListener("click", aggiungiPersonaggio)
document.getElementById("btn-salva").addEventListener("click", salvaCapitolo)
document.getElementById("btn-salva-personaggio").addEventListener("click", salvaPersonaggio)
document.getElementById("btn-aggiungi-nota").addEventListener("click", aggiungiNota)
document.getElementById("btn-indietro").addEventListener("click", () => window.location.href = "app.html")
document.getElementById("btn-logout").addEventListener("click", async () => {
  await client.auth.signOut()
  window.location.href = "index.html"
})


// =============================================
// 9. UTILITIES
// =============================================
function mostraSalvataggio(testo) {
  document.getElementById("stato-salvataggio").textContent = testo
}


// =============================================
// CORRETTORE GRAMMATICALE (LanguageTool)
// =============================================
document.getElementById("btn-correggi").addEventListener("click", async function() {
  const testo = document.getElementById("testo-capitolo").value.trim()

  if (testo === "") {
    alert("Scrivi qualcosa prima di correggere!")
    return
  }

  const pannello = document.getElementById("pannello-correzioni")
  const contenuto = document.getElementById("correzioni-contenuto")
  pannello.style.display = "block"
  contenuto.innerHTML = "<p class='caricamento'>⏳ Analisi in corso...</p>"

  try {
    const risposta = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: testo, language: "it" })
    })

    const dati = await risposta.json()
    const errori = dati.matches
    contenuto.innerHTML = ""

    if (errori.length === 0) {
      contenuto.innerHTML = "<p class='nessun-errore'>✅ Nessun errore trovato! Il testo sembra corretto.</p>"
      return
    }

    const intestazione = document.createElement("p")
    intestazione.className = "correzione-intestazione"
    intestazione.textContent = errori.length + " suggeriment" + (errori.length === 1 ? "o" : "i") + " trovati:"
    contenuto.appendChild(intestazione)

    errori.forEach((errore) => {
      const card = document.createElement("div")
      card.className = "correzione-card"

      const originale = document.createElement("p")
      originale.className = "correzione-originale"
      originale.textContent = "❌ \"" + testo.substring(errore.offset, errore.offset + errore.length) + "\""

      const messaggio = document.createElement("p")
      messaggio.className = "correzione-messaggio"
      messaggio.textContent = errore.message

      card.appendChild(originale)
      card.appendChild(messaggio)

      if (errore.replacements.length > 0) {
        const suggerimenti = document.createElement("div")
        suggerimenti.className = "correzione-suggerimenti"

        const label = document.createElement("span")
        label.textContent = "Suggerimenti: "
        label.className = "suggerimenti-label"
        suggerimenti.appendChild(label)

        errore.replacements.slice(0, 4).forEach(sug => {
          const btn = document.createElement("button")
          btn.className = "btn-suggerimento"
          btn.textContent = sug.value
          btn.addEventListener("click", () => {
            const testoAttuale = document.getElementById("testo-capitolo").value
            const nuovo = testoAttuale.substring(0, errore.offset)
              + sug.value
              + testoAttuale.substring(errore.offset + errore.length)
            document.getElementById("testo-capitolo").value = nuovo
            aggiornaContatore()
            card.style.opacity = "0.4"
            label.textContent = "✅ Sostituito"
          })
          suggerimenti.appendChild(btn)
        })

        card.appendChild(suggerimenti)
      }

      contenuto.appendChild(card)
    })

  } catch (errore) {
    contenuto.innerHTML = "<p style='color:red'>Errore nella connessione. Controlla la tua connessione internet.</p>"
    console.log(errore)
  }
})

document.getElementById("btn-chiudi-correzioni").addEventListener("click", function() {
  document.getElementById("pannello-correzioni").style.display = "none"
})


// =============================================
// COLLABORATORI
// =============================================
async function caricaCollaboratori() {
  const { data, error } = await client
    .from("collaboratori")
    .select("*, profili:user_id(email)")
    .eq("progetto_id", stato.progettoId)

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-collaboratori")
  lista.innerHTML = ""

  if (data.length === 0) {
    lista.innerHTML = "<p class='vuoto'>Nessun collaboratore ancora</p>"
    return
  }

  data.forEach(c => {
    const div = document.createElement("div")
    div.className = "collab-item"

    const info = document.createElement("div")
    info.className = "collab-info"

    const avatar = document.createElement("div")
    avatar.className = "collab-avatar"
    avatar.textContent = (c.profili?.email || "?")[0].toUpperCase()

    const testi = document.createElement("div")

    const email = document.createElement("p")
    email.className = "collab-email"
    email.textContent = c.profili?.email || "Utente sconosciuto"

    const ruolo = document.createElement("span")
    ruolo.className = "badge-ruolo " + c.ruolo
    ruolo.textContent = c.ruolo === "editor" ? "✏️ Editor" : "👁️ Lettore"

    testi.appendChild(email)
    testi.appendChild(ruolo)
    info.appendChild(avatar)
    info.appendChild(testi)
    div.appendChild(info)

    if (utenteCorrente && c.user_id !== utenteCorrente.id) {
      const btnRimuovi = document.createElement("button")
      btnRimuovi.textContent = "Rimuovi"
      btnRimuovi.className = "btn-rimuovi"
      btnRimuovi.addEventListener("click", () => rimuoviCollaboratore(c.id))
      div.appendChild(btnRimuovi)
    }

    lista.appendChild(div)
  })
}

async function caricaInvitiInSospeso() {
  const { data, error } = await client
    .from("inviti")
    .select("*")
    .eq("progetto_id", stato.progettoId)
    .eq("accettato", false)

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-inviti")
  lista.innerHTML = ""

  if (data.length === 0) {
    lista.innerHTML = "<p class='vuoto'>Nessun invito in sospeso</p>"
    return
  }

  data.forEach(invito => {
    const div = document.createElement("div")
    div.className = "collab-item"

    const info = document.createElement("div")
    info.className = "collab-info"

    const avatar = document.createElement("div")
    avatar.className = "collab-avatar pending"
    avatar.textContent = invito.email[0].toUpperCase()

    const testi = document.createElement("div")

    const email = document.createElement("p")
    email.className = "collab-email"
    email.textContent = invito.email

    const ruolo = document.createElement("span")
    ruolo.className = "badge-ruolo " + invito.ruolo
    ruolo.textContent = invito.ruolo === "editor" ? "✏️ Editor" : "👁️ Lettore"

    testi.appendChild(email)
    testi.appendChild(ruolo)
    info.appendChild(avatar)
    info.appendChild(testi)
    div.appendChild(info)

    const btnAnnulla = document.createElement("button")
    btnAnnulla.textContent = "Annulla"
    btnAnnulla.className = "btn-rimuovi"
    btnAnnulla.addEventListener("click", () => annullaInvito(invito.id))
    div.appendChild(btnAnnulla)

    lista.appendChild(div)
  })
}

document.getElementById("btn-invita").addEventListener("click", async function() {
  const email = document.getElementById("input-email-invito").value.trim()
  const ruolo = document.getElementById("input-ruolo-invito").value

  if (!email || !email.includes("@")) {
    mostraMessaggioInvito("Inserisci un'email valida!", "errore")
    return
  }

  const { data: esistente } = await client
    .from("inviti")
    .select("id")
    .eq("progetto_id", stato.progettoId)
    .eq("email", email)
    .eq("accettato", false)

  if (esistente && esistente.length > 0) {
    mostraMessaggioInvito("Hai già invitato questa email!", "errore")
    return
  }

  const { error } = await client
    .from("inviti")
    .insert({ progetto_id: stato.progettoId, email, ruolo })

  if (error) {
    mostraMessaggioInvito("Errore nell'invio ❌", "errore")
    console.log(error.message)
  } else {
    document.getElementById("input-email-invito").value = ""
    mostraMessaggioInvito("Invito creato! ✅ Comunica all'utente di accedere all'app.", "successo")
    caricaInvitiInSospeso()
  }
})

async function rimuoviCollaboratore(id) {
  if (!confirm("Rimuovere questo collaboratore?")) return
  await client.from("collaboratori").delete().eq("id", id)
  caricaCollaboratori()
}

async function annullaInvito(id) {
  await client.from("inviti").delete().eq("id", id)
  caricaInvitiInSospeso()
}

function mostraMessaggioInvito(testo, tipo) {
  const box = document.getElementById("messaggio-invito")
  box.textContent = testo
  box.style.color = tipo === "errore" ? "red" : "green"
  setTimeout(() => { box.textContent = "" }, 4000)
}


// =============================================
// CARICAMENTO IMMAGINI
// =============================================
async function caricaImmagini(capitoloId) {
  const galleria = document.getElementById("galleria-immagini")
  galleria.innerHTML = ""

  const { data, error } = await client
    .storage
    .from("immagini")
    .list("capitoli/" + capitoloId)

  if (error || !data || data.length === 0) return

  data.forEach(file => {
    const url = client.storage
      .from("immagini")
      .getPublicUrl("capitoli/" + capitoloId + "/" + file.name).data.publicUrl
    aggiungiImmagineGalleria(url, file.name, capitoloId)
  })
}

function aggiungiImmagineGalleria(url, nome, capitoloId) {
  const galleria = document.getElementById("galleria-immagini")

  const div = document.createElement("div")
  div.className = "immagine-card"

  const img = document.createElement("img")
  img.src = url
  img.className = "immagine-preview"
  img.addEventListener("click", () => window.open(url, "_blank"))

  const btnElimina = document.createElement("button")
  btnElimina.textContent = "🗑️"
  btnElimina.className = "btn-elimina-immagine"
  btnElimina.addEventListener("click", () => eliminaImmagine(capitoloId, nome))

  div.appendChild(img)
  div.appendChild(btnElimina)
  galleria.appendChild(div)
}

async function eliminaImmagine(capitoloId, nome) {
  if (!confirm("Eliminare questa immagine?")) return
  const { error } = await client
    .storage
    .from("immagini")
    .remove(["capitoli/" + capitoloId + "/" + nome])
  if (!error) caricaImmagini(capitoloId)
}

document.getElementById("input-immagine").addEventListener("change", async function(e) {
  const file = e.target.files[0]
  if (!file || !stato.capitoloSelezionato) return

  if (file.size > 5 * 1024 * 1024) {
    alert("Immagine troppo grande! Massimo 5MB.")
    return
  }

  mostraSalvataggio("Caricamento immagine...")

  const nomeFile = Date.now() + "_" + file.name.replace(/\s/g, "_")
  const percorso = "capitoli/" + stato.capitoloSelezionato.id + "/" + nomeFile

  const { error } = await client.storage.from("immagini").upload(percorso, file)

  if (error) {
    mostraSalvataggio("Errore caricamento ❌")
    console.log(error.message)
  } else {
    mostraSalvataggio("Immagine caricata ✅")
    setTimeout(() => mostraSalvataggio(""), 2000)
    caricaImmagini(stato.capitoloSelezionato.id)
  }

  e.target.value = ""
})


// =============================================
// LINK DIRETTI TRA CAPITOLI
// =============================================
document.getElementById("btn-inserisci-link").addEventListener("click", async function() {
  const pannello = document.getElementById("pannello-link")

  if (pannello.style.display !== "none") {
    pannello.style.display = "none"
    return
  }

  const { data, error } = await client
    .from("capitoli")
    .select("*")
    .eq("progetto_id", stato.progettoId)
    .order("ordine", { ascending: true })

  if (error) { console.log(error.message); return }

  const lista = document.getElementById("lista-link-capitoli")
  lista.innerHTML = ""

  data.forEach(cap => {
    if (stato.capitoloSelezionato && cap.id === stato.capitoloSelezionato.id) return

    const btn = document.createElement("button")
    btn.className = "btn-link-capitolo"
    btn.textContent = "📄 " + cap.titolo
    btn.addEventListener("click", () => inserisciLink(cap))
    lista.appendChild(btn)
  })

  if (lista.children.length === 0) {
    lista.innerHTML = "<p class='vuoto-link'>Nessun altro capitolo disponibile</p>"
  }

  pannello.style.display = "block"
})

function inserisciLink(capitolo) {
  const textarea = document.getElementById("testo-capitolo")
  const cursore = textarea.selectionStart
  const linkTesto = "[➡️ Vai a: " + capitolo.titolo + "](cap:" + capitolo.id + ")"

  const testoAttuale = textarea.value
  textarea.value = testoAttuale.substring(0, cursore)
    + "\n" + linkTesto + "\n"
    + testoAttuale.substring(cursore)

  aggiornaContatore()
  renderizzaLink()
  document.getElementById("pannello-link").style.display = "none"
}

function renderizzaLink() {
  const testo = document.getElementById("testo-capitolo").value
  const anteprima = document.getElementById("anteprima-link")
  if (!anteprima) return

  const regex = /\[([^\]]+)\]\(cap:([^)]+)\)/g
  let match
  const links = []

  while ((match = regex.exec(testo)) !== null) {
    links.push({ testo: match[1], id: match[2] })
  }

  anteprima.innerHTML = ""

  if (links.length === 0) {
    anteprima.style.display = "none"
    return
  }

  anteprima.style.display = "block"

  const titolo = document.createElement("p")
  titolo.className = "anteprima-titolo"
  titolo.textContent = "🔗 Link nel capitolo:"
  anteprima.appendChild(titolo)

  links.forEach(link => {
    const btn = document.createElement("button")
    btn.className = "btn-link-anteprima"
    btn.textContent = link.testo
    btn.addEventListener("click", async () => {
      const { data } = await client
        .from("capitoli")
        .select("*")
        .eq("id", link.id)
        .single()
      if (data) apriCapitolo(data)
    })
    anteprima.appendChild(btn)
  })
}

// =============================================
// ESPORTAZIONE
// =============================================

// Funzione base che scarica un file
function scaricaFile(nome, contenuto, tipo) {
  const blob = new Blob([contenuto], { type: tipo })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nome
  a.click()
  URL.revokeObjectURL(url)
}

// Carica tutti i capitoli del progetto
async function caricaCapitoliPerExport() {
  const { data, error } = await client
    .from("capitoli")
    .select("*")
    .eq("progetto_id", stato.progettoId)
    .order("ordine", { ascending: true })

  if (error) { console.log(error.message); return [] }
  return data
}

// =============================================
// UNITY — JSON con struttura Yarn Spinner
// =============================================
document.getElementById("btn-export-unity").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const nomeProgetto = stato.progettoTitolo.replace(/\s+/g, "_")

  const json = {
    title: stato.progettoTitolo,
    nodes: capitoli.map((cap, index) => {

      // Trova i link nel testo [testo](cap:ID)
      const regex = /\[([^\]]+)\]\(cap:([^)]+)\)/g
      let match
      const scelte = []
      while ((match = regex.exec(cap.contenuto || "")) !== null) {
        scelte.push({ testo: match[1], destinazione: match[2] })
      }

      // Rimuovi i link dal testo pulito
      const testoPulito = (cap.contenuto || "")
        .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "")
        .trim()

      return {
        id: cap.id,
        title: cap.titolo,
        body: testoPulito,
        position: { x: (index % 3) * 300, y: Math.floor(index / 3) * 200 },
        choices: scelte.map(s => ({
          text: s.testo,
          next: s.destinazione
        }))
      }
    })
  }

  scaricaFile(
    nomeProgetto + "_unity.json",
    JSON.stringify(json, null, 2),
    "application/json"
  )
})

// =============================================
// UNREAL — CSV come DataTable
// =============================================
document.getElementById("btn-export-unreal").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const nomeProgetto = stato.progettoTitolo.replace(/\s+/g, "_")

  // Intestazione CSV
  let csv = "Name,Title,Body,Choices\n"

  capitoli.forEach(cap => {
    // Trova i link
    const regex = /\[([^\]]+)\]\(cap:([^)]+)\)/g
    let match
    const scelte = []
    while ((match = regex.exec(cap.contenuto || "")) !== null) {
      scelte.push(match[1] + ">" + match[2])
    }

    // Testo pulito
    const testoPulito = (cap.contenuto || "")
      .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "")
      .replace(/"/g, "'")
      .replace(/\n/g, " ")
      .trim()

    const scelteTesto = scelte.join("|")

    csv += `"${cap.id}","${cap.titolo}","${testoPulito}","${scelteTesto}"\n`
  })

  scaricaFile(
    nomeProgetto + "_unreal.csv",
    csv,
    "text/csv"
  )
})

// =============================================
// GODOT — JSON compatibile con Dialogic
// =============================================
document.getElementById("btn-export-godot").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const nomeProgetto = stato.progettoTitolo.replace(/\s+/g, "_")

  const json = {
    name: stato.progettoTitolo,
    timelines: capitoli.map(cap => {

      const regex = /\[([^\]]+)\]\(cap:([^)]+)\)/g
      let match
      const scelte = []
      while ((match = regex.exec(cap.contenuto || "")) !== null) {
        scelte.push({ label: match[1], goto: match[2] })
      }

      const testoPulito = (cap.contenuto || "")
        .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "")
        .trim()

      const eventi = testoPulito.split("\n")
        .filter(r => r.trim() !== "")
        .map(riga => ({ type: "text", content: riga.trim() }))

      if (scelte.length > 0) {
        eventi.push({ type: "choice", options: scelte })
      }

      return {
        id: cap.id,
        name: cap.titolo,
        events: eventi
      }
    })
  }

  scaricaFile(
    nomeProgetto + "_godot.json",
    JSON.stringify(json, null, 2),
    "application/json"
  )
})

// =============================================
// MARKDOWN — Testo semplice
// =============================================
document.getElementById("btn-export-markdown").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const nomeProgetto = stato.progettoTitolo.replace(/\s+/g, "_")

  let md = "# " + stato.progettoTitolo + "\n\n"

  capitoli.forEach((cap, index) => {
    md += "## " + (index + 1) + ". " + cap.titolo + "\n\n"
    md += (cap.contenuto || "").trim() + "\n\n"
    md += "---\n\n"
  })

  scaricaFile(
    nomeProgetto + ".md",
    md,
    "text/markdown"
  )
})

// =============================================
// EXPORT HTML
// =============================================
document.getElementById("btn-export-html").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const nomeProgetto = stato.progettoTitolo

  // Genera il menu laterale
  const menuLinks = capitoli.map((cap, i) =>
    `<a href="#cap-${i}">${cap.titolo}</a>`
  ).join("\n")

  // Genera i capitoli
  const contenutoCapitoli = capitoli.map((cap, i) => {
    const testoPulito = (cap.contenuto || "")
      .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "<em>[$1]</em>")
      .replace(/\n/g, "<br>")

    return `
      <section id="cap-${i}" class="capitolo">
        <h2>${cap.titolo}</h2>
        <div class="testo">${testoPulito}</div>
      </section>
    `
  }).join("\n")

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>${nomeProgetto}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; font-family: Georgia, serif; background: #f5f5f5; }
    nav { width: 260px; min-width: 260px; background: #1a1a2e; color: white;
          height: 100vh; position: sticky; top: 0; overflow-y: auto; padding: 24px 0; }
    nav h1 { font-size: 16px; padding: 0 20px 20px; border-bottom: 1px solid #333;
             color: #aaa; font-weight: normal; }
    nav a { display: block; padding: 10px 20px; color: #ddd; text-decoration: none;
            font-size: 14px; border-left: 3px solid transparent; }
    nav a:hover { background: rgba(255,255,255,0.05); border-left-color: #4f46e5; }
    main { flex: 1; max-width: 720px; margin: 0 auto; padding: 48px 40px; }
    h1.titolo { font-size: 36px; color: #1a1a2e; margin-bottom: 48px;
                padding-bottom: 16px; border-bottom: 2px solid #eee; }
    .capitolo { margin-bottom: 64px; }
    .capitolo h2 { font-size: 24px; color: #1a1a2e; margin-bottom: 20px; }
    .testo { font-size: 17px; line-height: 1.9; color: #333; }
  </style>
</head>
<body>
  <nav>
    <h1>${nomeProgetto}</h1>
    ${menuLinks}
  </nav>
  <main>
    <h1 class="titolo">${nomeProgetto}</h1>
    ${contenutoCapitoli}
  </main>
</body>
</html>`

  scaricaFile(
    nomeProgetto.replace(/\s+/g, "_") + ".html",
    html,
    "text/html"
  )
})


// =============================================
// EXPORT PDF
// =============================================
document.getElementById("btn-export-pdf").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  const margineSx = 20
  const margineDx = 190
  const larghezza = margineDx - margineSx
  let y = 30

  // Titolo del progetto
  doc.setFont("helvetica", "bold")
  doc.setFontSize(24)
  doc.text(stato.progettoTitolo, margineSx, y)
  y += 16

  // Linea separatrice
  doc.setDrawColor(200, 200, 200)
  doc.line(margineSx, y, margineDx, y)
  y += 12

  capitoli.forEach((cap, index) => {
    // Nuova pagina se non c'è spazio
    if (y > 260) { doc.addPage(); y = 25 }

    // Titolo capitolo
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(26, 26, 46)
    doc.text((index + 1) + ". " + cap.titolo, margineSx, y)
    y += 10

    // Testo capitolo
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)

    const testoPulito = (cap.contenuto || "")
      .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "[$1]")

    const righe = doc.splitTextToSize(testoPulito, larghezza)

    righe.forEach(riga => {
      if (y > 270) { doc.addPage(); y = 25 }
      doc.text(riga, margineSx, y)
      y += 6
    })

    y += 12

    // Linea tra capitoli
    if (index < capitoli.length - 1) {
      doc.setDrawColor(220, 220, 220)
      doc.line(margineSx, y - 4, margineDx, y - 4)
    }
  })

  doc.save(stato.progettoTitolo.replace(/\s+/g, "_") + ".pdf")
})


// =============================================
// EXPORT WORD (.docx)
// =============================================
document.getElementById("btn-export-word").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx

  const sezioni = []

  // Titolo principale
  sezioni.push(new Paragraph({
    text: stato.progettoTitolo,
    heading: HeadingLevel.TITLE,
    spacing: { after: 400 }
  }))

  capitoli.forEach((cap, index) => {
    // Titolo capitolo
    sezioni.push(new Paragraph({
      text: (index + 1) + ". " + cap.titolo,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    }))

    // Testo capitolo — divide per righe
    const testoPulito = (cap.contenuto || "")
      .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "[$1]")

    const righe = testoPulito.split("\n").filter(r => r.trim() !== "")

    righe.forEach(riga => {
      sezioni.push(new Paragraph({
        children: [new TextRun({ text: riga, size: 24 })],
        spacing: { after: 160 }
      }))
    })

    // Paragrafo vuoto tra capitoli
    sezioni.push(new Paragraph({ text: "" }))
  })

  const documento = new Document({
    sections: [{ children: sezioni }]
  })

  const buffer = await Packer.toBlob(documento)
  const url = URL.createObjectURL(buffer)
  const a = document.createElement("a")
  a.href = url
  a.download = stato.progettoTitolo.replace(/\s+/g, "_") + ".docx"
  a.click()
  URL.revokeObjectURL(url)
})


// =============================================
// EXPORT EPUB
// =============================================
document.getElementById("btn-export-epub").addEventListener("click", async function() {
  const capitoli = await caricaCapitoliPerExport()
  if (capitoli.length === 0) { alert("Nessun capitolo da esportare!"); return }

  const zip = new JSZip()
  const nomeProgetto = stato.progettoTitolo
  const id = "book-" + Date.now()

  // Struttura EPUB obbligatoria
  zip.file("mimetype", "application/epub+zip")

  // META-INF/container.xml
  zip.folder("META-INF").file("container.xml", `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

  const oebps = zip.folder("OEBPS")

  // Genera file HTML per ogni capitolo
  const itemsManifest = []
  const itemsSpine = []

  capitoli.forEach((cap, i) => {
    const nomeFile = "capitolo_" + i + ".xhtml"
    const testoPulito = (cap.contenuto || "")
      .replace(/\[([^\]]+)\]\(cap:[^)]+\)/g, "<em>[$1]</em>")
      .replace(/\n/g, "<br/>")

    oebps.file(nomeFile, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${cap.titolo}</title>
  <style>
    body { font-family: Georgia, serif; font-size: 1em; line-height: 1.8;
           margin: 2em; color: #222; }
    h1 { font-size: 1.5em; color: #1a1a2e; margin-bottom: 1em; }
    p { margin-bottom: 0.8em; }
  </style>
</head>
<body>
  <h1>${cap.titolo}</h1>
  <p>${testoPulito}</p>
</body>
</html>`)

    itemsManifest.push(`<item id="cap${i}" href="${nomeFile}" media-type="application/xhtml+xml"/>`)
    itemsSpine.push(`<itemref idref="cap${i}"/>`)
  })

  // content.opf — indice del libro
  oebps.file("content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${nomeProgetto}</dc:title>
    <dc:language>it</dc:language>
    <dc:identifier id="uid">${id}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    ${itemsManifest.join("\n    ")}
  </manifest>
  <spine toc="ncx">
    ${itemsSpine.join("\n    ")}
  </spine>
</package>`)

  // toc.ncx — tabella dei contenuti
  const navPoints = capitoli.map((cap, i) => `
    <navPoint id="nav${i}" playOrder="${i + 1}">
      <navLabel><text>${cap.titolo}</text></navLabel>
      <content src="capitolo_${i}.xhtml"/>
    </navPoint>`).join("")

  oebps.file("toc.ncx", `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${id}"/>
  </head>
  <docTitle><text>${nomeProgetto}</text></docTitle>
  <navMap>${navPoints}
  </navMap>
</ncx>`)

  // Genera e scarica il file .epub
  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/epub+zip"
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nomeProgetto.replace(/\s+/g, "_") + ".epub"
  a.click()
  URL.revokeObjectURL(url)
})

// Avvia tutto
init()