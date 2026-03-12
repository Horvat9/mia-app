// i18n.js — Internazionalizzazione web app GameBook Studio
// 8 lingue: IT, EN, FR, ES, PT, DE, JA, ZH

const LANGS = {
  it: "Italiano",
  en: "English",
  fr: "Français",
  es: "Español",
  pt: "Português",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文"
}

const TRANSLATIONS = {
  // ── Navigazione ─────────────────────────────────────────────────────────────
  "Esci": {
    it:"Esci", en:"Logout", fr:"Déconnexion", es:"Salir",
    pt:"Sair", de:"Abmelden", ja:"ログアウト", zh:"退出登录"
  },
  "← Progetti": {
    it:"← Progetti", en:"← Projects", fr:"← Projets", es:"← Proyectos",
    pt:"← Projetos", de:"← Projekte", ja:"← プロジェクト", zh:"← 项目"
  },
  "Caricamento...": {
    it:"Caricamento...", en:"Loading...", fr:"Chargement...", es:"Cargando...",
    pt:"Carregando...", de:"Laden...", ja:"読み込み中…", zh:"加载中…"
  },

  // ── Login / Registrazione ────────────────────────────────────────────────────
  "Accedi": {
    it:"Accedi", en:"Sign In", fr:"Connexion", es:"Iniciar sesión",
    pt:"Entrar", de:"Anmelden", ja:"ログイン", zh:"登录"
  },
  "Accesso in corso...": {
    it:"Accesso in corso...", en:"Signing in...", fr:"Connexion...", es:"Iniciando...",
    pt:"Entrando...", de:"Anmelden...", ja:"ログイン中...", zh:"登录中..."
  },
  "Registrati": {
    it:"Registrati", en:"Register", fr:"S'inscrire", es:"Registrarse",
    pt:"Registrar", de:"Registrieren", ja:"登録", zh:"注册"
  },
  "Registrazione in corso...": {
    it:"Registrazione in corso...", en:"Registering...", fr:"Inscription...", es:"Registrando...",
    pt:"Registrando...", de:"Registrieren...", ja:"登録中...", zh:"注册中..."
  },
  "Email": {
    it:"Email", en:"Email", fr:"E-mail", es:"Correo",
    pt:"E-mail", de:"E-Mail", ja:"メール", zh:"邮箱"
  },
  "Password": {
    it:"Password", en:"Password", fr:"Mot de passe", es:"Contraseña",
    pt:"Senha", de:"Passwort", ja:"パスワード", zh:"密码"
  },
  "Non hai un account?": {
    it:"Non hai un account?", en:"No account yet?", fr:"Pas de compte?", es:"¿Sin cuenta?",
    pt:"Sem conta?", de:"Kein Konto?", ja:"アカウントがない?", zh:"没有账户?"
  },
  "Hai già un account?": {
    it:"Hai già un account?", en:"Already have an account?", fr:"Déjà un compte?", es:"¿Ya tienes cuenta?",
    pt:"Já tem conta?", de:"Schon ein Konto?", ja:"既にアカウントあり?", zh:"已有账户?"
  },
  "Compila tutti i campi!": {
    it:"Compila tutti i campi!", en:"Fill in all fields!", fr:"Remplissez tous les champs!",
    es:"¡Rellena todos los campos!", pt:"Preencha todos os campos!",
    de:"Alle Felder ausfüllen!", ja:"全フィールドを入力してください!", zh:"请填写所有字段!"
  },
  "Email o password errati ❌": {
    it:"Email o password errati ❌", en:"Wrong email or password ❌", fr:"Email ou mot de passe incorrect ❌",
    es:"Email o contraseña incorrectos ❌", pt:"Email ou senha incorretos ❌",
    de:"Email oder Passwort falsch ❌", ja:"メールまたはパスワードが違います ❌", zh:"邮箱或密码错误 ❌"
  },
  "Accesso effettuato! ✅": {
    it:"Accesso effettuato! ✅", en:"Signed in! ✅", fr:"Connecté! ✅", es:"¡Acceso realizado! ✅",
    pt:"Acesso realizado! ✅", de:"Angemeldet! ✅", ja:"ログインしました! ✅", zh:"登录成功! ✅"
  },

  // ── Home / Progetti ─────────────────────────────────────────────────────────
  "I tuoi Librogame": {
    it:"I tuoi Librogame", en:"Your Gamebooks", fr:"Vos Livres-jeux", es:"Tus Librojuegos",
    pt:"Seus Livros-Jogo", de:"Deine Spielbücher", ja:"あなたのゲームブック", zh:"您的游戏书"
  },
  "+ Nuovo Progetto": {
    it:"+ Nuovo Progetto", en:"+ New Project", fr:"+ Nouveau projet", es:"+ Nuevo proyecto",
    pt:"+ Novo projeto", de:"+ Neues Projekt", ja:"+ 新規プロジェクト", zh:"+ 新建项目"
  },
  "Titolo": {
    it:"Titolo", en:"Title", fr:"Titre", es:"Título",
    pt:"Título", de:"Titel", ja:"タイトル", zh:"标题"
  },
  "Descrizione (opzionale)": {
    it:"Descrizione (opzionale)", en:"Description (optional)", fr:"Description (facultative)",
    es:"Descripción (opcional)", pt:"Descrição (opcional)", de:"Beschreibung (optional)",
    ja:"説明（任意）", zh:"描述（可选）"
  },
  "Crea": {
    it:"Crea", en:"Create", fr:"Créer", es:"Crear",
    pt:"Criar", de:"Erstellen", ja:"作成", zh:"创建"
  },
  "Nessun progetto ancora. Creane uno! 🚀": {
    it:"Nessun progetto ancora. Creane uno! 🚀",
    en:"No projects yet. Create one! 🚀",
    fr:"Aucun projet. Créez-en un! 🚀",
    es:"Ningún proyecto aún. ¡Crea uno! 🚀",
    pt:"Nenhum projeto ainda. Crie um! 🚀",
    de:"Noch keine Projekte. Erstelle eines! 🚀",
    ja:"プロジェクトがまだありません。作成してください! 🚀",
    zh:"还没有项目。创建一个吧! 🚀"
  },
  "Inserisci almeno il titolo!": {
    it:"Inserisci almeno il titolo!", en:"Enter at least a title!", fr:"Entrez au moins un titre!",
    es:"¡Introduce al menos un título!", pt:"Digite pelo menos um título!",
    de:"Gib mindestens einen Titel ein!", ja:"タイトルを入力してください!", zh:"请至少输入标题!"
  },
  "Progetto creato! ✅": {
    it:"Progetto creato! ✅", en:"Project created! ✅", fr:"Projet créé! ✅", es:"¡Proyecto creado! ✅",
    pt:"Projeto criado! ✅", de:"Projekt erstellt! ✅", ja:"プロジェクトが作成されました! ✅", zh:"项目已创建! ✅"
  },
  "Errore nella creazione ❌": {
    it:"Errore nella creazione ❌", en:"Creation error ❌", fr:"Erreur de création ❌",
    es:"Error al crear ❌", pt:"Erro ao criar ❌", de:"Erstellungsfehler ❌",
    ja:"作成エラー ❌", zh:"创建错误 ❌"
  },
  "Sei sicuro? Eliminerai anche tutti i capitoli!": {
    it:"Sei sicuro? Eliminerai anche tutti i capitoli!",
    en:"Are you sure? This will also delete all chapters!",
    fr:"Êtes-vous sûr? Cela supprimera aussi tous les chapitres!",
    es:"¿Estás seguro? ¡También se eliminarán todos los capítulos!",
    pt:"Tem certeza? Isso também excluirá todos os capítulos!",
    de:"Bist du sicher? Alle Kapitel werden ebenfalls gelöscht!",
    ja:"本当に削除しますか？全チャプターも削除されます！",
    zh:"确定删除？这将同时删除所有章节！"
  },
  "Apri →": {
    it:"Apri →", en:"Open →", fr:"Ouvrir →", es:"Abrir →",
    pt:"Abrir →", de:"Öffnen →", ja:"開く →", zh:"打开 →"
  },
  "capitolo": {
    it:"capitolo", en:"chapter", fr:"chapitre", es:"capítulo",
    pt:"capítulo", de:"Kapitel", ja:"チャプター", zh:"章节"
  },
  "capitoli": {
    it:"capitoli", en:"chapters", fr:"chapitres", es:"capítulos",
    pt:"capítulos", de:"Kapitel", ja:"チャプター", zh:"章节"
  },
  "paragrafo": {
    it:"paragrafo", en:"paragraph", fr:"paragraphe", es:"párrafo",
    pt:"parágrafo", de:"Absatz", ja:"段落", zh:"段落"
  },
  "paragrafi": {
    it:"paragrafi", en:"paragraphs", fr:"paragraphes", es:"párrafos",
    pt:"parágrafos", de:"Absätze", ja:"段落", zh:"段落"
  },
  "Progetti Web": {
    it:"📝 Progetti Web", en:"📝 Web Projects", fr:"📝 Projets Web", es:"📝 Proyectos Web",
    pt:"📝 Projetos Web", de:"📝 Web-Projekte", ja:"📝 ウェブプロジェクト", zh:"📝 网页项目"
  },
  "Progetti GameBook Studio": {
    it:"🖥️ Progetti GameBook Studio", en:"🖥️ GameBook Studio Projects",
    fr:"🖥️ Projets GameBook Studio", es:"🖥️ Proyectos GameBook Studio",
    pt:"🖥️ Projetos GameBook Studio", de:"🖥️ GameBook Studio Projekte",
    ja:"🖥️ GameBook Studioプロジェクト", zh:"🖥️ GameBook Studio项目"
  },

  // ── Editor ──────────────────────────────────────────────────────────────────
  "Nuovo capitolo": {
    it:"Nuovo capitolo", en:"New chapter", fr:"Nouveau chapitre", es:"Nuevo capítulo",
    pt:"Novo capítulo", de:"Neues Kapitel", ja:"新しいチャプター", zh:"新章节"
  },
  "Titolo capitolo": {
    it:"Titolo capitolo", en:"Chapter title", fr:"Titre du chapitre", es:"Título del capítulo",
    pt:"Título do capítulo", de:"Kapitelname", ja:"チャプタータイトル", zh:"章节标题"
  },
  "Contenuto": {
    it:"Contenuto", en:"Content", fr:"Contenu", es:"Contenido",
    pt:"Conteúdo", de:"Inhalt", ja:"内容", zh:"内容"
  },
  "Salva": {
    it:"Salva", en:"Save", fr:"Sauvegarder", es:"Guardar",
    pt:"Salvar", de:"Speichern", ja:"保存", zh:"保存"
  },
  "Salvato ✅": {
    it:"Salvato ✅", en:"Saved ✅", fr:"Sauvegardé ✅", es:"Guardado ✅",
    pt:"Salvo ✅", de:"Gespeichert ✅", ja:"保存しました ✅", zh:"已保存 ✅"
  },
  "Titolo del capitolo:": {
    it:"Titolo del capitolo:", en:"Chapter title:", fr:"Titre du chapitre:",
    es:"Título del capítulo:", pt:"Título do capítulo:", de:"Kapitelname:",
    ja:"チャプタータイトル:", zh:"章节标题:"
  },
  "Nessun capitolo selezionato": {
    it:"Nessun capitolo selezionato", en:"No chapter selected", fr:"Aucun chapitre sélectionné",
    es:"Ningún capítulo seleccionado", pt:"Nenhum capítulo selecionado",
    de:"Kein Kapitel ausgewählt", ja:"チャプターが選択されていません", zh:"未选择章节"
  },

  // ── Collaborazione ──────────────────────────────────────────────────────────
  "Condividi con collaboratore": {
    it:"Condividi con collaboratore", en:"Share with collaborator", fr:"Partager avec un collaborateur",
    es:"Compartir con colaborador", pt:"Compartilhar com colaborador",
    de:"Mit Mitarbeiter teilen", ja:"コラボレーターと共有", zh:"与协作者共享"
  },
  "Inviti ricevuti": {
    it:"Inviti ricevuti", en:"Received invitations", fr:"Invitations reçues", es:"Invitaciones recibidas",
    pt:"Convites recebidos", de:"Erhaltene Einladungen", ja:"受信した招待", zh:"收到的邀请"
  },
  "✅ Accetta": {
    it:"✅ Accetta", en:"✅ Accept", fr:"✅ Accepter", es:"✅ Aceptar",
    pt:"✅ Aceitar", de:"✅ Annehmen", ja:"✅ 承諾", zh:"✅ 接受"
  },
  "❌ Rifiuta": {
    it:"❌ Rifiuta", en:"❌ Decline", fr:"❌ Refuser", es:"❌ Rechazar",
    pt:"❌ Recusar", de:"❌ Ablehnen", ja:"❌ 拒否", zh:"❌ 拒绝"
  },
  "Invito accettato!": {
    it:"Invito accettato! Trovi il progetto nella lista.",
    en:"Invitation accepted! You'll find the project in the list.",
    fr:"Invitation acceptée! Le projet est dans la liste.",
    es:"¡Invitación aceptada! El proyecto está en la lista.",
    pt:"Convite aceito! O projeto está na lista.",
    de:"Einladung angenommen! Das Projekt ist in der Liste.",
    ja:"招待を承諾しました！プロジェクトがリストに表示されます。",
    zh:"邀请已接受！项目在列表中。"
  },

  // ── Viewer desktop ───────────────────────────────────────────────────────────
  "Paragrafo": {
    it:"Paragrafo", en:"Paragraph", fr:"Paragraphe", es:"Párrafo",
    pt:"Parágrafo", de:"Absatz", ja:"段落", zh:"段落"
  },
  "→ vai al paragrafo": {
    it:"→ vai al paragrafo", en:"→ go to paragraph", fr:"→ aller au paragraphe",
    es:"→ ir al párrafo", pt:"→ ir ao parágrafo", de:"→ gehe zu Absatz",
    ja:"→ 段落へ", zh:"→ 前往段落"
  },
  "⬥ Fine": {
    it:"⬥ Fine", en:"⬥ The End", fr:"⬥ Fin", es:"⬥ Fin",
    pt:"⬥ Fim", de:"⬥ Ende", ja:"⬥ 終わり", zh:"⬥ 结局"
  },
  "Questo progetto non ha ancora paragrafi.": {
    it:"Questo progetto non ha ancora paragrafi.",
    en:"This project has no paragraphs yet.",
    fr:"Ce projet n'a pas encore de paragraphes.",
    es:"Este proyecto aún no tiene párrafos.",
    pt:"Este projeto ainda não tem parágrafos.",
    de:"Dieses Projekt hat noch keine Absätze.",
    ja:"このプロジェクトにはまだ段落がありません。",
    zh:"此项目还没有段落。"
  },

  // ── Lingua ──────────────────────────────────────────────────────────────────
  "Lingua": {
    it:"Lingua", en:"Language", fr:"Langue", es:"Idioma",
    pt:"Idioma", de:"Sprache", ja:"言語", zh:"语言"
  },
}

