const STORES=[
  {id:'downtown',name:'Luxe Nails Downtown',area:'Main Street',color:'#E88F6E'},
  {id:'westside',name:'Luxe Nails Westside',area:'Oak Avenue',color:'#7C5CBF'},
  {id:'eastgate',name:'Luxe Nails Eastgate',area:'River Plaza',color:'#059669'},
  {id:'northgate',name:'Luxe Nails Northgate',area:'Pine Boulevard',color:'#D97706'},
  {id:'southpark',name:'Luxe Nails Southpark',area:'Harbor Drive',color:'#9D174D'},
  {id:'midtown',name:'Luxe Nails Midtown',area:'Central Avenue',color:'#0369A1'},
  {id:'lakeside',name:'Luxe Nails Lakeside',area:'Lakeview Road',color:'#7C3AED'},
];
const selStores=new Set(STORES.map(s=>s.id));

function renderStores(q=''){
  const list=document.getElementById('sl-list');if(!list)return;
  const flt=STORES.filter(s=>!q||s.name.toLowerCase().includes(q.toLowerCase())||s.area.toLowerCase().includes(q.toLowerCase()));
  const chkSvg='<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  list.innerHTML=flt.length?flt.map(s=>`<div class="sl-row${selStores.has(s.id)?' sel':''}" onclick="toggleStoreById('${s.id}',this)"><div class="sl-init" style="background:${s.color}">${s.name.split(' ').pop()[0]}</div><div class="sl-info"><div class="sl-nm">${s.name}</div><div class="sl-ar">${s.area}</div></div><div class="sl-chk${selStores.has(s.id)?' on':''}">${selStores.has(s.id)?chkSvg:''}</div></div>`).join(''):'<div class="sl-empty">No stores found</div>';
  updateStoreUI();
}
function toggleStoreById(id,row){
  const chkSvg='<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const c=row.querySelector('.sl-chk');
  if(selStores.has(id)){selStores.delete(id);row.classList.remove('sel');c.classList.remove('on');c.innerHTML='';}
  else{selStores.add(id);row.classList.add('sel');c.classList.add('on');c.innerHTML=chkSvg;}
  updateStoreUI();
}
function filterStores(q){renderStores(q);}
function toggleAllStores(){
  const inp=document.getElementById('sl-inp');
  if(selStores.size===STORES.length)selStores.clear();else STORES.forEach(s=>selStores.add(s.id));
  renderStores(inp?inp.value:'');
}
function updateStoreUI(){
  const n=selStores.size,T=STORES.length;
  const badge=document.getElementById('sl-badge'),txt=document.getElementById('sl-sel-txt'),tog=document.getElementById('sl-tog'),btn=document.getElementById('sl-btn');
  if(badge){badge.textContent=n;badge.className='sl-badge'+(n===0?' none':'');}
  if(txt)txt.textContent=n===T?`All ${T} selected`:n===0?'None selected':`${n} of ${T} selected`;
  if(tog)tog.textContent=n===T?'Deselect All':'Select All';
  if(btn){btn.disabled=n===0;btn.textContent=n===0?'Select at least one store':`Continue · ${n} store${n>1?'s':''}`;}
}

const QA=[
  {q:'💬 What tone should the message have?',hint:'You can pick multiple',multi:true,chips:['Warm & Personal','Exciting & Urgent','Professional','Playful'],ph:'Or describe the tone...'},
  {q:'🎁 Include a special offer?',hint:'Pick one',multi:false,chips:['No discount','% Discount','Free Add-on'],ph:'Or describe your offer...'},
  {q:'📣 How should we send this?',hint:'You can pick multiple',multi:true,chips:['SMS','Email','SMS + Email'],ph:'Or type channel preference...'}
];
let qStep=0;const sel=new Set();const answers={};let curMulti=false;

