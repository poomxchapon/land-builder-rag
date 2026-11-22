// Turns the 20 saved design runs into one conversation file each, plus a blinded copy (X/Y) for the AI reviewers.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto';
const AB='D:/Unity/Oracle/rift-builder/dev/ab', RAG='D:/Unity/Oracle/land-builder-rag', OUT='out';
const briefs=JSON.parse(fs.readFileSync(AB+'/briefs.json','utf8'));
const cards=new Map(JSON.parse(fs.readFileSync(RAG+'/data/index.json','utf8')).cards.map(c=>[c.id,c]));
for(const d of ['conversations','blind'])fs.mkdirSync(path.join(OUT,d),{recursive:true});
const HIDE=new Set(['card','why_not','spectator_notes','sources','by','quote','cards','rag','conflicts','followed']);
const strip=o=>Array.isArray(o)?o.map(strip):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).filter(([k])=>!HIDE.has(k)).map(([k,v])=>[k,strip(v)])):o;
const J=o=>'```json\n'+JSON.stringify(o,null,1)+'\n```';
function convo(b,r,blind){const f=blind?strip:x=>x,L=[],c=p=>r.calls.find(x=>x.phase===p);
 const say=(who,t,body)=>L.push(`## ${who}: ${t}\n\n${body}\n`);
 const used=p=>{if(blind)return'';const ids=c(p)?.rag||[];return ids.length?`Knowledge cards retrieved for this step (${ids.length}):\n${ids.map(i=>`- ${i}: ${cards.get(i)?.title||'(card not in current index)'}`).join('\n')}\n\n`:'No knowledge cards were retrieved for this step.\n\n'};
 say('Creator','the game brief',J(b.brief));
 say('AI designer','three game options',used('options')+J(f(r.options)));
 say('Creator','picks an option',`Option ${r.pick+1} (the option the AI recommended; this step was automatic so both runs are treated the same).`);
 say('AI designer','playable prototype plan',used('prototype')+J(f(r.prototype)));
 say('Creator','approves the prototype','Approved without changes (automatic).');
 say('AI designer','final build plan',used('build')+J(f(r.build)));
 return L.join('\n');}
const key={};
const order=[...briefs].sort((a,b)=>crypto.createHash('sha256').update('conv-review'+a.id).digest('hex').localeCompare(crypto.createHash('sha256').update('conv-review'+b.id).digest('hex')));
order.forEach((b,i)=>key[b.id]=i<5?{X:'on',Y:'off'}:{X:'off',Y:'on'});
const onlyOn={},leaks=[];const keys=(o,s=new Set())=>{if(Array.isArray(o))o.forEach(x=>keys(x,s));else if(o&&typeof o==='object')for(const[k,v]of Object.entries(o)){s.add(k);keys(v,s)}return s};
for(const b of briefs){const R={};for(const m of['on','off']){R[m]=JSON.parse(fs.readFileSync(`${AB}/${b.id}-${m}.json`,'utf8'));
  fs.writeFileSync(`${OUT}/conversations/${b.id}-${m==='on'?'with-rag':'without-rag'}.md`,`# ${b.id} · ${m==='on'?'WITH':'WITHOUT'} the knowledge base (RAG)\n\nModel: Kimi K3.1 Pro. Same brief and same steps in both runs. The system prompts were not saved; this is the creator input and every AI output, in order.\n\n`+convo(b,R[m],false));}
 for(const k of keys(R.on))if(!keys(R.off).has(k))onlyOn[k]=1;
 for(const l of['X','Y']){const t=convo(b,R[key[b.id][l]],true);fs.writeFileSync(`${OUT}/blind/${b.id}-${l}.md`,t);
  for(const id of cards.keys())if(t.includes(id))leaks.push(b.id+l+':'+id);
  const m=t.match(/knowledge card|knowledge base|\bRAG\b|การ์ดความรู้|ฐานความรู้/gi);if(m)leaks.push(b.id+l+':'+m.join(','));}}
fs.writeFileSync(OUT+'/blind-key.json',JSON.stringify(key,null,1));
console.log('keys only in RAG runs:',Object.keys(onlyOn));console.log('leaks:',leaks.length,leaks.slice(0,20));
console.log('X=on count',Object.values(key).filter(k=>k.X==='on').length);
console.log('files',fs.readdirSync(OUT+'/conversations').length,fs.readdirSync(OUT+'/blind').length,'bytes',fs.readdirSync(OUT+'/blind').reduce((a,f)=>a+fs.statSync(OUT+'/blind/'+f).size,0));
