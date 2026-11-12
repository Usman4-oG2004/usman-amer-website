/* Usman Amer website: page logic (navigation, booking popup, games, GTM Lab). Settings are in config.js. */
(function(){
  /* Settings live in js/config.js */
  var CFG = window.SITE_CONFIG || {};
  var BOOKING_URL = CFG.bookingUrl || "";
  var EMBED_CALENDAR = CFG.embedCalendar !== false;
  var EMAIL = CFG.email || "osmanb4u2@gmail.com";
  var POPUP_DELAY_MS = typeof CFG.popupDelayMs === "number" ? CFG.popupDelayMs : 9000;

  function gmail(subject, body){
    return "https://mail.google.com/mail/?view=cm&fs=1&to="+encodeURIComponent(EMAIL)+"&su="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
  }
  var bookHref = BOOKING_URL || gmail("Meeting request", "Hi Usman,\n\nI'd like to book a 15-minute call.\n\nWhat I'd like to discuss:\n\nTimes that work for me (with time zone):\n\nThanks,\n");
  document.querySelectorAll('[data-book-link]').forEach(function(a){a.href=bookHref;});
  if(BOOKING_URL&&EMBED_CALENDAR){
    var slot=document.getElementById('cal-slot');
    if(slot){
      var f=document.createElement('iframe');
      f.src=BOOKING_URL+(BOOKING_URL.indexOf('?')<0?'?':'&')+'gv=true';
      f.title='Book a time with Usman';f.loading='lazy';
      slot.innerHTML='';slot.appendChild(f);slot.classList.add('embedded');slot.removeAttribute('aria-hidden');
    }
  }

  function sget(k){try{return sessionStorage.getItem(k);}catch(e){return null;}}
  function sset(k,v){try{sessionStorage.setItem(k,v);}catch(e){}}

  /* ============ NAV (real pages) ============ */
  var mb=document.getElementById('menu-btn'),mm=document.getElementById('mobile-menu');
  function closeMenu(){if(mm){mm.hidden=true;}if(mb){mb.setAttribute('aria-expanded','false');}}
  var PAGE=document.body.getAttribute('data-page')||'home';
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('data-nav')===PAGE)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  /* old links like /#about from before the site had real pages */
  var LEGACY={about:'/about',services:'/services',work:'/work',lab:'/gtm-lab',play:'/gtm-lab',contact:'/contact',blog:'/blog'};
  var lh=(location.hash||'').slice(1);
  if(PAGE==='home'&&LEGACY[lh]){location.replace(LEGACY[lh]);}
  if(mb&&mm){
    mb.addEventListener('click',function(){var open=mm.hidden;mm.hidden=!open;mb.setAttribute('aria-expanded',String(open));});
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  }

  /* ============ COPY ============ */
  function selectText(id){var el=id&&document.getElementById(id);if(!el)return;try{var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}catch(e){}}
  function copyText(text,btn,targetId){
    var label=btn.querySelector('span:not([id])')||btn;
    if(btn.id==='strip-copy')label=null;
    var orig=label?label.textContent:'';
    var flash=function(t){if(!label)return;label.textContent=t;btn.classList.add('done');setTimeout(function(){label.textContent=orig;btn.classList.remove('done');},1600);};
    var fail=function(){selectText(targetId);flash('Selected');};
    try{navigator.clipboard.writeText(text).then(function(){flash('Copied');if(!label){var m=document.getElementById('strip-mail');var o=m.textContent;m.textContent='Copied!';setTimeout(function(){m.textContent=o;},1400);}},fail);}catch(e){fail();}
  }
  document.querySelectorAll('button[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){copyText(b.getAttribute('data-copy'),b,b.getAttribute('data-target'));});
  });

  /* ============ BOOKING POPUP ============ */
  var modal=document.getElementById('book-modal'),lastFocus=null;
  function openModal(){
    if(!modal.hidden)return;
    lastFocus=document.activeElement;closeMenu();
    modal.hidden=false;sset('ua_popup','seen');
    document.getElementById('bm-go').focus({preventScroll:true});
  }
  function closeModal(){
    modal.hidden=true;sset('ua_popup','seen');
    if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
  }
  document.querySelectorAll('[data-book]').forEach(function(b){b.addEventListener('click',openModal);});
  modal.querySelectorAll('[data-close]').forEach(function(b){b.addEventListener('click',closeModal);});
  document.getElementById('bm-go').addEventListener('click',function(){setTimeout(closeModal,200);});
  document.addEventListener('keydown',function(e){
    if(modal.hidden)return;
    if(e.key==='Escape'){closeModal();return;}
    if(e.key==='Tab'){
      var f=[].slice.call(modal.querySelectorAll('a[href],button')).filter(function(x){return x.offsetParent!==null;});
      var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  if(!sget('ua_popup')){
    var armed=false;
    setTimeout(function(){armed=true;},5000);
    setTimeout(function(){if(!sget('ua_popup'))openModal();},POPUP_DELAY_MS);
    document.addEventListener('mouseout',function(e){
      if(armed&&!e.relatedTarget&&e.clientY<=0&&!sget('ua_popup'))openModal();
    });
  }

  /* ============ DRAGGABLE NOTES ============ */
  var topZ=10;
  document.querySelectorAll('[data-drag]').forEach(function(el){
    var sx=0,sy=0,dx=0,dy=0,id=null;
    el.addEventListener('pointerdown',function(e){if(e.button!==0)return;id=e.pointerId;el.setPointerCapture(id);sx=e.clientX-dx;sy=e.clientY-dy;el.classList.add('dragging');el.style.zIndex=++topZ;});
    el.addEventListener('pointermove',function(e){
      if(e.pointerId!==id)return;
      var area=el.parentElement.getBoundingClientRect(),box=el.getBoundingClientRect();
      var nx=e.clientX-sx,ny=e.clientY-sy;
      dx=Math.max(dx-(box.left-area.left)-40,Math.min(dx+(area.right-box.right)+40,nx));
      dy=Math.max(dy-(box.top-area.top)-30,Math.min(dy+(area.bottom-box.bottom)+30,ny));
      el.style.setProperty('--dx',dx+'px');el.style.setProperty('--dy',dy+'px');
    });
    function end(e){if(e.pointerId!==id)return;id=null;el.classList.remove('dragging');}
    el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
  });

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}

  /* ============ PIPELINE CALCULATOR ============ */
  if(document.getElementById('c-out')){
  var cIn={out:document.getElementById('c-out'),reply:document.getElementById('c-reply'),close:document.getElementById('c-close'),deal:document.getElementById('c-deal')};
  function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
  function fmt1(n){return n>=10?String(Math.round(n)):(Math.round(n*10)/10).toString();}
  function calc(){
    var out=+cIn.out.value,reply=+cIn.reply.value/100,close=+cIn.close.value/100,deal=+cIn.deal.value;
    var conv=out*reply,won=conv*close,rev=won*deal;
    var lift=out*Math.min(reply+.05,1)*close*deal;
    document.getElementById('o-out').textContent=out;
    document.getElementById('o-reply').textContent=Math.round(reply*100)+'%';
    document.getElementById('o-close').textContent=Math.round(close*100)+'%';
    document.getElementById('o-deal').textContent=money(deal);
    document.getElementById('n-out').textContent=out;
    document.getElementById('n-conv').textContent=fmt1(conv);
    document.getElementById('n-deal').textContent=fmt1(won);
    document.getElementById('b-out').style.width='100%';
    document.getElementById('b-conv').style.width=(conv/out*100)+'%';
    document.getElementById('b-deal').style.width=(won/out*100)+'%';
    document.getElementById('n-rev').textContent=money(rev);
    document.getElementById('n-lift').textContent=money(lift);
  }
  Object.keys(cIn).forEach(function(k){cIn[k].addEventListener('input',calc);});
  calc();
  }

  /* ============ QUERY FORM ============ */
  if(document.getElementById('q-form')){
  var qf=document.getElementById('q-form');
  function qText(){
    var n=document.getElementById('q-name').value.trim(),c=document.getElementById('q-company').value.trim(),
        t=document.getElementById('q-topic').value,m=document.getElementById('q-msg').value.trim();
    return {subject:t+(c?' · '+c:''),body:'Hi Usman,\n\n'+(m||'[Your message]')+'\n\n'+(n||'')+(c?'\n'+c:'')};
  }
  function qUpdate(){var q=qText();document.getElementById('q-gmail').href=gmail(q.subject,q.body);}
  qf.addEventListener('input',qUpdate);qf.addEventListener('change',qUpdate);qUpdate();
  qf.addEventListener('submit',function(e){e.preventDefault();});
  document.getElementById('q-copy').addEventListener('click',function(){
    var q=qText(),b=this,l=b.querySelector('span'),o=l.textContent,txt='To: '+EMAIL+'\nSubject: '+q.subject+'\n\n'+q.body;
    var ok=function(){l.textContent='Copied';setTimeout(function(){l.textContent=o;},1600);};
    var no=function(){document.getElementById('q-msg').select();l.textContent='Select and copy';setTimeout(function(){l.textContent=o;},2000);};
    try{navigator.clipboard.writeText(txt).then(ok,no);}catch(err){no();}
  });
  }

  /* ============ GAME 1: CLOSE THE DEAL ============ */
  if(document.getElementById('game')){
  var ROUNDS=[
    {stage:'Find',who:'Upwork feed, 9:12 am',say:'Three new posts. You have one bid to spend today.',ask:'Which one do you go after?',
     opts:[{t:'"Need AI chatbot for my store. Budget $50. ASAP." 50+ proposals already.',f:'Tiny budget, crowded post. That is a race to the bottom.'},
      {t:'Dental clinic wants a voice AI receptionist. $3k–5k, payment verified, 12 past hires, 4 proposals.',ok:1,f:'Verified payment, real budget, hiring history, low competition. That is a lead worth a bid.'},
      {t:'"Visionary founder seeks dev partner. Equity only, huge upside."',f:'No budget means no deal. Polite pass.'}]},
    {stage:'Qualify',who:'Discovery call, clinic owner',say:'"We love this. I just need to check with my co-founder. She signs off on anything we spend."',ask:'Which BANT box is still empty?',
     opts:[{t:'Budget',f:'They have budget. The question is who approves it.'},{t:'Authority',ok:1,f:'The person who signs is not on the call. Next move: get the co-founder on a 15-minute follow-up.'},{t:'Need',f:'They keep missing calls. Need is clear.'},{t:'Timeline',f:'Timing was not the blocker here.'}]},
    {stage:'Objection',who:'Follow-up call, both founders',say:'"Honestly, another agency quoted us half your price."',ask:'What do you say?',
     opts:[{t:'"No problem, we can match that."',f:'You just halved the deal and told them your price was padding.'},
      {t:'"Fair to compare. Can we put both scopes side by side? The gap is usually in what is included."',ok:1,f:'You protect the price and move the talk to scope and value.'},
      {t:'"Then you should probably go with them."',f:'Confident, but you just walked away from a qualified buyer.'}]},
    {stage:'Next step',who:'End of the call',say:'"Just send over a proposal and we will get back to you."',ask:'How do you keep control?',
     opts:[{t:'"Sure, sending it now!"',f:'Proposals sent cold go quiet. You lost the next step.'},
      {t:'"Happy to. Can we book 15 minutes Thursday to walk through it together, with your tech lead?"',ok:1,f:'Proposal plus a booked walkthrough keeps the deal moving.'},
      {t:'"I need a decision by Friday or the price goes up."',f:'Pressure with no reason behind it feels like a trap.'}]},
    {stage:'Close',who:'Thursday walkthrough',say:'"This looks right. So... what happens next?"',ask:'Close it.',
     opts:[{t:'"Whenever you are ready, just let me know!"',f:'They asked for the next step. Give it to them.'},
      {t:'"Before that, let me show you a few more features."',f:'They are ready to buy. Do not talk past the close.'},
      {t:'"I will send the contract today and we kick off Monday with our tech lead. Does Monday work?"',ok:1,f:'Clear next step, a date, and a yes-or-no question. Signed.'}]}
  ];
  var KEYS='ABCD',root=document.getElementById('game'),st;
  function reset(){st={i:0,score:0,results:[],answered:false};}
  function topBar(){
    var lis=ROUNDS.map(function(r,k){var cls=k<st.results.length?(st.results[k]?'won':'lost'):(k===st.i&&st.i<ROUNDS.length?'now':'');return '<li class="'+cls+'">'+(k+1)+' · '+esc(r.stage)+'</li>';}).join('');
    var pct=Math.round(st.score/ROUNDS.length*100);
    return '<div class="game-top"><ol class="stages">'+lis+'</ol><div class="meter"><span class="lbl">Deal meter</span><span class="track"><span class="fill" style="width:'+pct+'%"></span></span><span class="pct">'+pct+'%</span></div></div>';
  }
  function renderRound(){
    var r=ROUNDS[st.i],order=shuffle(r.opts.map(function(o,k){return k;}));st.answered=false;
    var opts=order.map(function(k,pos){return '<button class="opt" type="button" data-k="'+k+'" id="opt-'+st.i+'-'+k+'"><span class="key">'+KEYS[pos]+'</span><span>'+esc(r.opts[k].t)+'</span></button>';}).join('');
    root.innerHTML=topBar()+'<div class="call"><div class="note prospect"><span class="pin" aria-hidden="true"></span><span class="stage-name">Step '+(st.i+1)+' of '+ROUNDS.length+' · '+esc(r.stage)+'</span><span class="who">'+esc(r.who)+'</span><p>'+esc(r.say)+'</p></div><div class="answers"><p class="ask">'+esc(r.ask)+'</p>'+opts+'<div class="verdict" id="verdict"></div></div></div>';
    root.querySelectorAll('.opt').forEach(function(b){b.addEventListener('click',function(){answer(+b.getAttribute('data-k'));});});
  }
  function answer(k){
    if(st.answered)return;st.answered=true;
    var r=ROUNDS[st.i],ok=!!r.opts[k].ok;st.results.push(ok);if(ok)st.score++;
    root.querySelectorAll('.opt').forEach(function(b){var bk=+b.getAttribute('data-k');b.disabled=true;if(r.opts[bk].ok)b.classList.add('right');else if(bk===k)b.classList.add('wrong');else b.classList.add('dim');});
    var tmp=document.createElement('div');tmp.innerHTML=topBar();root.querySelector('.game-top').replaceWith(tmp.firstChild);
    var last=st.i===ROUNDS.length-1;
    document.getElementById('verdict').innerHTML='<p class="'+(ok?'c-green':'c-red')+'">'+(ok?'Nice. ':'Ouch. ')+esc(r.opts[k].f)+'</p><button class="btn btn-primary btn-sm" type="button" id="next-btn">'+(last?'See the result':'Next moment')+' →</button>';
    var nb=document.getElementById('next-btn');nb.addEventListener('click',function(){st.i++;if(st.i<ROUNDS.length)renderRound();else renderResult();});nb.focus({preventScroll:true});
  }
  function renderResult(){
    var s=st.score,n=ROUNDS.length,stamp,cls,head,body;
    if(s===n){stamp='Signed';cls='c-green';head='Deal signed. '+s+'/'+n+'.';body='You found the right lead, qualified it, handled both objections and asked for the close. That is the whole job, and it is the job I do every week.';}
    else if(s>=3){stamp='Almost';cls='c-blue';head='So close. '+s+'/'+n+'.';body='The deal is warm but not signed. Small moments decide big contracts, which is exactly why I practise them.';}
    else{stamp='Gone cold';cls='c-red';head='The lead went quiet. '+s+'/'+n+'.';body='Closing is a skill, not luck. If you would rather not leave your pipeline to chance, that is where I come in.';}
    root.innerHTML=topBar()+'<div class="result"><div class="stamp '+cls+'">'+stamp+'</div><div><h3>'+esc(head)+'</h3><p>'+esc(body)+'</p><div class="cta-row"><button class="btn btn-primary" type="button" id="g1-book">Book a call</button><button class="btn btn-ghost" type="button" id="again-btn">Play again</button></div></div></div>';
    document.getElementById('again-btn').addEventListener('click',function(){reset();renderRound();});
    document.getElementById('g1-book').addEventListener('click',openModal);
  }
  reset();renderRound();
  }

  /* ============ GAME 2: LEAD OR PASS ============ */
  if(document.getElementById('lop')){
  var POSTS=[
    {title:'AI voice agent for an HVAC company',meta:[['$4,000 fixed','good'],['Payment verified','good'],['15 hires','good'],['3 proposals','good']],lead:1,why:'Real budget, proven buyer, almost no competition. Bid today.'},
    {title:'Build me an Uber clone',meta:[['$200 fixed','bad'],['Payment unverified','bad'],['0 hires','bad']],lead:0,why:'A full app for $200 from an unverified client. Hard pass.'},
    {title:'n8n expert to automate invoice processing',meta:[['$45/hr','good'],['30 hrs a week','good'],['4.9 client rating','good'],['5 hires','good']],lead:1,why:'Steady hourly work with a well-rated client. Good lead.'},
    {title:'Quick unpaid test task before we hire',meta:[['Unpaid test','bad'],['New account','bad'],['50+ proposals','bad']],lead:0,why:'Free work for a new account in a crowded post. Skip.'},
    {title:'GoHighLevel CRM and SMS follow-ups for a real estate team',meta:[['$2,500 fixed','good'],['Payment verified','good'],['Client since 2017','good']],lead:1,why:'Clear scope, long-standing client, fair budget. Worth a strong proposal.'},
    {title:'Looking for a technical co-founder',meta:[['Equity only','bad'],['No budget','bad']],lead:0,why:'No money on the table. Polite pass.'},
    {title:'Chatbot for 3 Shopify stores, need it by tomorrow',meta:[['$1,500','good'],['Due in 24 hours','bad'],['60+ proposals','bad']],lead:0,why:'Rushed deadline and a crowded post. Low odds, high risk. Pass.'},
    {title:'Patient intake automation for a telehealth clinic',meta:[['$8,000 fixed','good'],['Invite only','good'],['Payment verified','good']],lead:1,why:'An invite, a serious budget, an industry I have closed before. Go.'}
  ];
  var lroot=document.getElementById('lop'),ls;
  function lreset(){ls={order:shuffle(POSTS.map(function(p,i){return i;})),i:0,right:0,busy:false,last:null};}
  function lrender(){
    if(ls.i>=POSTS.length){return lresult();}
    var p=POSTS[ls.order[ls.i]];
    var meta=p.meta.map(function(m){return '<span class="'+m[1]+'">'+esc(m[0])+'</span>';}).join('');
    var fb=ls.last?'<p class="lop-feedback '+(ls.last.ok?'c-green':'c-red')+'">'+(ls.last.ok?'Right. ':'Not quite. ')+esc(ls.last.why)+'</p>':'<p class="lop-feedback" style="color:var(--ink-3)">Read the post, then decide.</p>';
    lroot.innerHTML='<div><div class="post" id="post"><div class="phead"><span class="ex-tag">Example post '+(ls.i+1)+' of '+POSTS.length+'</span></div><h3>'+esc(p.title)+'</h3><div class="meta">'+meta+'</div></div>'+
      '<div class="lop-btns"><button class="btn btn-pass" type="button" id="lop-pass">✕ Pass</button><button class="btn btn-lead" type="button" id="lop-lead">✓ Bid on it</button></div></div>'+
      '<div class="lop-side"><div class="tally"><span><b>'+ls.right+'</b>correct</span><span><b>'+(ls.i-ls.right)+'</b>missed</span><span><b>'+(POSTS.length-ls.i)+'</b>left</span></div>'+fb+
      '<div class="note" style="background-color:var(--note-blue);transform:rotate(2deg)"><span class="pin" aria-hidden="true"></span><p>Tip: budget, payment verified, hiring history, competition.</p></div></div>';
    document.getElementById('lop-pass').addEventListener('click',function(){lpick(0);});
    document.getElementById('lop-lead').addEventListener('click',function(){lpick(1);});
  }
  function lpick(v){
    if(ls.busy)return;ls.busy=true;
    var p=POSTS[ls.order[ls.i]],ok=(v===p.lead);if(ok)ls.right++;
    ls.last={ok:ok,why:p.why};
    var post=document.getElementById('post');post.classList.add(v?'out-r':'out-l');
    setTimeout(function(){ls.i++;ls.busy=false;lrender();var b=document.getElementById('lop-lead');if(b)b.focus({preventScroll:true});},280);
  }
  function lresult(){
    var r=ls.right,n=POSTS.length,cls=r>=7?'c-green':r>=5?'c-blue':'c-red',stamp=r>=7?'Sharp eye':r>=5?'Not bad':'Keep practising';
    var body=r>=7?'You read Upwork like a lead gen pro. Sorting the good posts from the noise is half of winning on the platform.':r>=5?'You caught most of them. The difference between a full pipeline and a busy one is exactly these calls.':'Sorting leads takes practice. I do it every morning, so your team only talks to buyers who can say yes.';
    var fb=ls.last?'<p class="lop-feedback '+(ls.last.ok?'c-green':'c-red')+'" style="margin-bottom:12px">Last one: '+esc(ls.last.why)+'</p>':'';
    lroot.innerHTML='<div class="result" style="grid-column:1/-1"><div class="stamp '+cls+'">'+stamp+'</div><div>'+fb+'<h3>'+r+' out of '+n+' right.</h3><p>'+esc(body)+'</p><div class="cta-row"><button class="btn btn-primary" type="button" id="g2-book">Book a call</button><button class="btn btn-ghost" type="button" id="lop-again">Play again</button></div></div></div>';
    document.getElementById('lop-again').addEventListener('click',function(){lreset();lrender();});
    document.getElementById('g2-book').addEventListener('click',openModal);
  }
  lreset();lrender();
  }

  /* ============ GTM LAB: AGENTIC FORCE ============ */
  if(document.getElementById('gtm-form')){
  var IND={
    clinics:{who:'clinics',pain:'missed patient calls',leads:{
      linkedin:['Multi-location dental group','Hiring 2 front desk coordinators','are hiring two front desk coordinators'],
      apollo:['Physiotherapy clinic chain, 40 staff','Opened a third location this quarter','just opened a third location'],
      reddit:['Practice owner in r/Dentistry','Asked: "How do you handle after-hours calls?"','asked on Reddit how to handle after-hours calls'],
      instagram:['Cosmetic dental studio, 12k followers','Posting daily, "DM to book" in bio','are getting a lot of booking DMs on Instagram']}},
    home:{who:'home service companies',pain:'missed calls while crews are on jobs',leads:{
      linkedin:['Owner, regional plumbing company','Hiring a call dispatcher','are hiring a call dispatcher'],
      apollo:['Roofing contractor, 30 staff','Expanding into 3 new service areas','are expanding into three new service areas'],
      reddit:['HVAC owner in r/HVAC','Asked: "Answering service or AI?"','asked on Reddit whether to use an answering service or AI'],
      instagram:['Landscaping company, 6k followers','Before-and-after reels, "call to book" in bio','are getting booking requests from your Instagram reels']}},
    realestate:{who:'real estate teams',pain:'buyer leads going cold',leads:{
      linkedin:['Team lead, top-producing realty group','Posted about slow lead response','posted about slow lead response times'],
      apollo:['Brokerage, 25 agents','Switched CRM recently','recently switched CRMs'],
      reddit:['Agent in r/realtors','Asked: "Best way to follow up with online leads?"','asked on Reddit about following up with online leads'],
      instagram:['Luxury listings team, 20k followers','Listing tours, "DM for showings" in bio','are getting showing requests in your Instagram DMs']}},
    property:{who:'property managers',pain:'tenant requests stuck in voicemail',leads:{
      linkedin:['Ops director, rental portfolio','Hiring a maintenance coordinator','are hiring a maintenance coordinator'],
      apollo:['Student housing operator','Added 2 buildings this year','added two buildings this year'],
      reddit:['Manager in r/PropertyManagement','Asked: "How do you triage tenant calls?"','asked on Reddit how to triage tenant calls'],
      instagram:['Apartment community, 4k followers','Leasing promos, "DM to tour" in bio','are booking tours through Instagram DMs']}},
    saas:{who:'SaaS teams',pain:'demo requests waiting too long',leads:{
      linkedin:['Head of Growth, Series A SaaS','Hiring their first SDR','are hiring your first SDR'],
      apollo:['HR software company, 60 staff','Raised a funding round recently','recently raised a funding round'],
      reddit:['Founder in r/SaaS','Asked: "How do you book more demos?"','asked on Reddit how to book more demos'],
      instagram:['Productivity app, 15k followers','Founder-led content, demo link in bio','are driving demo requests from Instagram']}},
    ecom:{who:'e-commerce brands',pain:'support tickets piling up',leads:{
      linkedin:['Founder, DTC apparel brand','Posted about scaling support','posted about scaling customer support'],
      apollo:['Home goods store, fast-growing','Hiring support agents in 2 regions','are hiring support agents in two regions'],
      reddit:['Store owner in r/shopify','Asked: "A chatbot that answers order questions?"','asked on Reddit for a chatbot that handles order questions'],
      instagram:['Skincare brand, 40k followers','Hundreds of order questions in comments','get hundreds of order questions in your Instagram comments']}},
    legal:{who:'law firms',pain:'intake calls that never get returned',leads:{
      linkedin:['Managing partner, family law firm','Hiring an intake specialist','are hiring an intake specialist'],
      apollo:['Estate planning firm, 15 staff','Opened a second office','just opened a second office'],
      reddit:['Attorney in r/LawFirm','Asked: "How do you handle intake after hours?"','asked on Reddit about after-hours intake'],
      instagram:['Personal injury firm, 9k followers','Legal tips reels, "DM for a free consult"','are getting consult requests through Instagram DMs']}}
  };
  var SRC={linkedin:{name:'LinkedIn Sales Navigator',vol:180},apollo:{name:'Apollo.io',vol:320},reddit:{name:'Reddit',vol:40},instagram:{name:'Instagram',vol:90}};
  var CRM={hubspot:'HubSpot',ghl:'GoHighLevel',clickup:'ClickUp'};
  var gForm=document.getElementById('gtm-form'),gRun=document.getElementById('g-run'),gErr=document.getElementById('g-err');
  var gStatus=document.getElementById('g-status'),gRes=document.getElementById('gtm-results'),gConvo=document.getElementById('g-convo');
  var agentEls={};document.querySelectorAll('#agents .agent').forEach(function(li){agentEls[li.getAttribute('data-agent')]={li:li,log:li.querySelector('.alog'),st:li.querySelector('.astate'),idle:li.querySelector('.alog').textContent};});
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var running=false,timers=[],convoTimers=[],lastConvo=null;
  function checked(name){return [].slice.call(gForm.querySelectorAll('input[name="'+name+'"]:checked')).map(function(i){return i.value;});}
  function listJoin(a){return a.length<2?(a[0]||''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];}
  function setStatus(cls,text){gStatus.className='status '+cls;gStatus.querySelector('span').textContent=text;}
  function resetAgents(){Object.keys(agentEls).forEach(function(k){var a=agentEls[k];a.li.className='agent';a.log.textContent=a.idle;a.st.textContent='Idle';});}

  function runAgents(){
    if(running)return;
    var src=checked('src'),ch=checked('ch'),crm=checked('crm');
    if(!src.length){gErr.hidden=false;return;}
    gErr.hidden=true;
    var offer=document.getElementById('g-offer').value.trim()||'your service';
    var ind=IND[document.getElementById('g-ind').value];
    var found=0;src.forEach(function(k){found+=SRC[k].vol;});
    var verified=Math.round(found*0.7);
    var dmCap=(ch.indexOf('dm')>=0?100:0)+(ch.indexOf('ig')>=0?70:0);
    var emailSent=(ch.indexOf('email')>=0||!ch.length)?verified:0;
    var sent=emailSent+Math.min(verified,dmCap);
    var replies=Math.max(2,Math.round(sent*0.04));
    var low=Math.max(1,Math.round(replies*4*0.25)),high=Math.max(low+1,Math.round(replies*4*0.45));
    var chNames=[];if(ch.indexOf('email')>=0||!ch.length)chNames.push('email sequences');if(ch.indexOf('dm')>=0)chNames.push('LinkedIn messages');if(ch.indexOf('ig')>=0)chNames.push('Instagram DMs');
    var crmName=crm.length?listJoin(crm.map(function(k){return CRM[k];})):'a shared pipeline sheet';
    var steps=[
      ['scout','Scanning '+listJoin(src.map(function(k){return SRC[k].name;}))+' for '+ind.who,'Found '+found+' prospects'],
      ['enrich','Finding decision makers and verifying emails',verified+' verified contacts'],
      ['writer','Writing personal '+listJoin(chNames)+' for '+offer,verified+' personal first lines'],
      ['mailer',emailSent?'Sending from 3 warmed inboxes, 35 a day each':'Sending messages within platform limits',sent+' messages out this week'],
      ['closer','Answering replies, handling objections, booking calls',replies+' replies handled'],
      ['sync','Logging every touch in '+crmName,'Pipeline updated']
    ];
    running=true;gRun.disabled=true;gRun.querySelector('span').textContent='Agents running…';
    gRes.hidden=true;resetAgents();
    timers.forEach(clearTimeout);timers=[];
    var t0=Date.now(),STEP=reduce?0:900;
    steps.forEach(function(s,i){
      timers.push(setTimeout(function(){
        if(i>0){var p=agentEls[steps[i-1][0]];p.li.className='agent done';p.log.textContent=steps[i-1][2];p.st.textContent='Done';}
        var a=agentEls[s[0]];a.li.className='agent running';a.log.textContent=s[1];a.st.textContent='Working';
        setStatus('live','Running · agent '+(i+1)+' of '+steps.length);
      },i*STEP));
    });
    timers.push(setTimeout(function(){
      var l=steps[steps.length-1],a=agentEls[l[0]];a.li.className='agent done';a.log.textContent=l[2];a.st.textContent='Done';
      setStatus('done','Done in '+((Date.now()-t0)/1000).toFixed(1)+'s');
      running=false;gRun.disabled=false;gRun.querySelector('span').textContent='Run again';
      renderResults({src:src,ch:ch,crm:crm,offer:offer,ind:ind,found:found,verified:verified,sent:sent,replies:replies,low:low,high:high});
    },steps.length*STEP+(reduce?0:300)));
  }
  gRun.addEventListener('click',runAgents);
  gForm.addEventListener('submit',function(e){e.preventDefault();runAgents();});
  document.getElementById('g-offer').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();runAgents();}});

  function renderResults(r){
    var kpis=[['Prospects found',r.found],['Verified contacts',r.verified],['Messages sent',r.sent],['Replies the agent handled',r.replies],['Est. calls booked a month',r.low+'–'+r.high]];
    document.getElementById('g-kpis').innerHTML=kpis.map(function(k,i){return '<div class="kpi'+(i===4?' hot':'')+'"><span class="num">'+esc(k[1])+'</span><span class="lbl">'+esc(k[0])+(i<4?' this week':'')+'</span></div>';}).join('');
    var fits=[94,89,84,78];
    document.getElementById('g-leads').innerHTML=r.src.map(function(k,i){
      var L=r.ind.leads[k];
      return '<div class="lead"><span class="fit">'+fits[i]+'</span><span><strong>'+esc(L[0])+'</strong><span class="sig">'+esc(L[1])+'</span><span class="src">via '+esc(SRC[k].name)+'</span></span></div>';
    }).join('');
    lastConvo=buildConvo(r);
    gRes.hidden=false;
    try{gRes.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});}catch(e){}
    playConvo();
  }

  function buildConvo(r){
    var pick=function(order){for(var i=0;i<order.length;i++){if(r.src.indexOf(order[i])>=0)return r.ind.leads[order[i]];}return r.ind.leads[r.src[0]];};
    var tag,L;
    if(r.ch.indexOf('email')>=0||!r.ch.length){tag='Email · step 1';L=pick(['apollo','linkedin','reddit','instagram']);}
    else if(r.ch.indexOf('dm')>=0){tag='LinkedIn message';L=pick(['linkedin','apollo','reddit','instagram']);}
    else{tag='Instagram DM';L=pick(['instagram','linkedin','apollo','reddit']);}
    var crmName=r.crm.length?CRM[r.crm[0]]:'your CRM';
    return {with:'with Sara · '+L[0],msgs:[
      {w:'agent',tag:tag,t:'Hi Sara, saw that you '+L[2]+'. That usually means more '+r.ind.pain+'. We build '+r.offer+' for '+r.ind.who+'. Worth a quick look?'},
      {w:'them',t:'Maybe. How is this different from just hiring someone?'},
      {w:'agent',tag:'Sales agent',t:'A hire covers office hours. This runs nights and weekends too, and setup takes about two weeks. Most '+r.ind.who+' start with a 30-day pilot.'},
      {w:'them',t:'We tried a tool like this before. It felt robotic and customers noticed.'},
      {w:'agent',tag:'Sales agent',t:'Fair concern. This one is trained on your own FAQs and tone, and anything unusual goes straight to your team. Want two short examples and a pilot proposal?'},
      {w:'them',t:"Sure. Send it over and let's talk Thursday."},
      {w:'agent',tag:'Sales agent',t:'Done. The proposal is in your inbox and Thursday at 11:00 is booked. Calendar invite sent.'},
      {w:'sys',t:'Call booked · proposal sent'},
      {w:'sys won',t:'Thursday: contract signed · deal won in '+crmName}
    ]};
  }

  function bubble(m){
    var el=document.createElement('div');
    if(m.w.indexOf('sys')===0){el.className=m.w;el.textContent=m.t;return el;}
    el.className='msg '+m.w;
    if(m.tag){var s=document.createElement('small');s.textContent=m.tag;el.appendChild(s);}
    el.appendChild(document.createTextNode(m.t));
    return el;
  }
  function playConvo(){
    if(!lastConvo)return;
    convoTimers.forEach(clearTimeout);convoTimers=[];
    gConvo.innerHTML='';
    document.getElementById('g-with').textContent=lastConvo.with;
    if(reduce){lastConvo.msgs.forEach(function(m){gConvo.appendChild(bubble(m));});return;}
    var t=400;
    lastConvo.msgs.forEach(function(m){
      var isSys=m.w.indexOf('sys')===0;
      if(!isSys){
        convoTimers.push(setTimeout(function(){var ty=document.createElement('div');ty.className='typing'+(m.w==='them'?' them':'');ty.innerHTML='<i></i><i></i><i></i>';ty.setAttribute('aria-hidden','true');gConvo.appendChild(ty);},t));
        t+=750;
      }
      convoTimers.push(setTimeout(function(){var ty=gConvo.querySelector('.typing');if(ty)ty.remove();gConvo.appendChild(bubble(m));},t));
      t+=isSys?650:500;
    });
  }
  document.getElementById('g-replay').addEventListener('click',playConvo);
  document.getElementById('g-again').addEventListener('click',function(){
    try{gForm.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});}catch(e){}
    document.getElementById('g-offer').focus({preventScroll:true});
  });

  /* /gtm-lab?run=1 starts the agents straight away */
  if(/[?&]run=1/.test(location.search)){setTimeout(function(){var lab=document.querySelector('.lab');if(lab)lab.scrollIntoView({block:'start'});runAgents();},350);}
  }

  /* ============ PROFILE SCROLL HINT ============ */
  var liShot=document.getElementById('li-shot'),liHint=document.getElementById('li-hint');
  if(liShot&&liHint){liShot.addEventListener('scroll',function(){if(liShot.scrollTop>40)liHint.classList.add('gone');},{passive:true});}

  /* ============ THEME TOGGLE ============ */
  var themeBtn=document.getElementById('theme-btn');
  function getEffectiveTheme(){
    var current=document.documentElement.getAttribute('data-theme');
    if(current==='dark'||current==='light')return current;
    return (window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
  }
  function setTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    try{localStorage.setItem('ua_theme',t);}catch(e){}
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute('content',t==='dark'?'#0c0e11':'#eceef2');
  }
  if(themeBtn){
    themeBtn.addEventListener('click',function(){
      var next=getEffectiveTheme()==='dark'?'light':'dark';
      setTheme(next);
    });
  }

  /* ============ BLOG READING PROGRESS ============ */
  var rp=document.querySelector('.read-progress span'),art=document.querySelector('.article');
  if(rp&&art){
    var upd=function(){var r=art.getBoundingClientRect();var total=r.height-window.innerHeight;var p=total>0?Math.min(1,Math.max(0,-r.top/total)):1;rp.style.transform='scaleX('+p+')';};
    window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
  }

})();