// ── API pubblica ─────────────────────────────────────────────────────────────

const I18n = {
  _lang: localStorage.getItem("gbs_lang") || "it",

  get lang() { return this._lang },

  setLang(code) {
    this._lang = code
    localStorage.setItem("gbs_lang", code)
    document.documentElement.lang = code
    this.applyAll()
  },

  tr(key) {
    const entry = TRANSLATIONS[key]
    if (!entry) return key
    return entry[this._lang] || entry["it"] || key
  },

  // Applica le traduzioni a tutti gli elementi con data-i18n="chiave"
  applyAll() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n")
      const attr = el.getAttribute("data-i18n-attr") // es: "placeholder"
      if (attr) {
        el.setAttribute(attr, this.tr(key))
      } else {
        el.textContent = this.tr(key)
      }
    })
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      el.innerHTML = this.tr(el.getAttribute("data-i18n-html"))
    })
  },

  // Crea il selettore lingua e lo inserisce nell'elemento target
  renderSelector(containerId) {
    const container = document.getElementById(containerId)
    if (!container) return

    const wrapper = document.createElement("div")
    wrapper.className = "lang-selector"

    const label = document.createElement("span")
    label.textContent = "🌐 "
    wrapper.appendChild(label)

    const sel = document.createElement("select")
    sel.id = "lang-select"
    Object.entries(LANGS).forEach(([code, name]) => {
      const opt = document.createElement("option")
      opt.value = code
      opt.textContent = name
      if (code === this._lang) opt.selected = true
      sel.appendChild(opt)
    })
    sel.addEventListener("change", () => this.setLang(sel.value))
    wrapper.appendChild(sel)
    container.appendChild(wrapper)
  },

  init(selectorContainerId) {
    document.documentElement.lang = this._lang
    if (selectorContainerId) this.renderSelector(selectorContainerId)
    this.applyAll()
  }
}

