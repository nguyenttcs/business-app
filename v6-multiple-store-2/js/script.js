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
let _campaignDirty = false;

const BNAV_SCREENS = ['s-home','s-booking','s-message','s-report'];
let _qsReturn = 's-home';
function updateBnav(id){
  const w=document.getElementById('bnav-wrap');
  if(!w) return;
  const show=BNAV_SCREENS.indexOf(id)>=0;
  w.classList.toggle('show', show);
  if(show){
    w.querySelectorAll('.bnav-item').forEach(b=>{
      b.classList.toggle('bnav-on', b.dataset.tab===id);
    });
  }
}
function bnavGo(id){ goTo(id); }
function goTo(id){
  if(id==='s-quick-sale'){
    const active=document.querySelector('.screen.active');
    if(active && active.id!=='s-quick-sale') _qsReturn=active.id;
  }
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const fab=document.getElementById('float-chat-btn');
  if(fab) fab.classList.toggle('hidden', id !== 's1' && id !== 's-home');
  updateBnav(id);
  setTimeout(()=>{
    const t=document.getElementById(id);
    if(t){t.classList.add('active');const sc=t.querySelector('.cs');if(sc)setTimeout(()=>sc.scrollTop=sc.scrollHeight,60);if(id==='s2')renderStores();}
  },150);
}
function qsBack(){ goTo(_qsReturn || 's-home'); }
function startFlow(msg){ _campaignDirty = false; goTo('s3'); }
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

function showLaunchConfirm() {
  document.getElementById('launch-modal-backdrop').classList.add('open');
  document.getElementById('launch-modal').classList.add('open');
}
function closeLaunchModal() {
  document.getElementById('launch-modal-backdrop').classList.remove('open');
  document.getElementById('launch-modal').classList.remove('open');
}
function confirmLaunch() {
  closeLaunchModal();
  _campaignDirty = false;
  goTo('s6');
}

function showBackConfirm() {
  if (!_campaignDirty) { goTo('s1'); return; }
  document.getElementById('back-modal-backdrop').classList.add('open');
  document.getElementById('back-modal').classList.add('open');
}
function closeBackModal() {
  document.getElementById('back-modal-backdrop').classList.remove('open');
  document.getElementById('back-modal').classList.remove('open');
}
function confirmDiscard() {
  closeBackModal();
  _campaignDirty = false;
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
  _campaignDirty = true;
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

  _campaignDirty = false;
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
  _campaignDirty = true;
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
    label: "📊 How is the 'We Miss You' campaign performing?",
    userMsg: "How is the 'We Miss You' campaign performing?",
    aiMsg: "Going well! Booking rate 23%, earned $4.2K in 30 days. 65% complete — 12 days to go.",
    type: 'question',
    followUps: [
      { label: "💡 Anything we can improve?", userMsg: "Anything we can improve?", aiMsg: "Yes! Add a reminder on Friday 9AM — similar salons see an 18% lift in bookings with this tweak." },
      { label: "📅 Can we adjust the send time?", userMsg: "Can we adjust the send time?", aiMsg: "Sure! Move to Friday 9AM instead of Tuesday — clients open weekend morning messages 2.1× more." },
    ],
  },
  {
    label: "💡 Any AI tips to improve my running campaign?",
    userMsg: "Any AI tips to improve my running campaign?",
    aiMsg: "2 quick tips: 1) Add emoji to SMS — open rate +14%. 2) Send at 10AM instead of 2PM — clients open morning messages 2.3× more.",
    type: 'question',
    followUps: [
      { label: "✅ Apply these tips now", userMsg: "Apply these tips now", aiMsg: "Done! SMS updated with emoji and rescheduled to 10AM. You'll see results within 48 hours." },
      { label: "📊 Show me detailed stats", userMsg: "Show me detailed stats", aiMsg: "Open rate: 38% (industry avg 24%). Click rate: 12%. Returning clients: 23. Revenue $4.2K — 15% above target." },
    ],
  },
];