function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const fab=document.getElementById('float-chat-btn');
  if(fab) fab.classList.toggle('hidden', id !== 's1' && id !== 's-home');
  setTimeout(()=>{
    const t=document.getElementById(id);
    if(t){t.classList.add('active');const sc=t.querySelector('.cs');if(sc)setTimeout(()=>sc.scrollTop=sc.scrollHeight,60);if(id==='s2')renderStores();}
  },150);
}
function startFlow(msg){goTo('s3');}
function toggleStore(el){const chk=el.querySelector('.chk'),on=chk.classList.contains('on');if(on){chk.classList.remove('on');chk.innerHTML='';el.classList.remove('sel');}else{chk.classList.add('on');chk.innerHTML='<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';el.classList.add('sel');}document.querySelector('#s2 .sc-ta').textContent=[...document.querySelectorAll('#s2 .so')].every(o=>o.classList.contains('sel'))?'Deselect All':'Select All';}
function toggleAll(btn){const opts=[...document.querySelectorAll('#s2 .so')],allOn=opts.every(o=>o.classList.contains('sel'));opts.forEach(o=>{const chk=o.querySelector('.chk');if(allOn){o.classList.remove('sel');chk.classList.remove('on');chk.innerHTML='';}else{o.classList.add('sel');chk.classList.add('on');chk.innerHTML='<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';}});btn.textContent=allOn?'Select All':'Deselect All';}
function toggleChip(el,val){if(!curMulti){document.querySelectorAll('#crow .chip').forEach(c=>{c.classList.remove('on');sel.delete(c.dataset.val);});}if(el.classList.contains('on')){el.classList.remove('on');sel.delete(val);}else{el.classList.add('on');sel.add(val);}el.dataset.val=val;const has=sel.size>0;document.getElementById('chint').textContent=has?`${sel.size} selected`:'';document.getElementById('cclr').className='chips-clear'+(has?' show':'');document.getElementById('cstrip').className='confirm-strip'+(has&&curMulti?' open':'');if(!curMulti&&sel.size===1)setTimeout(()=>confirmChips(),180);}
function clearChips(){sel.clear();document.querySelectorAll('#crow .chip').forEach(c=>c.classList.remove('on'));document.getElementById('chint').textContent='';document.getElementById('cclr').className='chips-clear';document.getElementById('cstrip').className='confirm-strip';}
function confirmChips(){if(!sel.size)return;const val=[...sel].join(' + ');clearChips();sendAnswer(val);}
function sendTyped(){const inp=document.getElementById('s3inp'),val=inp.value.trim();if(!val)return;inp.value='';clearChips();sendAnswer(val);}