// Espone globalmente
window.I18n = I18n
window.tr = (key) => I18n.tr(key)

// Stringhe aggiuntive editor desktop
TRANSLATIONS["Modifica"] = {
  it:"Modifica", en:"Edit", fr:"Modifier", es:"Editar",
  pt:"Editar", de:"Bearbeiten", ja:"編集", zh:"编辑"
}
TRANSLATIONS["Paragrafi"] = {
  it:"Paragrafi", en:"Paragraphs", fr:"Paragraphes", es:"Párrafos",
  pt:"Parágrafos", de:"Absätze", ja:"段落", zh:"段落"
}
TRANSLATIONS["+ Nuovo paragrafo"] = {
  it:"+ Nuovo paragrafo", en:"+ New paragraph", fr:"+ Nouveau paragraphe",
  es:"+ Nuevo párrafo", pt:"+ Novo parágrafo", de:"+ Neuer Absatz",
  ja:"+ 新しい段落", zh:"+ 新段落"
}
TRANSLATIONS["Numero paragrafo"] = {
  it:"Numero paragrafo", en:"Paragraph number", fr:"Numéro du paragraphe",
  es:"Número de párrafo", pt:"Número do parágrafo", de:"Absatznummer",
  ja:"段落番号", zh:"段落编号"
}
TRANSLATIONS["È un finale"] = {
  it:"È un finale", en:"Is an ending", fr:"Est une fin", es:"Es un final",
  pt:"É um final", de:"Ist ein Ende", ja:"エンディングです", zh:"是结局"
}
TRANSLATIONS["Scelte"] = {
  it:"Scelte", en:"Choices", fr:"Choix", es:"Opciones",
  pt:"Escolhas", de:"Optionen", ja:"選択肢", zh:"选项"
}
TRANSLATIONS["+ Aggiungi scelta"] = {
  it:"+ Aggiungi scelta", en:"+ Add choice", fr:"+ Ajouter un choix",
  es:"+ Añadir opción", pt:"+ Adicionar escolha", de:"+ Option hinzufügen",
  ja:"+ 選択肢を追加", zh:"+ 添加选项"
}
TRANSLATIONS["💾 Salva paragrafo"] = {
  it:"💾 Salva paragrafo", en:"💾 Save paragraph", fr:"💾 Sauvegarder",
  es:"💾 Guardar párrafo", pt:"💾 Salvar parágrafo", de:"💾 Speichern",
  ja:"💾 保存", zh:"💾 保存"
}
