// lib/data.ts
export interface Team { id:string; name:string; flag:string; conf:string; color:string }
export interface Sticker { id:string; teamId:string; number:number; name:string; isSpecial:boolean; type:string }
export interface Achievement { id:string; icon:string; title:string; desc:string; check:(s:CollectionStats,c:CollectionMap)=>boolean }
export interface CollectionEntry { quantity:number; pasted:boolean; addedAt:string }
export type CollectionMap = Record<string,CollectionEntry>
export interface CollectionStats { total:number; pasted:number; repeated:number; missing:number; pct:number }
export interface StatusConfig { label:string; icon:string; color:string; bg:string; border:string }
export type StickerStatus = 'faltando'|'tenho'|'colada'|'repetida'

export const TEAMS: Team[] = [
  {id:'BRA',name:'Brasil',flag:'🇧🇷',conf:'CONMEBOL',color:'#009C3B'},
  {id:'ARG',name:'Argentina',flag:'🇦🇷',conf:'CONMEBOL',color:'#74ACDF'},
  {id:'COL',name:'Colômbia',flag:'🇨🇴',conf:'CONMEBOL',color:'#FCD116'},
  {id:'ECU',name:'Equador',flag:'🇪🇨',conf:'CONMEBOL',color:'#FFD100'},
  {id:'URU',name:'Uruguai',flag:'🇺🇾',conf:'CONMEBOL',color:'#5EB6E4'},
  {id:'VEN',name:'Venezuela',flag:'🇻🇪',conf:'CONMEBOL',color:'#CF142B'},
  {id:'USA',name:'Estados Unidos',flag:'🇺🇸',conf:'CONCACAF',color:'#002868'},
  {id:'MEX',name:'México',flag:'🇲🇽',conf:'CONCACAF',color:'#006847'},
  {id:'CAN',name:'Canadá',flag:'🇨🇦',conf:'CONCACAF',color:'#FF0000'},
  {id:'CRC',name:'Costa Rica',flag:'🇨🇷',conf:'CONCACAF',color:'#002B7F'},
  {id:'PAN',name:'Panamá',flag:'🇵🇦',conf:'CONCACAF',color:'#DA121A'},
  {id:'HON',name:'Honduras',flag:'🇭🇳',conf:'CONCACAF',color:'#0073CF'},
  {id:'JAM',name:'Jamaica',flag:'🇯🇲',conf:'CONCACAF',color:'#FED100'},
  {id:'GUA',name:'Guatemala',flag:'🇬🇹',conf:'CONCACAF',color:'#4997D0'},
  {id:'ESP',name:'Espanha',flag:'🇪🇸',conf:'UEFA',color:'#AA151B'},
  {id:'FRA',name:'França',flag:'🇫🇷',conf:'UEFA',color:'#002395'},
  {id:'ENG',name:'Inglaterra',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',conf:'UEFA',color:'#CF091B'},
  {id:'GER',name:'Alemanha',flag:'🇩🇪',conf:'UEFA',color:'#333333'},
  {id:'POR',name:'Portugal',flag:'🇵🇹',conf:'UEFA',color:'#006600'},
  {id:'NED',name:'Holanda',flag:'🇳🇱',conf:'UEFA',color:'#FF6600'},
  {id:'ITA',name:'Itália',flag:'🇮🇹',conf:'UEFA',color:'#003399'},
  {id:'BEL',name:'Bélgica',flag:'🇧🇪',conf:'UEFA',color:'#CC0000'},
  {id:'CRO',name:'Croácia',flag:'🇭🇷',conf:'UEFA',color:'#FF0000'},
  {id:'SUI',name:'Suíça',flag:'🇨🇭',conf:'UEFA',color:'#FF0000'},
  {id:'DEN',name:'Dinamarca',flag:'🇩🇰',conf:'UEFA',color:'#C60C30'},
  {id:'SRB',name:'Sérvia',flag:'🇷🇸',conf:'UEFA',color:'#C6363C'},
  {id:'AUT',name:'Áustria',flag:'🇦🇹',conf:'UEFA',color:'#ED2939'},
  {id:'SCO',name:'Escócia',flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',conf:'UEFA',color:'#003366'},
  {id:'TUR',name:'Turquia',flag:'🇹🇷',conf:'UEFA',color:'#E30A17'},
  {id:'UKR',name:'Ucrânia',flag:'🇺🇦',conf:'UEFA',color:'#005BBB'},
  {id:'MAR',name:'Marrocos',flag:'🇲🇦',conf:'CAF',color:'#C1272D'},
  {id:'SEN',name:'Senegal',flag:'🇸🇳',conf:'CAF',color:'#00853F'},
  {id:'EGY',name:'Egito',flag:'🇪🇬',conf:'CAF',color:'#CE1126'},
  {id:'NGA',name:'Nigéria',flag:'🇳🇬',conf:'CAF',color:'#008751'},
  {id:'CMR',name:'Camarões',flag:'🇨🇲',conf:'CAF',color:'#007A5E'},
  {id:'TUN',name:'Tunísia',flag:'🇹🇳',conf:'CAF',color:'#E70013'},
  {id:'MLI',name:'Mali',flag:'🇲🇱',conf:'CAF',color:'#009A00'},
  {id:'RSA',name:'África do Sul',flag:'🇿🇦',conf:'CAF',color:'#007A4D'},
  {id:'CIV',name:'Costa do Marfim',flag:'🇨🇮',conf:'CAF',color:'#F77F00'},
  {id:'JPN',name:'Japão',flag:'🇯🇵',conf:'AFC',color:'#BC002D'},
  {id:'KOR',name:'Coreia do Sul',flag:'🇰🇷',conf:'AFC',color:'#003478'},
  {id:'IRN',name:'Irã',flag:'🇮🇷',conf:'AFC',color:'#239F40'},
  {id:'KSA',name:'Arábia Saudita',flag:'🇸🇦',conf:'AFC',color:'#006C35'},
  {id:'AUS',name:'Austrália',flag:'🇦🇺',conf:'AFC',color:'#00843D'},
  {id:'IRQ',name:'Iraque',flag:'🇮🇶',conf:'AFC',color:'#007A3D'},
  {id:'JOR',name:'Jordânia',flag:'🇯🇴',conf:'AFC',color:'#CE1126'},
  {id:'IDN',name:'Indonésia',flag:'🇮🇩',conf:'AFC',color:'#CE1126'},
  {id:'NZL',name:'Nova Zelândia',flag:'🇳🇿',conf:'OFC',color:'#00247D'},
]

const P: Record<string,string[]> = {
  BRA:['Vinicius Jr.','Rodrygo','Endrick','Raphinha','Bruno Guimarães','Gabriel Martinelli','Casemiro','Alisson','Militão','Marquinhos','Danilo','Lucas Paquetá','Richarlison','Gabriel Jesus','Éderson','Fred'],
  ARG:['Julián Álvarez','Lautaro Martínez','Mac Allister','De Paul','Molina','Romero','Acuña','Paredes','Lo Celso','Dybala','Correa','Pezzella','Tagliafico','Musso','Rulli','Almada'],
  FRA:['Mbappé','Dembélé','Camavinga','Tchouaméni','T. Hernández','Upamecano','Maignan','Griezmann','M. Thuram','Koundé','Saliba','Pavard','Guendouzi','Coman','Diaby','Rabiot'],
  ESP:['Yamal','Pedri','Gavi','Rodri','Morata','Unai Simón','Carvajal','Le Normand','Laporte','D. Olmo','Williams','Fabián Ruiz','Ferran Torres','Joselu','Raya','M. Alonso'],
  ENG:['Bellingham','Kane','Saka','Rashford','Trippier','Walker','Maguire','Rice','Foden','Grealish','Pickford','Alexander-Arnold','Shaw','Gallagher','Gordon','Reece James'],
  GER:['Musiala','Wirtz','Gnabry','Sané','Havertz','Rüdiger','Neuer','Goretzka','Kimmich','Gündoğan','Füllkrug','Schlotterbeck','Andrich','Mittelstädt','Koch','Tah'],
  POR:['Ronaldo','Félix','Leão','B. Silva','Vitinha','Palhinha','Dias','Cancelo','Horta','R. Neves','Jota','Gonçalves','Patrício','Dalot','Pepe','B. Fernandes'],
  JPN:['Kubo','Mitoma','Doan','Endo','Morita','Yoshida','Gonda','Furuhashi','Maeda','Kamada','Tomiyasu','Ito','Ueda','Hirakawa','Kawasaki','Nishino'],
  KOR:['Son Heung-min','Lee Kang-in','Hwang Hee-chan','Kim Min-jae','Jung Woo-young','Hwang In-beom','Kim Seung-gyu','Lee Jae-sung','Cho Gue-sung','Na Sang-ho','Kim Jin-su','Oh Se-hun','Bae Jun-ho','Kwon Chang-hoon','Kim Young-gwon','Lee Young-jae'],
  MAR:['Hakimi','En-Nesyri','Boufal','Sabiri','Amrabat','Mazraoui','Bono','Aguerd','Ounahi','Aboukhlal','Benoun','El Yamiq','Saiss','Attiyat Allah','Dari','Chair'],
}
const INST=['Logo Copa 2026','Bola Oficial','Mascote Corazón','Troféu FIFA','MetLife Stadium','AT&T Stadium','SoFi Stadium',"Levi's Stadium",'BC Place','BMO Field','Estádio Azteca','Estádio Akron','Estádio BBVA','Rose Bowl','Gillette Stadium','Hard Rock Stadium','Lincoln Financial','Arrowhead Stadium','NRG Stadium','Q2 Stadium']

export function generateAllStickers(): Sticker[] {
  const s: Sticker[] = []
  INST.forEach((name,i) => s.push({id:`FIFA-${String(i+1).padStart(2,'0')}`,teamId:'FIFA',number:i+1,name,isSpecial:true,type:'inst'}))
  TEAMS.forEach(t => {
    const pl = P[t.id] ?? []
    s.push({id:`${t.id}-01`,teamId:t.id,number:1,name:'Escudo',isSpecial:true,type:'escudo'})
    s.push({id:`${t.id}-02`,teamId:t.id,number:2,name:'Panorâmica',isSpecial:false,type:'panoramica'})
    for(let i=0;i<16;i++) s.push({id:`${t.id}-${String(i+3).padStart(2,'0')}`,teamId:t.id,number:i+3,name:pl[i]??`Jogador ${i+1}`,isSpecial:false,type:'jogador'})
    s.push({id:`${t.id}-19`,teamId:t.id,number:19,name:'Uniforme Casa',isSpecial:false,type:'uniforme'})
    s.push({id:`${t.id}-20`,teamId:t.id,number:20,name:'Uniforme Fora',isSpecial:false,type:'uniforme'})
  })
  return s // 980 total
}

export const STATUS_CONFIG: Record<StickerStatus,StatusConfig> = {
  faltando:{label:'Faltando',icon:'⬜',color:'#6b93b8',bg:'#0d1f33',border:'#1e3a5a'},
  tenho:   {label:'Tenho',   icon:'📦',color:'#3b82f6',bg:'#091d40',border:'#1e3a8a'},
  colada:  {label:'Colada',  icon:'✅',color:'#00c850',bg:'#092a16',border:'#1a4a2a'},
  repetida:{label:'Repetida',icon:'🔄',color:'#ff9500',bg:'#2a1800',border:'#4a2e00'},
}

export const ACHIEVEMENTS: Achievement[] = [
  {id:'first_scan', icon:'📸',title:'Primeira Captura',      desc:'Escaneou sua primeira figurinha',         check:(s)=>s.total>=1},
  {id:'first_paste',icon:'📖',title:'Primeiras Páginas',     desc:'Colou a primeira figurinha no álbum',     check:(s)=>s.pasted>=1},
  {id:'brazil',     icon:'🇧🇷',title:'Orgulho Verde-Amarelo', desc:'Completou a seleção do Brasil',           check:(_,c)=>getTeamProgress('BRA',c)>=20},
  {id:'special',    icon:'✨',title:'Brilho Especial',        desc:'Tem uma figurinha especial metalizada',   check:(_,c)=>Object.keys(c).some(id=>id.startsWith('FIFA-')||id.endsWith('-01'))},
  {id:'trader',     icon:'🔄',title:'Negociante Nato',        desc:'Acumulou 10 figurinhas repetidas',        check:(s)=>s.repeated>=10},
  {id:'c100',       icon:'💯',title:'Centena',                desc:'Tem 100 ou mais figurinhas',              check:(s)=>s.total>=100},
  {id:'c500',       icon:'⚡',title:'Coleção de Elite',        desc:'Tem 500 ou mais figurinhas',              check:(s)=>s.total>=500},
  {id:'half',       icon:'🌟',title:'Metade do Caminho',      desc:'Completou 50% do álbum',                  check:(s)=>s.pct>=50},
  {id:'ninety',     icon:'🔥',title:'Quase Lá!',              desc:'Completou 90% do álbum',                  check:(s)=>s.pct>=90},
  {id:'complete',   icon:'🥇',title:'ÁLBUM COMPLETO!',         desc:'Parabéns! Álbum 100% completo!',          check:(s)=>s.pct>=100},
]

export function getTeamProgress(teamId:string,col:CollectionMap):number{
  let n=0; for(let i=1;i<=20;i++) if(col[`${teamId}-${String(i).padStart(2,'0')}`]) n++; return n
}
export function getStickerStatus(id:string,col:CollectionMap):StickerStatus{
  if(!col[id]) return 'faltando'
  if(col[id].pasted) return 'colada'
  if(col[id].quantity>1) return 'repetida'
  return 'tenho'
}
export function calcStats(all:Sticker[],col:CollectionMap):CollectionStats{
  const total=Object.keys(col).length
  return{total,pasted:Object.values(col).filter(s=>s.pasted).length,repeated:Object.keys(col).filter(id=>col[id].quantity>1).length,missing:all.length-total,pct:all.length?Math.round(total/all.length*100):0}
}
export function parseCodesFromText(text:string,validIds:Set<string>):string[]{
  return[...new Set(text.toUpperCase().split(/[,;\n\r\s]+/).filter(c=>c.length>3&&validIds.has(c)))]
}
export function generateCSV(col:CollectionMap,all:Sticker[],teamById:Record<string,Team>):string{
  return['ID,Seleção,Número,Nome,Status,Quantidade,Colada',...all.map(s=>{const t=teamById[s.teamId];const e=col[s.id];const st=getStickerStatus(s.id,col);return[s.id,`"${t?.name??'Especial'}"`,s.number,`"${s.name}"`,STATUS_CONFIG[st].label,e?.quantity??0,e?.pasted?'Sim':'Não'].join(',')})].join('\n')
}