function sendAnswer(val){
  answers['q'+qStep]=val;
  const chat=document.getElementById('s3chat'),crow=document.getElementById('crow'),inp=document.getElementById('s3inp');
  crow.innerHTML='';
  const ub=document.createElement('div');ub.className='br u';ub.innerHTML=`<div class="b usr">${val}</div>`;chat.appendChild(ub);chat.scrollTop=chat.scrollHeight;
  if(qStep<QA.length){
    const tr=document.createElement('div');tr.className='br';tr.innerHTML=`<div class="bav"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 5.5L13 6.5L8 7.5L6.5 12L5 7.5L0 6.5L5 5.5Z" fill="white"/></svg></div><div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;chat.appendChild(tr);chat.scrollTop=chat.scrollHeight;
    const q=QA[qStep];qStep++;
    setTimeout(()=>{chat.removeChild(tr);const ab=document.createElement('div');ab.className='br';ab.innerHTML=`<div class="bav"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 5.5L13 6.5L8 7.5L6.5 12L5 7.5L0 6.5L5 5.5Z" fill="white"/></svg></div><div class="b ai">${q.q}<span class="b-hint">${q.hint}</span></div>`;chat.appendChild(ab);curMulti=q.multi;q.chips.forEach(c=>{const ch=document.createElement('div');ch.className='chip';ch.dataset.val=c;ch.innerHTML=`<svg class="chk-ico" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${c}`;ch.onclick=()=>toggleChip(ch,c);crow.appendChild(ch);});inp.placeholder=q.ph;chat.scrollTop=chat.scrollHeight;},900);
  } else {
    const tr=document.createElement('div');tr.className='br';tr.innerHTML=`<div class="bav"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 5.5L13 6.5L8 7.5L6.5 12L5 7.5L0 6.5L5 5.5Z" fill="white"/></svg></div><div class="typing"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;chat.appendChild(tr);chat.scrollTop=chat.scrollHeight;
    setTimeout(()=>{
      chat.removeChild(tr);
      const ab=document.createElement('div');ab.className='br';ab.innerHTML=`<div class="bav"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1L8 5.5L13 6.5L8 7.5L6.5 12L5 7.5L0 6.5L5 5.5Z" fill="white"/></svg></div><div class="b ai">Perfect! Here's your campaign. Ready to review? 🎉</div>`;chat.appendChild(ab);
      const dw=document.createElement('div');
      dw.innerHTML=`<div class="dk"><div class="dh"><div class="dtag"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L1 9.5L4.5 8.5L6 10.5L6 7L9.5 4.5L7.5 2.5L4.5 6L1 4L2 6Z" fill="#7C5CBF"/></svg>CAMPAIGN DRAFT</div><div class="dtitle">Mother's Day Special 🌸</div></div><div class="db"><div class="dgrid"><div><div class="dfl">TARGET</div><div class="dfv">${answers['q0']||'All Clients'}</div></div><div><div class="dfl">AUDIENCE</div><div class="dfv">~420 clients</div></div><div><div class="dfl">TONE</div><div class="dfv">${answers['q1']||'Warm & Personal'}</div></div><div><div class="dfl">CHANNEL</div><div class="dfv">${answers['q2']||'SMS'}</div></div></div><div style="height:0.5px;background:#F0EFFB;margin:10px 0"></div><div style="font-size:10px;font-weight:600;color:#B0A8D0;letter-spacing:.06em;margin-bottom:8px">MESSAGE PREVIEW</div><div class="dmsg">"Hi [Name], Mother's Day is almost here 🌸 Treat yourself or gift someone special a relaxing nail session. We'd love to celebrate with you!"</div></div></div><div class="acts"><button class="btn-approve" onclick="openReview()"><div class="shine"></div><svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 7.5l4 4 6.5-6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Review Campaign</button><div class="btn-row2"><button class="btn-ai" onclick="goTo('s3b')"><svg class="spin" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5Z" fill="#C4B5FD"/></svg>Revise with AI</button><button class="btn-edit" onclick="goTo('s5m')"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 2.5l2 2-6.5 6.5H2v-2l6.5-6.5z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Edit Manually</button></div><button class="btn-save" onclick="saveDraft()"><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M4.5 5h4M4.5 7.5h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>Save Draft</button></div>`;
      chat.appendChild(dw);inp.placeholder='Ask to refine this campaign...';document.getElementById('chint').textContent='';chat.scrollTop=chat.scrollHeight;
    },1800);
  }
}

function openReview(){
  const t=document.getElementById('rv-target');
  if(t) t.textContent=answers['q0']||'All Clients';
  goTo('s3');
}

function switchTab(el,type){
  document.querySelectorAll('.mctab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');
  document.getElementById('sms-msg').style.display=type==='sms'?'block':'none';
  document.getElementById('email-msg').style.display=type==='email'?'block':'none';
}

renderStores();

function resetAll(){
  goTo('s1');
}

function showBackConfirm() {
  document.getElementById('back-modal-backdrop').classList.add('open');
  document.getElementById('back-modal').classList.add('open');
}
function closeBackModal() {
  document.getElementById('back-modal-backdrop').classList.remove('open');
  document.getElementById('back-modal').classList.remove('open');
}
function confirmDiscard() {
  closeBackModal();
  goTo('s1');
}

function toggleDetails(){
  const body=document.getElementById('det-body');
  const chevron=document.getElementById('det-chevron');
  const hd=document.querySelector('.det-hd');
  body.classList.toggle('open');
  chevron.classList.toggle('open');
  hd.classList.toggle('open');
}