const _HOME_SUGGESTIONS = [
  {
    label: "📊 What's my income this month?",
    userMsg: "What's my income this month?",
    aiMsg: "This month you earned <strong>$161.2K</strong> — up 12% vs last month. Net income after expenses is <strong>$61.2K</strong>.",
  },
  {
    label: "📅 How many bookings this week?",
    userMsg: "How many bookings this week?",
    aiMsg: "This week has <strong>87 bookings</strong> — 23% higher than last week. Friday and Saturday account for 62% of the volume.",
  },
  {
    label: "🗓️ Any upcoming holidays to plan a campaign for?",
    userMsg: "Any upcoming holidays to plan a campaign for?",
    aiMsg: "Mother's Day is on May 11 — 7 days away. Last year it was your busiest weekend with <strong>89 new bookings</strong>. You should start a campaign today!",
    cta: true,
    ctaLabel: "Create Campaign →",
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
        <p class="sheet-sugg-lbl">Ask about your business</p>
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

  _campaignDirty = true;
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
  _campaignDirty = true;
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

/* ── FLOAT CHAT BTN: DRAG + QUICK POPUP ── */
function closeChatPopup() {
  const pop = document.getElementById('float-chat-popup');
  const bd = document.getElementById('float-chat-popup-backdrop');
  if (pop) pop.classList.remove('show');
  if (bd) bd.classList.remove('open');
}

function openFullChatFromPopup() {
  closeChatPopup();
  openAiSheet();
}

function _floatChipLabel(s) {
  // Trim label to ~36 chars to keep chips one-line-ish
  const max = 38;
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

function openChatPopup() {
  const fab = document.getElementById('float-chat-btn');
  const pop = document.getElementById('float-chat-popup');
  const bd = document.getElementById('float-chat-popup-backdrop');
  const list = document.getElementById('float-chip-list');
  if (!fab || !pop || !list) return;

  const homeActive = document.getElementById('s-home')?.classList.contains('active');
  const data = homeActive ? _HOME_SUGGESTIONS : _SUGGESTIONS;
  const handler = homeActive ? 'selectHomeSuggestionFromPopup' : 'selectSuggestionFromPopup';

  list.innerHTML = data.slice(0, 3).map((s, i) =>
    `<button class="float-chip" onclick="${handler}(${i})">${_floatChipLabel(s.label)}</button>`
  ).join('');

  // Smart-position popup: pick the side (above/below, left/right) with more room
  // so chips don't get clipped when the FAB is dragged near an edge/corner.
  const phone = fab.closest('.phone');
  const phoneRect = phone.getBoundingClientRect();
  const fabRect = fab.getBoundingClientRect();
  const GAP = 8;

  const spaceAbove = fabRect.top - phoneRect.top;
  const spaceBelow = phoneRect.bottom - fabRect.bottom;
  const placeAbove = spaceAbove >= spaceBelow;

  const fabCenterX = fabRect.left + fabRect.width / 2;
  const phoneCenterX = phoneRect.left + phoneRect.width / 2;
  const alignRight = fabCenterX >= phoneCenterX;

  if (placeAbove) {
    pop.style.top = 'auto';
    pop.style.bottom = (phoneRect.bottom - fabRect.top + GAP) + 'px';
  } else {
    pop.style.bottom = 'auto';
    pop.style.top = (fabRect.bottom - phoneRect.top + GAP) + 'px';
  }
  if (alignRight) {
    pop.style.right = (phoneRect.right - fabRect.right) + 'px';
    pop.style.left = 'auto';
  } else {
    pop.style.left = (fabRect.left - phoneRect.left) + 'px';
    pop.style.right = 'auto';
  }
  pop.style.transformOrigin =
    (placeAbove ? 'bottom ' : 'top ') + (alignRight ? 'right' : 'left');

  pop.classList.toggle('align-left', !alignRight);
  pop.classList.toggle('align-right', alignRight);
  pop.classList.toggle('place-below', !placeAbove);
  pop.classList.toggle('place-above', placeAbove);

  bd.classList.add('open');
  pop.classList.add('show');
}

function selectHomeSuggestionFromPopup(idx) {
  closeChatPopup();
  openAiSheet();
  setTimeout(() => selectHomeSuggestion(idx), 80);
}

function selectSuggestionFromPopup(idx) {
  closeChatPopup();
  openAiSheet();
  setTimeout(() => selectSuggestion(idx), 80);
}

(function initFloatChatDrag() {
  const fab = document.getElementById('float-chat-btn');
  if (!fab) return;
  const phone = fab.closest('.phone');
  if (!phone) return;

  let startX = 0, startY = 0;        // pointer start
  let originLeft = 0, originTop = 0; // fab start
  let dragging = false;
  let moved = false;
  let pointerId = null;
  let wasOpenOnDown = false;

  function getPhoneBounds() {
    return { w: phone.clientWidth, h: phone.clientHeight };
  }

  function ensureLeftTop() {
    // Convert any bottom/right positioning into left/top so we can drag freely.
    const fr = fab.getBoundingClientRect();
    const pr = phone.getBoundingClientRect();
    fab.style.left = (fr.left - pr.left) + 'px';
    fab.style.top = (fr.top - pr.top) + 'px';
    fab.style.right = 'auto';
    fab.style.bottom = 'auto';
  }

  fab.addEventListener('pointerdown', (e) => {
    pointerId = e.pointerId;
    ensureLeftTop();
    originLeft = parseFloat(fab.style.left) || 0;
    originTop = parseFloat(fab.style.top) || 0;
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
    moved = false;
    wasOpenOnDown = !!document.getElementById('float-chat-popup')?.classList.contains('show');
    fab.setPointerCapture(pointerId);
  });

  fab.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!moved && Math.hypot(dx, dy) > 4) {
      moved = true;
      fab.classList.add('dragging');
      // Close popup if it was open while user begins dragging
      closeChatPopup();
    }
    if (!moved) return;
    const { w, h } = getPhoneBounds();
    const size = fab.offsetWidth;
    let nl = originLeft + dx;
    let nt = originTop + dy;
    // Keep inside phone frame, with a small margin
    const margin = 6;
    nl = Math.max(margin, Math.min(w - size - margin, nl));
    nt = Math.max(margin, Math.min(h - size - margin, nt));
    fab.style.left = nl + 'px';
    fab.style.top = nt + 'px';
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    fab.classList.remove('dragging');
    if (pointerId != null) {
      try { fab.releasePointerCapture(pointerId); } catch (_) {}
      pointerId = null;
    }
    if (!moved) {
      // Treat as tap → toggle quick popup (use snapshot to avoid backdrop having already closed it)
      if (wasOpenOnDown) {
        closeChatPopup();
      } else {
        openChatPopup();
      }
    }
  }

  fab.addEventListener('pointerup', endDrag);
  fab.addEventListener('pointercancel', endDrag);
})();

/* ── HOME: MULTI-STORE SWITCHER ── */
const _HOME_STORES = [
  {
    id: 'laflor',
    name: 'La Flor Nails & Spa',
    address: '11011 Richmond Ave, Ste 900, Houston, TX 77042',
    phone: '(205) 205-2052',
    isOpen: true,
    closes: '8PM',
    logoUrl: '../assets/icons/store-laflor.png',
    color: 'linear-gradient(135deg, #7C5CBF, #5f2eea)',
    initial: 'LF',
    role: 'owner',
    trend: { dir: 'up', percent: '0.52%' },
    stats: { sqft: 200, staff: 10, chairs: 8 },
    income: '$161.2K',
    change: '0.52%',
    net: '$61.2K',
    mktLevel: 0.42,
    suggestions: [
      'Fridays are quiet — try a Weekend Nail Set Deal to add +20 clients.',
      "Mother's Day is 7 days away — launch a 15% OFF campaign to fill your weekend.",
      "142 clients haven't visited in 60+ days — send a re-engagement offer today.",
    ],
  },
  {
    id: 'luxe-westside',
    name: 'Luxe Nails Westside',
    address: '450 Oak Avenue, Brooklyn, NY 11201',
    phone: '(347) 555-0181',
    isOpen: true,
    closes: '9PM',
    color: 'linear-gradient(135deg, #F4A074, #E88F6E)',
    initial: 'LW',
    role: 'partner',
    trend: { dir: 'down', percent: '8%' },
    stats: { sqft: 150, staff: 7, chairs: 6 },
    income: '$98.5K',
    change: '1.24%',
    net: '$42.8K',
    mktLevel: 0.68,
    suggestions: [
      'Weekend slots 92% full — raise weekday booking by 18% with a Tuesday promo.',
      'Memorial Day in 14 days — start a Long Weekend Beauty Boost now.',
      '54 VIP clients overdue for a visit — offer a complimentary upgrade.',
    ],
  },
  {
    id: 'bella-midtown',
    name: 'Bella Spa Midtown',
    address: '230 W 42nd St, New York, NY 10036',
    phone: '(212) 555-0299',
    isOpen: false,
    closes: '10PM',
    color: 'linear-gradient(135deg, #34D399, #059669)',
    initial: 'BM',
    role: 'owner',
    trend: { dir: 'up', percent: '12%' },
    stats: { sqft: 320, staff: 14, chairs: 12 },
    income: '$214.7K',
    change: '0.18%',
    net: '$89.3K',
    mktLevel: 0.82,
    suggestions: [
      'Morning slots (9–11 AM) under 40% booked — try an Early Bird discount.',
      'Local office holiday parties start in 3 weeks — pre-book corporate packages.',
      'Repeat clients up 12% MoM — keep momentum with a Loyalty Bonus campaign.',
    ],
  },
];

let _currentStoreId = _HOME_STORES[0].id;

function _getStore(id) { return _HOME_STORES.find(s => s.id === id); }

function _calIcoSvg() {
  return '<svg width="22" height="18" viewBox="0 0 20 18" fill="none"><rect x="1" y="3" width="18" height="14" rx="2.5" fill="#f59e0b"/><rect x="1" y="3" width="18" height="5" rx="2" fill="#f97316"/><rect x="5" y="1" width="2" height="4" rx="1" fill="#78350f"/><rect x="13" y="1" width="2" height="4" rx="1" fill="#78350f"/><path d="M10 10l.9 2.7 2.9.1-2.3 1.7.8 2.8L10 15.6l-2.3 1.7.8-2.8-2.3-1.7 2.9-.1L10 10z" fill="#fff"/></svg>';
}

function applyStore(id) {
  const s = _getStore(id);
  if (!s) return;
  _currentStoreId = id;

  // Legacy hm-store-card elements (removed from Home in v6 — guards keep this safe for other views)
  const nameEl = document.getElementById('hm-store-name');
  const addrEl = document.getElementById('hm-store-addr');
  const icoEl = document.getElementById('hm-store-ico');
  if (nameEl) nameEl.textContent = s.name;
  if (addrEl) addrEl.textContent = s.address;
  if (icoEl) icoEl.style.background = s.color;

  // Persistent store chips (Home nav + coming-soon screen headers)
  document.querySelectorAll('.sc-chip-name-sync').forEach(el => { el.textContent = s.name; });
  document.querySelectorAll('.sc-chip-logo-sync').forEach(el => { el.style.background = s.color; });

  // Income card
  const incVal = document.getElementById('hm-income-val');
  const incChg = document.getElementById('hm-income-change');
  const incNet = document.getElementById('hm-income-net');
  if (incVal) incVal.textContent = s.income;
  if (incChg) incChg.textContent = s.change;
  if (incNet) incNet.textContent = s.net;

  // Suggestions
  const sugWrap = document.getElementById('hm-sugg-scroll');
  if (sugWrap) {
    sugWrap.innerHTML = s.suggestions.map(txt => `
      <div class="hm-sugg-card">
        <div class="hm-sugg-card-body">
          <div class="hm-cal-ico">${_calIcoSvg()}</div>
          <p class="hm-sugg-txt">${txt}</p>
        </div>
        <button class="hm-take-action">Take Action</button>
      </div>
    `).join('');
  }

  // Marketing slider thumb (0–1)
  const thumb = document.getElementById('hm-slider-thumb');
  if (thumb) thumb.style.left = (s.mktLevel * 100) + '%';

  // User Account screen sync
  const uaName = document.getElementById('ua-store-name');
  const uaAddr = document.getElementById('ua-store-addr');
  const uaLogo = document.getElementById('ua-store-logo');
  const uaInit = document.getElementById('ua-store-logo-init');
  if (uaName) uaName.textContent = s.name;
  if (uaAddr) uaAddr.textContent = s.address;
  if (uaInit) uaInit.textContent = s.initial;
  if (uaLogo) {
    if (s.logoUrl) {
      uaLogo.style.background = '';
      uaLogo.style.backgroundImage = `url('${s.logoUrl}')`;
      uaLogo.style.backgroundSize = 'cover';
      uaLogo.style.backgroundPosition = 'center';
      uaLogo.classList.add('has-img');
    } else {
      uaLogo.style.backgroundImage = '';
      uaLogo.style.background = s.color;
      uaLogo.classList.remove('has-img');
    }
  }
}

function uaSwitchTab(btn, tab) {
  document.querySelectorAll('#s-account .ua-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#s-account .ua-tab-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('ua-panel-' + tab);
  if (panel) panel.classList.add('active');
}

/* ── STORE LIST PAGE ── */
function renderStoreListPage(query) {
  const wrap = document.getElementById('sl-cards');
  const empty = document.getElementById('sl-empty');
  if (!wrap) return;
  const q = (query || '').trim().toLowerCase();
  const filtered = !q ? _HOME_STORES : _HOME_STORES.filter(s =>
    s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
  );
  if (empty) empty.classList.toggle('show', filtered.length === 0);

  const ctaChev = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#5F2EEA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const currentCorner = `
    <div class="sl-card-check" aria-label="Current store">
      <svg class="sl-card-check-bg" viewBox="0 0 50 50" preserveAspectRatio="none">
        <path d="M50 0 L0 0 L50 50 Z" fill="#5F2EEA"/>
      </svg>
      <svg class="sl-card-check-tick" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5l3.5 3.5L13 5" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>`;

  wrap.innerHTML = filtered.map(s => {
    const isCurrent = s.id === _currentStoreId;
    const logoStyle = s.logoUrl
      ? `background-image:url('${s.logoUrl}');background-size:cover;background-position:center`
      : `background:${s.color}`;
    const logoCls = s.logoUrl ? 'sl-card-logo has-img' : 'sl-card-logo';
    const onClick = isCurrent ? '' : `switchStoreFromList('${s.id}')`;

    return `
      <div class="sl-card${isCurrent ? ' current' : ''}" ${onClick ? `onclick="${onClick}"` : ''}>
        ${isCurrent ? currentCorner : ''}
        <div class="sl-card-head">
          <div class="${logoCls}" style="${logoStyle}"><span>${s.initial}</span></div>
          <div class="sl-card-info">
            <div class="sl-card-name-block">
              <div class="sl-card-name">${s.name}</div>
              <div class="sl-card-addr-txt">${s.address}</div>
            </div>
            ${isCurrent ? `<button class="sl-card-cta" onclick="event.stopPropagation();openStoreInfo('${s.id}')">Store Info ${ctaChev}</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function switchStoreFromList(id) {
  if (id === _currentStoreId) return;
  applyStore(id);
  const s = _getStore(id);
  const t = document.getElementById('store-toast');
  const tt = document.getElementById('store-toast-text');
  if (t && tt && s) {
    tt.textContent = `Switched to ${s.name}`;
    t.classList.add('show');
    clearTimeout(window._storeToastT);
    window._storeToastT = setTimeout(() => t.classList.remove('show'), 1800);
  }
  // Re-render list to update current state visual
  const inp = document.getElementById('sl-page-search-inp');
  renderStoreListPage(inp ? inp.value : '');
}

function filterStoreListPage(q) {
  const clr = document.getElementById('sl-page-search-clear');
  if (clr) clr.classList.toggle('show', !!q);
  renderStoreListPage(q);
}

function clearStoreListPageSearch() {
  const inp = document.getElementById('sl-page-search-inp');
  const clr = document.getElementById('sl-page-search-clear');
  if (inp) { inp.value = ''; inp.focus(); }
  if (clr) clr.classList.remove('show');
  renderStoreListPage('');
}

function openStoreInfo(id) {
  window._viewingStoreId = id;
  goTo('s-store-info');
  setTimeout(siRender, 30);
}

function siRender() {
  const s = _getStore(window._viewingStoreId);
  if (!s) return;
  const ava = document.getElementById('si-avatar');
  const init = document.getElementById('si-avatar-init');
  if (ava) ava.style.background = s.color || '#5f2eea';
  if (init) init.textContent = s.initial || s.name.slice(0, 2).toUpperCase();
  const nameEl = document.getElementById('si-name');
  if (nameEl) nameEl.textContent = s.name;
  const statusEl = document.getElementById('si-status');
  if (statusEl) {
    statusEl.textContent = s.isOpen ? 'Open' : 'Closed';
    statusEl.classList.toggle('closed', !s.isOpen);
  }
  const hoursTxt = document.getElementById('si-hours-txt');
  if (hoursTxt) hoursTxt.textContent = (s.isOpen ? 'Closes ' : 'Opens ') + (s.closes || '8PM');
  const addrEl = document.getElementById('si-address');
  if (addrEl) addrEl.textContent = s.address || '';
  const phoneEl = document.getElementById('si-phone');
  if (phoneEl) phoneEl.textContent = s.phone || '';

  const stats = s.stats || {};
  const sqftEl = document.getElementById('si-sqft');
  const staffEl = document.getElementById('si-staff');
  const chairsEl = document.getElementById('si-chairs');
  if (sqftEl) sqftEl.value = stats.sqft ?? '';
  if (staffEl) staffEl.value = stats.staff ?? '';
  if (chairsEl) chairsEl.value = stats.chairs ?? '';

  // Reset dirty + tabs
  _siBaseline = JSON.stringify({sqft: stats.sqft, staff: stats.staff, chairs: stats.chairs});
  siCheckDirty();
  const ovTab = document.querySelector('#s-store-info .si-tab[data-tab="overview"]');
  if (ovTab) siSwitchTab(ovTab, 'overview');
}

let _siBaseline = '';
function siCheckDirty() {
  const sqft = document.getElementById('si-sqft')?.value.trim();
  const staff = document.getElementById('si-staff')?.value.trim();
  const chairs = document.getElementById('si-chairs')?.value.trim();
  const cur = JSON.stringify({
    sqft: sqft === '' ? undefined : Number(sqft),
    staff: staff === '' ? undefined : Number(staff),
    chairs: chairs === '' ? undefined : Number(chairs)
  });
  const dirty = cur !== _siBaseline && sqft !== '' && staff !== '' && chairs !== '';
  const btn = document.getElementById('si-save-btn');
  if (btn) btn.disabled = !dirty;
}

function siSwitchTab(btn, tab) {
  document.querySelectorAll('#s-store-info .si-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#s-store-info .si-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('si-panel-' + tab);
  if (panel) panel.classList.add('active');
}

function siSave() {
  const s = _getStore(window._viewingStoreId);
  if (!s) return;
  const sqft = Number(document.getElementById('si-sqft').value);
  const staff = Number(document.getElementById('si-staff').value);
  const chairs = Number(document.getElementById('si-chairs').value);
  s.stats = { sqft, staff, chairs };
  // Re-render Home if we just edited the currently selected store
  if (s.id === _currentStoreId) applyStore(s.id);
  // Toast: reuse store-toast UI
  const t = document.getElementById('store-toast');
  const tt = document.getElementById('store-toast-text');
  if (t && tt) {
    tt.textContent = 'Store info saved';
    t.classList.add('show');
    clearTimeout(window._storeToastT);
    window._storeToastT = setTimeout(() => t.classList.remove('show'), 1600);
  }
  siCheckDirty();
}

// Re-render store list page each time it becomes active
(function watchStoreListPage() {
  const _origGoTo = window.goTo;
  if (typeof _origGoTo !== 'function') return;
  window.goTo = function(id) {
    _origGoTo(id);
    if (id === 's-store-list') {
      setTimeout(() => {
        const inp = document.getElementById('sl-page-search-inp');
        const clr = document.getElementById('sl-page-search-clear');
        if (inp) inp.value = '';
        if (clr) clr.classList.remove('show');
        renderStoreListPage('');
      }, 30);
    }
  };
})();

function _renderStoreList(query) {
  const list = document.getElementById('store-list');
  const empty = document.getElementById('store-empty');
  if (!list) return;
  const q = (query || '').trim().toLowerCase();
  const filtered = !q ? _HOME_STORES : _HOME_STORES.filter(s =>
    s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
  );

  if (empty) empty.classList.toggle('show', filtered.length === 0);

  const checkSvg = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5L10 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const upArrow = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3 8l3-3 3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const downArrow = '<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3 4l3 3 3-3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  list.innerHTML = filtered.map(s => {
    const isUp = s.trend.dir === 'up';
    const trendCls = isUp ? 'up' : 'down';
    const arrow = isUp ? upArrow : downArrow;
    const sign = isUp ? '+' : '-';
    const roleIcon = s.role === 'owner'
      ? '<span class="role-emoji" aria-label="Owner">👑</span>'
      : '<span class="role-emoji" aria-label="Partner">🤝</span>';
    const roleLabel = s.role === 'owner' ? 'Owner' : 'Partner';

    return `
    <div class="store-row${s.id === _currentStoreId ? ' selected' : ''}" onclick="selectStore('${s.id}')">
      <div class="store-row-ico" style="background:${s.color}">${s.initial}</div>
      <div class="store-row-info">
        <div class="store-row-name">${s.name}</div>
        <div class="store-row-meta">
          <span class="trend-badge ${trendCls}">${arrow}<span>${sign}${s.trend.percent}</span></span>
          <span class="store-role">${roleLabel} ${roleIcon}</span>
        </div>
        <div class="store-row-addr">${s.address}</div>
      </div>
      <div class="store-row-check">${checkSvg}</div>
    </div>
  `;
  }).join('');
}

function openStoreSheet() {
  if (_HOME_STORES.length <= 1) return;
  const inp = document.getElementById('store-search-inp');
  const clr = document.getElementById('store-search-clear');
  if (inp) inp.value = '';
  if (clr) clr.classList.remove('show');
  _renderStoreList('');
  document.getElementById('store-sheet-backdrop').classList.add('open');
  document.getElementById('store-sheet').classList.add('open');
}

function closeStoreSheet() {
  document.getElementById('store-sheet-backdrop').classList.remove('open');
  document.getElementById('store-sheet').classList.remove('open');
  const inp = document.getElementById('store-search-inp');
  if (inp) inp.blur();
}

function filterStoreList(q) {
  const clr = document.getElementById('store-search-clear');
  if (clr) clr.classList.toggle('show', !!q);
  _renderStoreList(q);
}

function clearStoreSearch() {
  const inp = document.getElementById('store-search-inp');
  const clr = document.getElementById('store-search-clear');
  if (inp) { inp.value = ''; inp.focus(); }
  if (clr) clr.classList.remove('show');
  _renderStoreList('');
}

function selectStore(id) {
  if (id === _currentStoreId) { closeStoreSheet(); return; }
  applyStore(id);
  closeStoreSheet();
  const s = _getStore(id);
  const t = document.getElementById('store-toast');
  const tt = document.getElementById('store-toast-text');
  if (t && tt) {
    tt.textContent = `Switched to ${s.name}`;
    t.classList.add('show');
    clearTimeout(window._storeToastT);
    window._storeToastT = setTimeout(() => t.classList.remove('show'), 1800);
  }
}

(function initHomeStoreSwitcher() {
  // Legacy hm-store-card (removed in v6 layout) — collapse it if still present.
  const card = document.getElementById('hm-store-card');
  if (card && _HOME_STORES.length <= 1) {
    const chev = document.getElementById('hm-store-chev');
    if (chev) chev.style.display = 'none';
    card.classList.add('single');
  }
  // Hide chip chevron when there's only one store
  if (_HOME_STORES.length <= 1) {
    document.querySelectorAll('.sc-chip-chev').forEach(el => { el.style.display = 'none'; });
  }
  applyStore(_currentStoreId);
})();

(function initBnav(){
  const active = document.querySelector('.screen.active');
  updateBnav(active ? active.id : 's-home');
})();

/* ── QUICK SALE ── */
function _qsParse(v) {
  const n = parseFloat(String(v || '').replace(/[^0-9.]/g, ''));
  return isFinite(n) && n >= 0 ? n : 0;
}
function qsCalc() {
  const subEl = document.getElementById('qs-subtotal');
  const tipEl = document.getElementById('qs-tip');
  if (!subEl || !tipEl) return;
  const total = _qsParse(subEl.value) + _qsParse(tipEl.value);
  const totalEl = document.getElementById('qs-total-val');
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  const subClr = document.getElementById('qs-subtotal-clear');
  const tipClr = document.getElementById('qs-tip-clear');
  if (subClr) subClr.classList.toggle('show', !!subEl.value);
  if (tipClr) tipClr.classList.toggle('show', !!tipEl.value);
}
function qsClearField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = '';
  qsCalc();
  el.focus();
}
function qsPay() {
  // Prototype: no-op for now
}
function qsZelle() {
  // Prototype: no-op for now
}
