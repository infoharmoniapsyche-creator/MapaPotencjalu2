// Simple standalone game logic — no build tools required
document.addEventListener('DOMContentLoaded', function(){
  const data = [
    {kraina:'Wartości', title:'Autentyczność', icon:'🌿', narration:'Bycie sobą — fundament jakości życia. Autentyczność pomaga wybierać ścieżki zgodne z wartościami.', tip:'Zastanów się, kiedy czujesz, że jesteś autentyczny.', question:'Co powstrzymuje Cię przed byciem sobą?', career:['Praca w NGO','Coach','Badacz społeczny']},
    {kraina:'Wartości', title:'Rozwój', icon:'🔥', narration:'Dążenie do rozwoju wskazuje motywację do uczenia się i poszerzania kompetencji.', tip:'Wybierz jedną umiejętność na miesiąc.', question:'Jakiego wsparcia potrzebujesz, by się rozwijać?', career:['Specjalista ds. szkoleń','Project manager','Konsultant']},
    {kraina:'Talenty', title:'Komunikacja', icon:'💬', narration:'Komunikacja to talent budujący relacje i wpływ społeczny — cenna w wielu zawodach.', tip:'Ćwicz klarowność w krótkich wypowiedziach.', question:'Kiedy Twoje słowa działają najlepiej?', career:['Trener','PR','Dziennikarz']},
    {kraina:'Talenty', title:'Analiza', icon:'🧩', narration:'Umiejętność dostrzegania wzorców i logicznego myślenia — przydatna w analizie danych i planowaniu.', tip:'Szukaj schematów i zapisuj wnioski.', question:'Jak usprawnić proces podejmowania decyzji?', career:['Analityk danych','Konsultant biznesowy','Finanse']},
    {kraina:'Cienie', title:'Perfekcjonizm', icon:'⚖️', narration:'Perfekcjonizm może blokować działanie. Uwaga: bywa źródłem lęku przed porażką.', tip:'Ustal minimum akceptowalne dla zadania.', question:'Czego boisz się w nieidealnym wyniku?', career:['Role kreatywne z iteracją','Praca z małymi etapami']},
    {kraina:'Cienie', title:'Prokrastynacja', icon:'🕳️', narration:'Odkładanie zadań często kryje lęk, brak jasnej struktury lub przeciążenie.', tip:'Stosuj krótkie bloki pracy (25/5).', question:'Co możesz uprościć, by zacząć?', career:['Role z jasną rutyną','Wsparcie projektowe']},
    {kraina:'Wizja', title:'Tworzyć', icon:'🌅', narration:'Pragnienie tworzenia — gotowość, by inicjować projekty i zostawić ślad.', tip:'Zrób mały prototyp pomysłu.', question:'Co chcesz stworzyć w najbliższym roku?', career:['Projektant','Artysta','Przedsiębiorca']},
    {kraina:'Wizja', title:'Wspierać', icon:'🌳', narration:'Orientacja na wsparcie innych — empatia i stabilność w relacjach.', tip:'Wybierz jedną osobę, której pomożesz regularnie.', question:'Jak możesz skalować swoje wsparcie?', career:['Psycholog','Doradca zawodowy','Mentor']}
  ]

  // Elements
  const startBtn = document.getElementById('startBtn')
  const howBtn = document.getElementById('howBtn')
  const game = document.getElementById('game')
  const symbolsGrid = document.getElementById('symbolsGrid')
  const tabs = document.querySelectorAll('.tab')
  const count = document.getElementById('count')
  const selectedList = document.getElementById('selectedList')
  const reportBtn = document.getElementById('reportBtn')
  const resetBtn = document.getElementById('resetBtn')
  const modal = document.getElementById('modal')
  const reportContent = document.getElementById('reportContent')
  const closeModal = document.getElementById('closeModal')
  const copyBtn = document.getElementById('copyBtn')
  const downloadBtn = document.getElementById('downloadBtn')

  let currentKraina = 'Wartości'
  let selected = []

  function renderSymbols(){
    symbolsGrid.innerHTML = ''
    const filtered = data.filter(d=>d.kraina===currentKraina)
    filtered.forEach((s, idx)=>{
      const el = document.createElement('div')
      el.className = 'symbol'
      el.dataset.idx = idx
      el.innerHTML = `<div class="icon">${s.icon}</div><div class="meta"><h4>${s.title}</h4><p>${s.narration}</p></div>`
      el.addEventListener('click', ()=> toggleSelect(s, el))
      symbolsGrid.appendChild(el)
    })
  }

  function toggleSelect(item, el){
    const key = item.kraina+'__'+item.title
    const exists = selected.find(s=>s.key===key)
    if(exists){
      selected = selected.filter(s=>s.key!==key)
      el.classList.remove('selected')
    } else {
      selected.push({...item, key})
      el.classList.add('selected')
    }
    updateSelectedUI()
  }

  function updateSelectedUI(){
    selectedList.innerHTML = ''
    selected.forEach((s, i)=>{
      const li = document.createElement('li')
      li.innerHTML = `<span>${s.icon} ${s.title} <small class="muted">(${s.kraina})</small></span><button class="btn small" data-key="${s.key}">usuń</button>`
      li.querySelector('button').addEventListener('click', ()=>{
        selected = selected.filter(x=>x.key!==s.key); updateSelectedUI(); clearSelectedGrid(s)
      })
      selectedList.appendChild(li)
    })
    count.textContent = selected.length + ' symboli'
    reportBtn.disabled = selected.length < 1
  }

  function clearSelectedGrid(item){
    const nodes = Array.from(document.querySelectorAll('.symbol'))
    nodes.forEach(n=>{
      if(n.textContent.includes(item.title)){
        n.classList.remove('selected')
      }
    })
  }

  // tabs
  tabs.forEach(t=> t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'))
    t.classList.add('active')
    currentKraina = t.dataset.kraina
    renderSymbols()
  }))

  // start/hide
  startBtn.addEventListener('click', ()=>{
    document.querySelector('.hero').classList.add('hidden')
    game.classList.remove('hidden')
    renderSymbols()
  })

  howBtn.addEventListener('click', ()=>{
    alert('Klikaj symbole, które rezonują z uczestnikiem. Zbierz min. 3 z różnych krain, wygeneruj raport i omów interpretacje.')
  })

  reportBtn.addEventListener('click', ()=>{
    modal.classList.remove('hidden')
    let html = ''
    html += `<p class="muted">Liczba wybranych symboli: <strong>${selected.length}</strong></p>`
    html += `<div class="report-grid">`
    selected.forEach(s=>{
      html += `<div class="card"><div style="font-size:26px">${s.icon}</div><h3>${s.title} <small class="muted">(${s.kraina})</small></h3><p><em>${s.narration}</em></p><p><strong>Wskazówka:</strong> ${s.tip}</p><p><strong>Pytanie do refleksji:</strong> ${s.question}</p><p><strong>Możliwe ścieżki kariery:</strong> ${s.career.join(', ')}</p></div>`
    })
    html += `</div>`
    html += `<h3>Krótka synteza psychologiczna</h3>`
    html += `<p>Twoja mapa wskazuje na następujące dominujące wątki: `
    const themes = selected.map(s=>s.kraina)
    const counts = themes.reduce((acc,t)=> (acc[t]=(acc[t]||0)+1, acc), {})
    Object.keys(counts).forEach(k=> html += `<strong>${k}: ${counts[k]}</strong> `)
    html += `</p>`
    html += `<h4>Rekomendacje praktyczne</h4>`
    html += `<ul>`
    html += `<li>Zastanów się nad połączeniem talentów i wartości w jednym projekcie (np. mentoring + rozwój osobisty).</li>`
    html += `<li>W przypadku cieni — zaplanuj małe eksperymenty (pierwsze kroki, 'good enough').</li>`
    html += `<li>Użyj listy proponowanych ścieżek kariery jako inspiracji do planu rozwoju.</li>`
    html += `</ul>`
    reportContent.innerHTML = html
  })

  closeModal.addEventListener('click', ()=> modal.classList.add('hidden'))

  copyBtn.addEventListener('click', ()=>{
    const text = reportContent.innerText || reportContent.textContent
    navigator.clipboard.writeText(text).then(()=> alert('Raport skopiowany do schowka.'))
  })

  downloadBtn.addEventListener('click', ()=>{
    const text = reportContent.innerText || reportContent.textContent
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mapa_potencjalu_raport.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  })

  resetBtn.addEventListener('click', ()=>{
    if(confirm('Czy na pewno zresetować wybory?')){ selected=[]; updateSelectedUI(); document.querySelectorAll('.symbol').forEach(s=>s.classList.remove('selected')) }
  })

  // initial render
  renderSymbols()
})
