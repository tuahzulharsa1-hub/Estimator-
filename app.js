const KEY="kontrol-proyek-v1";
const DEF={name:"Proyek Drainase",items:[
{id:1,name:"Galian tanah",unit:"m3",vol:120,price:45000},
{id:2,name:"Urugan pasir bawah",unit:"m3",vol:12,price:280000},
{id:3,name:"Pasangan batu 1:4",unit:"m3",vol:70,price:1150000},
{id:4,name:"Plesteran 1:3",unit:"m2",vol:300,price:65000},
{id:5,name:"Beton penutup K-225",unit:"m3",vol:10,price:1900000}],logs:[],nid:10};
let S=load(),tab="item",rt="harian",rd=today();
function load(){try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return JSON.parse(JSON.stringify(DEF))}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function today(){const d=new Date();return fmtD(d)}
function fmtD(d){return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function pd(s){const[a,b,c]=s.split("-").map(Number);return new Date(a,b-1,c)}
function idn(s){return pd(s).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
const N=(x,d=2)=>(+x||0).toLocaleString("id-ID",{maximumFractionDigits:d});
const Rp=x=>"Rp"+N(x,0);
const E=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const tabs={item:"Item Pekerjaan",mat:"Material",prog:"Progres",lap:"Laporan"};
function go(t){tab=t;render()}
function render(){
$("#nav").innerHTML=Object.entries(tabs).map(([k,v])=>`<button class="${k==tab?"on":""}" onclick="go('${k}')">${v}</button>`).join("");
$("#v").innerHTML={item:vItem,mat:vMat,prog:vProg,lap:vLap}[tab]();
if(tab=="mat")calcMat()}
function $(s){return document.querySelector(s)}
const total=()=>S.items.reduce((a,i)=>a+i.vol*i.price,0);

/* ITEM */
function vItem(){
return `<div class="card"><label>Nama proyek</label><input value="${E(S.name)}" onchange="S.name=this.value;save()"></div>
<div class="card sc"><table><tr><th>Uraian</th><th>Sat.</th><th class="n">Volume</th><th class="n">Harga sat. (Rp)</th><th class="n">Bobot</th><th></th></tr>
${S.items.map(i=>`<tr><td><input style="min-width:150px" value="${E(i.name)}" onchange="upd(${i.id},'name',this.value)"></td>
<td><input style="width:60px" value="${E(i.unit)}" onchange="upd(${i.id},'unit',this.value)"></td>
<td><input style="width:80px" type="number" step="any" value="${i.vol}" onchange="upd(${i.id},'vol',+this.value)"></td>
<td><input style="width:110px" type="number" step="any" value="${i.price}" onchange="upd(${i.id},'price',+this.value)"></td>
<td class="n">${N(total()?i.vol*i.price/total()*100:0)}%</td><td><button class="x" onclick="del(${i.id})">✕</button></td></tr>`).join("")}
<tr><th colspan="4">Total nilai pekerjaan</th><th class="n" colspan="2">${Rp(total())}</th></tr></table></div>
<button class="b" onclick="addItem()">+ Tambah item</button>
<p class="note">Isi volume dan harga satuan sesuai RAB atau kontrak. Bobot dihitung otomatis dari nilai tiap item. Angka awal hanya contoh.</p>`}
function upd(id,k,v){S.items.find(i=>i.id==id)[k]=v;save();render()}
function del(id){if(S.items.length<2)return;S.items=S.items.filter(i=>i.id!=id);S.logs=S.logs.filter(l=>l.itemId!=id);save();render()}
function addItem(){S.items.push({id:S.nid++,name:"Item baru",unit:"m3",vol:0,price:0});save();render()}

/* MATERIAL */
const K={batu:1.2,semen:163,pasir:0.52,psemen:7.776,ppasir:0.023};
function vMat(){
const f=(id,l,v,s="0.01")=>`<div><label>${l}</label><input id="${id}" type="number" step="${s}" value="${v}" oninput="calcMat()"></div>`;
return `<div class="card"><b>Saluran drainase pasangan batu</b><div class="note" style="margin-bottom:8px">Dimensi dalam meter.</div>
<div class="g">${f("L","Panjang (m)",100,"1")}${f("B","Lebar dalam",0.5)}${f("H","Tinggi dalam",0.6)}${f("T","Tebal dinding",0.2)}${f("TL","Tebal lantai",0.15)}${f("W","Cadangan susut (%)",5,"1")}</div></div>
<div class="card"><b>Koefisien per satuan</b><div class="note" style="margin-bottom:8px">Pasangan batu 1:4 per m3, plesteran 1:3 tebal 15 mm per m2. Ubah sesuai analisa harga satuan proyek.</div>
<div class="g">${f("kb","Batu (m3)",K.batu)}${f("ks","Semen (kg)",K.semen)}${f("kp","Pasir (m3)",K.pasir,"0.001")}${f("ps","Plester: semen (kg)",K.psemen,"0.001")}${f("pp","Plester: pasir (m3)",K.ppasir,"0.001")}</div></div>
<div id="mr"></div>`}
function calcMat(){
const g=i=>+document.getElementById(i).value||0;
const L=g("L"),B=g("B"),H=g("H"),T=g("T"),TL=g("TL"),w=1+g("W")/100;
const dinding=2*T*H*L,lantai=(B+2*T)*TL*L,pas=dinding+lantai;
const galian=L*(B+2*T+0.2)*(H+TL+0.1),urug=L*(B+2*T)*0.05,pl=L*(B+2*H);
const rows=[["Galian tanah",galian,"m3"],["Urugan pasir bawah",urug,"m3"],["Pasangan batu",pas,"m3"],["Plesteran dalam",pl,"m2"]];
const batu=pas*g("kb")*w,semen=(pas*g("ks")+pl*g("ps"))*w,pasir=(pas*g("kp")+pl*g("pp")+urug)*w;
$("#mr").innerHTML=`<h2>Volume pekerjaan</h2><div class="card sc"><table>${rows.map(r=>`<tr><td>${r[0]}</td><td class="n"><b>${N(r[1])}</b></td><td>${r[2]}</td></tr>`).join("")}</table></div>
<h2>Kebutuhan material</h2><div class="k"><div><b>${N(batu)} m3</b><span>Batu kali</span></div><div><b>${N(semen)} kg</b><span>Semen (${N(semen/50,1)} sak 50 kg)</span></div><div><b>${N(pasir)} m3</b><span>Pasir</span></div></div>
<p class="note">Salin volume ke tab Item Pekerjaan bila ingin dipakai sebagai volume kontrak.</p>`}

/* PROGRES */
function vProg(){
const sorted=[...S.logs].sort((a,b)=>b.date.localeCompare(a.date));
return `<div class="card"><b>Catat pekerjaan</b><div class="g" style="margin-top:8px">
<div><label>Tanggal</label><input id="pd" type="date" value="${today()}"></div>
<div><label>Item</label><select id="pi">${S.items.map(i=>`<option value="${i.id}">${E(i.name)} (${E(i.unit)})</option>`).join("")}</select></div>
<div><label>Volume hari ini</label><input id="pv" type="number" step="any"></div>
<div><label>Catatan</label><input id="pn" placeholder="cuaca, kendala, tenaga"></div></div>
<p><button class="b" onclick="addLog()">Simpan</button></p></div>
<h2>Riwayat</h2><div class="card sc"><table><tr><th>Tanggal</th><th>Item</th><th class="n">Volume</th><th>Catatan</th><th></th></tr>
${sorted.map(l=>{const i=S.items.find(x=>x.id==l.itemId)||{name:"?",unit:""};return `<tr><td>${l.date}</td><td>${E(i.name)}</td><td class="n">${N(l.vol)} ${E(i.unit)}</td><td>${E(l.note||"")}</td><td><button class="x" onclick="delLog(${l.id})">✕</button></td></tr>`}).join("")||`<tr><td colspan="5" class="note">Belum ada catatan.</td></tr>`}</table></div>`}
function addLog(){const v=+$("#pv").value;if(!v||!$("#pd").value)return;S.logs.push({id:S.nid++,date:$("#pd").value,itemId:+$("#pi").value,vol:v,note:$("#pn").value});save();render()}
function delLog(id){S.logs=S.logs.filter(l=>l.id!=id);save();render()}

/* LAPORAN */
function range(){const d=pd(rd);let a,b;
if(rt=="harian")a=b=d;
else if(rt=="mingguan"){const k=(d.getDay()+6)%7;a=new Date(d);a.setDate(d.getDate()-k);b=new Date(a);b.setDate(a.getDate()+6)}
else{a=new Date(d.getFullYear(),d.getMonth(),1);b=new Date(d.getFullYear(),d.getMonth()+1,0)}
return[fmtD(a),fmtD(b)]}
function vLap(){
const[a,b]=range(),T=total();
const rows=S.items.map(i=>{
const sum=f=>S.logs.filter(l=>l.itemId==i.id&&f(l.date)).reduce((x,l)=>x+l.vol,0);
const per=sum(d=>d>=a&&d<=b),cum=sum(d=>d<=b),bw=T?i.vol*i.price/T*100:0;
const pct=i.vol?Math.min(cum/i.vol,1)*100:0;
return{i,per,cum,bw,pct,wp:bw*(i.vol?Math.min(per/i.vol,1):0),wc:bw*pct/100,val:Math.min(cum,i.vol)*i.price}});
const P=rows.reduce((x,r)=>x+r.wp,0),C=rows.reduce((x,r)=>x+r.wc,0),V=rows.reduce((x,r)=>x+r.val,0);
const logs=S.logs.filter(l=>l.date>=a&&l.date<=b&&l.note).sort((x,y)=>x.date.localeCompare(y.date));
const title={harian:"Laporan Harian",mingguan:"Laporan Mingguan",bulanan:"Laporan Bulanan"}[rt];
return `<div class="card noprint"><div class="g"><div><label>Jenis laporan</label><select onchange="rt=this.value;render()">${["harian","mingguan","bulanan"].map(x=>`<option value="${x}" ${x==rt?"selected":""}>${x[0].toUpperCase()+x.slice(1)}</option>`).join("")}</select></div>
<div><label>Tanggal acuan</label><input type="date" value="${rd}" onchange="rd=this.value||rd;render()"></div></div>
<p><button class="b" onclick="window.print()">Cetak / simpan PDF</button></p></div>
<div class="card"><b style="font-size:17px">${title}</b><div>${E(S.name)}</div><div class="note">Periode: ${a==b?idn(a):idn(a)+" s/d "+idn(b)}</div></div>
<div class="k"><div><b>${N(P)}%</b><span>Progres periode ini</span></div><div><b>${N(C)}%</b><span>Progres kumulatif</span></div><div><b>${Rp(V)}</b><span>Nilai terealisasi</span></div></div>
<div class="bar"><i style="width:${Math.min(C,100)}%"></i></div>
<h2>Rincian volume</h2><div class="card sc"><table><tr><th>Uraian</th><th class="n">Kontrak</th><th class="n">Periode ini</th><th class="n">S.d. kini</th><th class="n">Fisik</th><th class="n">Bobot</th></tr>
${rows.map(r=>`<tr><td>${E(r.i.name)}</td><td class="n">${N(r.i.vol)} ${E(r.i.unit)}</td><td class="n">${N(r.per)}</td><td class="n">${N(r.cum)}</td><td class="n">${N(r.pct,1)}%</td><td class="n">${N(r.bw,1)}%</td></tr>`).join("")}</table></div>
<h2>Catatan lapangan</h2><div class="card">${logs.map(l=>`<div><b>${l.date}</b> ${E(l.note)}</div>`).join("")||`<span class="note">Tidak ada catatan pada periode ini.</span>`}</div>`}
render();