function pickOne(el, groupId) {
  document.querySelectorAll('#'+groupId+' .me-chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  // Show discount input if applicable
  if(groupId==='me-offer-chips'){
    const isDiscount = el.textContent.includes('Discount') || el.textContent.includes('Add-on');
    document.getElementById('me-offer-input-wrap').style.display = isDiscount ? 'block' : 'none';
  }
}
function pickMulti(el) {
  el.classList.toggle('on');
}
function saveManual() {
  // Read values and update Review screen
  const name = document.getElementById('me-name').value || 'Mother\'s Day Special';
  const obj = document.getElementById('me-obj').value;
  const msg = document.getElementById('me-msg').value;
  const tone = [...document.querySelectorAll('#me-tone-chips .me-chip.on')].map(c=>c.textContent).join(' + ') || 'Warm & Personal';
  const audience = document.querySelector('#me-audience-chips .me-chip.on')?.textContent || 'All Clients';

  // Update Review
  document.querySelector('.camp-name').textContent = name;
  document.getElementById('rv-target').textContent = audience;
  document.getElementById('rv-tone').textContent = tone;
  document.querySelector('#sms-msg .msg-txt').innerHTML = msg.replace('[Name]','<span class="msg-hl">[Name]</span>');
  document.querySelector('.obj-val').textContent = obj.split('\n')[0];

  goTo('s3');
}

function saveDraft() {
  const campName = document.querySelector('.camp-name')?.textContent || "Mother's Day Special 🌸";
  const channel = document.getElementById('rv-channel')?.textContent || 'SMS';
  const audience = document.getElementById('rv-target')?.textContent || 'All Clients';

  const chevron = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 2.5l4 4-4 4" stroke="#C4B5FD" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const row = document.createElement('div');
  row.className = 'rrow';
  row.setAttribute('onclick', "goTo('s3')");
  row.innerHTML = `<div class="rdot" style="background:#F59E0B"></div><div style="flex:1"><div class="rnm">${campName}</div><div class="rsub">${channel} · ${audience} · Draft</div></div>${chevron}`;

  const list = document.getElementById('draft-list');
  list.insertBefore(row, list.firstChild);

  const toast = document.getElementById('draft-toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);

  setTimeout(() => goTo('s1'), 400);
}

const SMS_VARIANTS = [
  {txt:`Hi <span class="msg-hl">[Name]</span>, Mother's Day is almost here! Enjoy 15% OFF your next visit. Treat yourself or gift someone special a relaxing nail session. Book this weekend!`, cta:'Book a visit →'},
  {txt:`Hey <span class="msg-hl">[Name]</span>! Mother's Day treat: 15% OFF for you this week only. Come in for a fresh set and leave feeling amazing. Limited slots!`, cta:'Book your spot →'},
  {txt:`<span class="msg-hl">[Name]</span>, you deserve to be pampered. This Mother's Day, enjoy 15% OFF. Let us take care of you. Book your visit before slots fill up!`, cta:'Reserve now →'},
];
const EMAIL_VARIANTS = [
  {subj:`We're thinking of you, <span class="msg-hl">[Name]</span> 🌸`, body:`Mother's Day is almost here — and we'd love to help you celebrate. Whether it's a treat for yourself or a gift for someone special, we're here to make it a beautiful moment. Book anytime this weekend!`},
  {subj:`A little pampering goes a long way, <span class="msg-hl">[Name]</span> 💅`, body:`Mother's Day is the perfect time to pause, breathe, and treat yourself. Our team is ready to give you a fresh look you'll love. Slots are filling up — grab yours before they're gone.`},
  {subj:`You deserve this, <span class="msg-hl">[Name]</span> 🌷`, body:`This Mother's Day, gift yourself something beautiful. A fresh set, a relaxing session, and a moment just for you. We'd love to see you — book your appointment today.`},
];
let _regenIdx = 0;
function regenMsg() {
  _regenIdx = (_regenIdx + 1) % SMS_VARIANTS.length;
  const btn = document.getElementById('btn-regen');
  btn.classList.add('spinning');
  setTimeout(() => btn.classList.remove('spinning'), 500);
  const sms = SMS_VARIANTS[_regenIdx];
  const smsTxt = document.querySelector('#sms-msg .msg-txt');
  if(smsTxt) smsTxt.innerHTML = sms.txt;
}

function showTip(el, msg) {
  let tip = document.getElementById('stat-tip');
  if (tip && tip._anchor === el && tip.style.opacity === '1') {
    tip.style.opacity = '0';
    tip._anchor = null;
    return;
  }
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'stat-tip';
    tip.className = 'stat-tip';
    document.querySelector('.phone').appendChild(tip);
  }
  tip.textContent = msg;
  tip._anchor = el;
  const er = el.getBoundingClientRect();
  const pr = document.querySelector('.phone').getBoundingClientRect();
  tip.style.left = Math.min(Math.max(8, er.left - pr.left - 8), 180) + 'px';
  tip.style.top = (er.bottom - pr.top + 5) + 'px';
  tip.style.opacity = '1';
  setTimeout(() => {
    document.addEventListener('click', function closeTip(e) {
      if (!e.target.classList.contains('tip-ico')) {
        const t = document.getElementById('stat-tip');
        if (t) { t.style.opacity = '0'; t._anchor = null; }
      }
      document.removeEventListener('click', closeTip);
    });
  }, 0);
}

function aiToggleSend(inp) {
  document.getElementById('ai-chat-send').classList.toggle('vis', inp.value.trim().length > 0);
}

let _sheetHistory = [];
let _homeHistory = [];
let _aiContext = 'campaign'; // 'home' | 'campaign'
let _selectedHomeChips = new Set();

function openAiSheet() {
  const homeActive = document.getElementById('s-home')?.classList.contains('active');
  _aiContext = homeActive ? 'home' : 'campaign';
  const sub = document.querySelector('.ai-sheet-status-txt');
  if (sub) sub.textContent = _aiContext === 'home' ? 'Business assistant' : 'Revising campaign';
  const backdrop = document.getElementById('ai-sheet-backdrop');
  const sheet = document.getElementById('ai-sheet');
  backdrop.classList.add('open');
  sheet.classList.add('open');
  renderSheetChat();
  const chat = document.getElementById('ai-sheet-chat');
  setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
  initSheetSwipe(sheet);
}

function closeAiSheet() {
  document.getElementById('ai-sheet-backdrop').classList.remove('open');
  document.getElementById('ai-sheet').classList.remove('open');
}

const _SUGGESTIONS = [
  {
    label: "🌞 Summer's here — fill your weekend slots fast",
    userMsg: "Summer's here — fill my weekend slots fast",
    aiMsg: "Done! 'Summer Flash Sale' campaign drafted — targeting 380 clients. Est. +28% bookings this weekend.",
    type: 'campaign',
  },
  {
    label: "📊 Campaign 'We Miss You' đang chạy thế nào?",
    userMsg: "Campaign 'We Miss You' đang chạy thế nào?",
    aiMsg: "Đang tốt! Booking rate 23%, thu $4.2K trong 30 ngày. Tiến độ 65% — còn 12 ngày nữa.",
    type: 'question',
    followUps: [
      { label: "💡 Có thể cải thiện thêm không?", userMsg: "Có thể cải thiện thêm không?", aiMsg: "Có! Gửi thêm 1 reminder vào Thứ Sáu 9AM — các salon tương tự tăng 18% booking với cách này." },
      { label: "📅 Điều chỉnh thời gian gửi được không?", userMsg: "Điều chỉnh thời gian gửi được không?", aiMsg: "Được! Chuyển sang Thứ Sáu 9AM thay vì Thứ Ba — khách mở tin buổi sáng cuối tuần cao hơn 2.1×." },
    ],
  },
  {
    label: "💡 AI có gợi ý gì để cải thiện campaign đang chạy?",
    userMsg: "AI có gợi ý gì để cải thiện campaign đang chạy?",
    aiMsg: "2 gợi ý nhanh: 1) Thêm emoji vào SMS — tăng open rate 14%. 2) Gửi 10AM thay 2PM — khách mở tin buổi sáng nhiều hơn 2.3×.",
    type: 'question',
    followUps: [
      { label: "✅ Áp dụng gợi ý này ngay", userMsg: "Áp dụng gợi ý này ngay", aiMsg: "Đã cập nhật! SMS thêm emoji và đổi lịch sang 10AM. Bạn sẽ thấy kết quả sau 48 giờ." },
      { label: "📊 Xem số liệu chi tiết hơn", userMsg: "Xem số liệu chi tiết hơn", aiMsg: "Open rate: 38% (TB ngành 24%). Click rate: 12%. Khách quay lại: 23 người. Revenue $4.2K — vượt mục tiêu 15%." },
    ],
  },
];

const _HOME_SUGGESTIONS = [
  {
    label: "📊 Income tháng này của mình là bao nhiêu?",
    userMsg: "Income tháng này của mình là bao nhiêu?",
    aiMsg: "Tháng này bạn thu <strong>$161.2K</strong> — tăng 12% so với tháng trước. Net income sau chi phí là <strong>$61.2K</strong>.",
  },
  {
    label: "📅 Tuần này có bao nhiêu khách đã booking?",
    userMsg: "Tuần này có bao nhiêu khách đã booking?",
    aiMsg: "Tuần này có <strong>87 khách</strong> booking — cao hơn 23% so với tuần trước. Thứ Sáu và Thứ Bảy chiếm 62% tổng lượng.",
  },
  {
    label: "🗓️ Tuần tới có ngày lễ nào nên chuẩn bị campaign không?",
    userMsg: "Tuần tới có ngày lễ nào nên chuẩn bị campaign không?",
    aiMsg: "Mother's Day là 11/05 — còn 7 ngày. Năm ngoái đây là weekend đông nhất với <strong>89 booking mới</strong>. Nên bắt đầu campaign ngay hôm nay!",
    cta: true,
    ctaLabel: "Tạo Campaign →",
    ctaTarget: "s1",
  },
];

function renderSheetChat() {
  const chat = document.getElementById('ai-sheet-chat');
  const history = _aiContext === 'home' ? _homeHistory : _sheetHistory;
  const wandSvg = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11L5.5 6.5M7.5 1l.4 1.6L9.5 3l-1.6.4L7.5 5l-.4-1.6L5.5 3l1.6-.4L7.5 1z" stroke="#5f2eea" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="3" cy="8.5" r=".6" fill="#5f2eea"/></svg>';
  const ava = `<img class="ai-sheet-ava-sm" src="../assets/icons/icon-cat-bot.png" width="32" height="32" alt=""/>`;

  if (!history.length) {
    if (_aiContext === 'home') {
      chat.innerHTML = `<div class="sheet-suggestions">
        <p class="sheet-sugg-lbl">Hỏi về business của bạn</p>
        ${_HOME_SUGGESTIONS.map((s, i) => `<button class="sheet-sugg-chip" onclick="selectHomeSuggestion(${i})">${s.label}</button>`).join('')}
      </div>`;
    } else {
      chat.innerHTML = `<div class="sheet-suggestions">
        <p class="sheet-sugg-lbl">Quick start a campaign</p>
        ${_SUGGESTIONS.map((s, i) => `<button class="sheet-sugg-chip" onclick="selectSuggestion(${i})">${s.label}</button>`).join('')}
      </div>`;
    }
    return;
  }

  chat.innerHTML = history.map((m, idx) => {
    const isLast = idx === history.length - 1;
    if (m.role === 'user') return `<div class="ai-sheet-bubble-usr">${m.text}</div>`;

    let progressChips = '';
    if (isLast) {
      if (_aiContext === 'home') {
        const remaining = _HOME_SUGGESTIONS.map((s, i) => ({s, i})).filter(({i}) => !_selectedHomeChips.has(i));
        if (remaining.length) {
          progressChips = `<div class="sheet-suggestions" style="margin-top:8px">${remaining.map(({s, i}) => `<button class="sheet-sugg-chip" onclick="selectHomeSuggestion(${i})">${s.label}</button>`).join('')}</div>`;
        }
      } else if (m.followUps && m.followUps.length) {
        progressChips = `<div class="sheet-suggestions" style="margin-top:8px">${m.followUps.map((f, fi) => `<button class="sheet-sugg-chip" onclick="selectCampaignFollowUp(${m.suggIdx},${fi})">${f.label}</button>`).join('')}</div>`;
      }
    }

    return `<div class="ai-sheet-row-ai">
      ${ava}
      <div class="ai-sheet-row-ai-content">
        <div class="ai-sheet-bubble-ai">${m.text}</div>
        ${m.cta ? `<button class="ai-sheet-cta" onclick="closeAiSheet();goTo('${m.ctaTarget||'s3'}')">${m.ctaLabel||'See Campaign →'}</button>` : ''}
        ${m.wc ? `<div class="ai-sheet-wc">
          <div class="ai-sheet-wc-hd">
            <div class="ai-sheet-wc-icon">${wandSvg}</div>
            <span>What changed</span>
          </div>
          <div class="ai-sheet-wc-divider"></div>
          <div class="ai-sheet-wc-list">
            ${m.wc.map(r=>`<div class="ai-sheet-wc-row">
              <div class="ai-sheet-wc-lft"><div class="ai-sheet-wc-dot" style="background:${r.c}"></div><span class="ai-sheet-wc-lbl">${r.l}</span></div>
              <span class="ai-sheet-wc-val">${r.v}</span>
            </div>`).join('')}
          </div>
        </div>` : ''}
        ${progressChips}
      </div>
    </div>`;
  }).join('');

  const sheet = document.getElementById('ai-sheet');
  if (sheet) sheet.classList.toggle('expanded', history.length >= 3);
}

function selectHomeSuggestion(idx) {
  if (_selectedHomeChips.has(idx)) return;
  _selectedHomeChips.add(idx);
  const s = _HOME_SUGGESTIONS[idx];
  _homeHistory.push({ role: 'user', text: s.userMsg });
  renderSheetChat();
  const chat = document.getElementById('ai-sheet-chat');
  const typing = document.createElement('div');
  typing.className = 'ai-sheet-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    typing.remove();
    _homeHistory.push({ role: 'ai', text: s.aiMsg, cta: s.cta || false, ctaLabel: s.ctaLabel, ctaTarget: s.ctaTarget });
    renderSheetChat();
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

function selectSuggestion(idx) {
  const s = _SUGGESTIONS[idx];
  _sheetHistory.push({ role: 'user', text: s.userMsg });
  renderSheetChat();
  const chat = document.getElementById('ai-sheet-chat');
  const typing = document.createElement('div');
  typing.className = 'ai-sheet-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    typing.remove();
    _sheetHistory.push({
      role: 'ai',
      text: s.aiMsg,
      cta: s.type === 'campaign',
      suggIdx: idx,
      followUps: s.type === 'question' ? s.followUps : null,
    });
    renderSheetChat();
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

function selectCampaignFollowUp(suggIdx, fIdx) {
  const f = _SUGGESTIONS[suggIdx].followUps[fIdx];
  _sheetHistory.push({ role: 'user', text: f.userMsg });
  renderSheetChat();
  const chat = document.getElementById('ai-sheet-chat');
  const typing = document.createElement('div');
  typing.className = 'ai-sheet-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    typing.remove();
    _sheetHistory.push({ role: 'ai', text: f.aiMsg });
    renderSheetChat();
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

function sendSheetEdit() {
  const inp = document.getElementById('ai-sheet-inp-field');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';

  if (_aiContext === 'home') {
    _homeHistory.push({ role: 'user', text });
    renderSheetChat();
    const chat = document.getElementById('ai-sheet-chat');
    const typing = document.createElement('div');
    typing.className = 'ai-sheet-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;
    setTimeout(() => {
      typing.remove();
      _homeHistory.push({ role: 'ai', text: 'Mình đang phân tích dữ liệu của bạn. Để xem chi tiết đầy đủ, bạn có thể vào phần <strong>Details</strong> trên màn hình chính.' });
      renderSheetChat();
      chat.scrollTop = chat.scrollHeight;
    }, 1000);
    return;
  }

  _sheetHistory.push({ role: 'user', text });
  renderSheetChat();
  const chat = document.getElementById('ai-sheet-chat');
  const typing = document.createElement('div');
  typing.className = 'ai-sheet-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(typing);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    typing.remove();
    _aiEditIdx = (_aiEditIdx + 1) % _aiEdits.length;
    const u = _aiEdits[_aiEditIdx];
    const desc = document.querySelector('#s3 .camp-desc');
    if (desc) desc.textContent = u.desc;
    const smsTxt = document.querySelector('#sms-msg .msg-txt');
    if (smsTxt) smsTxt.innerHTML = u.sms;
    _sheetHistory.push({ role: 'ai', text: 'Done! Here\'s what I updated:', wc: [
      { c:'#A78BFA', l:'Schedule', v:'Apr 29 – May 6' },
      { c:'#F4A4C0', l:'Offer', v:'15% OFF added' },
    ]});
    renderSheetChat();
    chat.scrollTop = chat.scrollHeight;
  }, 1000);
}

function initSheetSwipe(sheet) {
  let startY = 0;
  sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - startY > 60) closeAiSheet();
  }, { passive: true });
}

