(() => {
  const KEY = 'lesson_themes_v2'
  const subjects = {kazakh_tili:'Қазақ тілі', kazakh_adibeti:'Қазақ әдебиеті'}

  const qs = s => document.querySelector(s)
  const qsa = s => Array.from(document.querySelectorAll(s))

  let state = {subject:'kazakh_tili', theme:null}

  function loadThemes(){
    try{ return JSON.parse(localStorage.getItem(KEY)||'[]') }catch(e){return[]}
  }
  function saveThemes(arr){ localStorage.setItem(KEY, JSON.stringify(arr)) }

  function sampleIfEmpty(){
    // Очистить localStorage
    localStorage.removeItem(KEY)
    const arr = loadThemes()
    const sample = []
    saveThemes(sample)
  }

  function renderThemeButtons(){
    const nav = qs('#themes-nav')
    nav.innerHTML = ''
    const themes = loadThemes().filter(t=>t.subject===state.subject)
    if(!themes.length){
      nav.innerHTML='<p style="color:var(--muted);grid-column:1/-1">Тақырыптарды қосыңыз</p>'
      return
    }
    themes.forEach(t=>{
      const btn = document.createElement('button')
      btn.className='theme-btn' + (state.theme===t.id ? ' active' : '')
      btn.textContent = t.theme
      btn.addEventListener('click', ()=>{
        state.theme = t.id
        qsa('.theme-btn').forEach(x=>x.classList.remove('active'))
        btn.classList.add('active')
        renderMaterials()
      })
      nav.appendChild(btn)
    })
  }

  function renderMaterials(){
    const list = qs('#materials-list')
    list.innerHTML = ''
    
    if(!state.theme){
      list.innerHTML='<p style="color:var(--muted)">Тақырыпты таңдаңыз</p>'
      return
    }

    const themes = loadThemes()
    const selectedTheme = themes.find(t=>t.id===state.theme)
    
    if(!selectedTheme){
      list.innerHTML='<p style="color:var(--muted)">Тақырып табылмады</p>'
      return
    }

    const card = document.createElement('div')
    card.className='theme-card'
    
    const cardHeader = document.createElement('div')
    cardHeader.style.display='flex'
    cardHeader.style.justifyContent='space-between'
    cardHeader.style.alignItems='center'
    cardHeader.style.marginBottom='16px'
    card.appendChild(cardHeader)
    
    const h2 = document.createElement('h2')
    h2.textContent = selectedTheme.theme
    h2.style.margin='0'
    cardHeader.appendChild(h2)
    
    const deleteBtn = document.createElement('button')
    deleteBtn.className='delete-btn'
    deleteBtn.textContent='🗑️ Өшіру'
    deleteBtn.addEventListener('click', ()=>{
      if(confirm('Осы тақырыпты өшіргіңіз келеді ме?')){
        deleteTheme(state.theme)
      }
    })
    cardHeader.appendChild(deleteBtn)
    
    if(selectedTheme.description){
      const p = document.createElement('p')
      p.textContent = selectedTheme.description
      card.appendChild(p)
    }

    const materials = selectedTheme.materials || {}
    const types = [
      {key:'presentation', label:'Презентация', icon:'📊'},
      {key:'video', label:'Видео', icon:'🎥'},
      {key:'comic', label:'Комикс', icon:'🎨'},
      {key:'questions', label:'Сауалнама', icon:'❓'},
      {key:'links', label:'Сілтемелер', icon:'🔗'}
    ]

    types.forEach(typeInfo=>{
      const mat = materials[typeInfo.key]
      if(!mat || (!mat.url && !mat.dataUrl)) return
      
      const group = document.createElement('div')
      group.className='materials-group'
      
      const h4 = document.createElement('h4')
      h4.textContent = typeInfo.icon + ' ' + typeInfo.label
      group.appendChild(h4)
      
      const item = document.createElement('div')
      item.className='material-item ' + typeInfo.key
      
      if(mat.title){
        const h5 = document.createElement('h5')
        h5.textContent = mat.title
        item.appendChild(h5)
      }

      if(typeInfo.key==='presentation'){
        if(mat.url && mat.url.endsWith('.pdf')){
          const emb=document.createElement('embed')
          emb.src=mat.url
          emb.type='application/pdf'
          emb.style.width='100%'
          emb.style.height='300px'
          item.appendChild(emb)
        } else if(mat.dataUrl){
          const a=document.createElement('a')
          a.href=mat.dataUrl
          a.download=mat.title||'presentation'
          a.textContent='📥 Жүктеп алу'
          item.appendChild(a)
        } else if(mat.url){
          const a=document.createElement('a')
          a.href=mat.url
          a.target='_blank'
          a.textContent='🔗 Ашу'
          item.appendChild(a)
        }
      } else if(typeInfo.key==='video'){
        if(mat.url && mat.url.includes('youtube') && mat.url.includes('embed')){
          const iframe = document.createElement('iframe')
          iframe.width='100%'
          iframe.height='200'
          iframe.src=mat.url
          iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          iframe.setAttribute('frameborder',0)
          item.appendChild(iframe)
        } else if(mat.dataUrl){
          const v = document.createElement('video')
          v.controls=true
          v.src = mat.dataUrl
          v.style.width='100%'
          v.style.maxHeight='200px'
          v.style.objectFit='contain'
          item.appendChild(v)
        } else if(mat.url){
          const a=document.createElement('a')
          a.href=mat.url
          a.target='_blank'
          a.textContent='🎬 Видеоны ашу'
          item.appendChild(a)
        }
      } else if(typeInfo.key==='comic'){
        if(mat.dataUrl){
          const img = document.createElement('img')
          img.src=mat.dataUrl
          img.style.maxWidth='100%'
          item.appendChild(img)
        } else if(mat.url){
          const a=document.createElement('a')
          a.href=mat.url
          a.target='_blank'
          a.textContent='🎨 Комиксті ашу'
          item.appendChild(a)
        }
      } else if(typeInfo.key==='questions'){
        if(mat.url){
          const a=document.createElement('a')
          a.href=mat.url
          a.target='_blank'
          a.textContent='❓ Сауалнамаға өту'
          item.appendChild(a)
        }
      } else if(typeInfo.key==='links'){
        if(mat.url){
          const a=document.createElement('a')
          a.href=mat.url
          a.target='_blank'
          a.textContent='🔗 Сілтемеге өту'
          item.appendChild(a)
        }
      }

      group.appendChild(item)
      card.appendChild(group)
    })

    list.appendChild(card)
  }

  function deleteTheme(themeId){
    const arr = loadThemes()
    const filtered = arr.filter(t=>t.id!==themeId)
    saveThemes(filtered)
    state.theme = null
    renderThemeButtons()
    renderMaterials()
  }

  function bind(){
    qsa('.subject-btn').forEach(b=>b.addEventListener('click', e=>{
      qsa('.subject-btn').forEach(x=>x.classList.remove('active'))
      b.classList.add('active')
      state.subject=b.dataset.subject
      state.theme=null
      renderThemeButtons()
      renderMaterials()
    }))

    qs('#open-add').addEventListener('click', ()=> qs('#add-modal').classList.remove('hidden'))
    qs('#cancel-add').addEventListener('click', ()=> qs('#add-modal').classList.add('hidden'))

    qs('#add-form').addEventListener('submit', async e=>{
      e.preventDefault()
      try{
        const f = new FormData(e.target)
        
        const materials = {}
        const types = ['presentation','video','comic','questions','links']
        
        for(const type of types){
          materials[type] = {title:'',url:'',dataUrl:''}
        }

        // Презентация
        const presInput = e.target.querySelector('input[name="presentation_file"]')
        if(presInput && presInput.files && presInput.files[0]){
          const presFile = presInput.files[0]
          materials.presentation.dataUrl = await readFileAsDataURL(presFile)
          materials.presentation.title = 'Презентация'
        }

        // Видео
        const vidUrl = f.get('video_url')
        const vidInput = e.target.querySelector('input[name="video_file"]')
        if(vidUrl){
          materials.video.url = vidUrl.includes('youtube') && vidUrl.includes('watch') ? vidUrl.replace('watch?v=','embed/') : vidUrl
          materials.video.title = 'Видео'
        }
        if(vidInput && vidInput.files && vidInput.files[0]){
          const vidFile = vidInput.files[0]
          materials.video.dataUrl = await readFileAsDataURL(vidFile)
          materials.video.title = 'Видео'
        }

        // Комикс
        const comicInput = e.target.querySelector('input[name="comic_file"]')
        if(comicInput && comicInput.files && comicInput.files[0]){
          const comicFile = comicInput.files[0]
          materials.comic.dataUrl = await readFileAsDataURL(comicFile)
          materials.comic.title = 'Комикс'
        }

        // Сауалнамалар
        const qUrl = f.get('questions_url')
        if(qUrl){
          materials.questions.url = qUrl
          materials.questions.title = 'Сауалнама'
        }

        // Сілтемелер
        const lUrl = f.get('links_url')
        if(lUrl){
          materials.links.url = lUrl
          materials.links.title = 'Сілтемелер'
        }

        const theme = f.get('theme')
        if(!theme){
          alert('Тақырыптың атауы міндетті!')
          return
        }

        const themeItem = {
          id:Date.now(),
          subject:f.get('subject'),
          theme:theme,
          description:f.get('description')||'',
          materials:materials
        }

        const arr = loadThemes()
        arr.unshift(themeItem)
        saveThemes(arr)
        
        qs('#add-modal').classList.add('hidden')
        e.target.reset()
        
        state.theme = themeItem.id
        renderThemeButtons()
        renderMaterials()
        
        // Переключаемся на нужный предмет если необходимо
        if(state.subject !== themeItem.subject){
          state.subject = themeItem.subject
          qsa('.subject-btn').forEach(x=>x.classList.remove('active'))
          qs(`[data-subject="${themeItem.subject}"]`).classList.add('active')
        }
        
        alert('Тақырып сәтті құрылды!')
      }catch(err){
        console.error('Ошибка:', err)
        alert('Қате болды: ' + err.message)
      }
    })
  }

  function readFileAsDataURL(file){
    return new Promise((res,rej)=>{
      const r=new FileReader()
      r.onload=()=>res(r.result)
      r.onerror=rej
      r.readAsDataURL(file)
    })
  }

  // init
  sampleIfEmpty()
  bind()
  renderThemeButtons()
  renderMaterials()

})();