const _aiEdits = [
  {desc:"An elevated campaign celebrating your clients with premium, exclusive vibes.", sms:`Hi <span class="msg-hl">[Name]</span>, this Mother's Day indulge in a little luxury. A bespoke nail experience crafted just for you. We'd be honoured to be part of your celebration.`, cta:'Reserve your spot →'},
  {desc:"A warm, direct campaign that creates urgency without feeling pushy.", sms:`Hey <span class="msg-hl">[Name]</span>! Mother's Day slots are filling up fast. Lock in your appointment now. You deserve this moment for yourself.`, cta:'Book now →'},
  {desc:"A heartfelt, personal message that feels genuine and caring.", sms:`<span class="msg-hl">[Name]</span>, you deserve to feel amazing this Mother's Day. Come in for a relaxing session, just for you. We'd love to see you!`, cta:'Book a visit →'},
];
let _aiEditIdx = 0;
let _lastAiMsg = '';

function sendAiEdit() {
  const inp = document.getElementById('ai-chat-inp');
  if (!inp.value.trim()) return;
  _lastAiMsg = inp.value.trim();
  inp.value = '';
  inp.placeholder = 'AI is updating…';
  inp.disabled = true;

  setTimeout(() => {
    _aiEditIdx = (_aiEditIdx + 1) % _aiEdits.length;
    const u = _aiEdits[_aiEditIdx];

    const desc = document.querySelector('#s3 .camp-desc');
    if (desc) desc.textContent = u.desc;

    const smsTxt = document.querySelector('#sms-msg .msg-txt');
    if (smsTxt) smsTxt.innerHTML = u.sms;
    const smsCta = document.querySelector('#sms-msg .msg-cta-pill');
    if (smsCta) smsCta.innerHTML = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M9.5 5.5L1.5 1.5l1.5 4-1.5 4L9.5 5.5z" fill="#5B21B6"/></svg>${u.cta}`;

    const notif = document.getElementById('ai-upd-notif');
    if (notif) notif.classList.add('show');
    const txt = document.getElementById('ai-upd-txt');
    if (txt) txt.innerHTML = `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1L6.8 4.2L10.5 5.5L6.8 6.8L5.5 10L4.2 6.8L0.5 5.5L4.2 4.2Z" fill="#7C5CBF"/></svg>AI updated your Campaign Draft`;
    _sheetHistory.push({ role: 'user', text: _lastAiMsg || 'Update my campaign' });
    _sheetHistory.push({ role: 'ai', text: 'Done! Here\'s what I updated:', wc: [
      { c:'#A78BFA', l:'Schedule', v:'Apr 29 – May 6' },
      { c:'#F4A4C0', l:'Offer', v:'15% OFF added' },
    ]});
    const t = document.getElementById('ai-upd-toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
    inp.placeholder = 'Ask AI to tweak this campaign…';
    inp.disabled = false;
  }, 1100);
}

// Periodic wobble to draw attention to the AI chat button
(function startWobbleLoop() {
  function wobbleTick() {
    const fab = document.getElementById('float-chat-btn');
    if (fab && !fab.classList.contains('hidden')) {
      fab.classList.add('wobbling');
      fab.addEventListener('animationend', () => fab.classList.remove('wobbling'), { once: true });
    }
    setTimeout(wobbleTick, 5000);
  }
  setTimeout(wobbleTick, 3000);
})();

document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('ai-upd-notif');
  if (!trigger) return;
  let _ty = 0;
  trigger.addEventListener('touchstart', e => { _ty = e.touches[0].clientY; }, { passive: true });
  trigger.addEventListener('touchend', e => {
    if (_ty - e.changedTouches[0].clientY > 30) openAiSheet();
  }, { passive: true });
});
