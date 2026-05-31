export interface Team { id:string; name:string; flag:string; conf:string; color:string; group:string }
export interface Sticker { id:string; teamId:string; number:number; name:string; isSpecial:boolean; type:string }
export interface Achievement { id:string; icon:string; title:string; desc:string; check:(s:CollectionStats,c:CollectionMap)=>boolean }
export interface CollectionEntry { quantity:number; pasted:boolean; addedAt:string }
export type CollectionMap = Record<string,CollectionEntry>
export interface CollectionStats { total:number; pasted:number; repeated:number; missing:number; pct:number }
export interface StatusConfig { label:string; icon:string; svg:string; color:string; bg:string; border:string }
export type StickerStatus = 'faltando'|'tenho'|'colada'|'repetida'

// 48 times na ordem exata do álbum Panini Copa 2026 (Grupos A–L)
export const TEAMS: Team[] = [
  // Grupo A
  {id:'MEX',name:'México',         flag:'🇲🇽',conf:'CONCACAF',color:'#006847',group:'A'},
  {id:'RSA',name:'África do Sul',  flag:'🇿🇦',conf:'CAF',     color:'#007A4D',group:'A'},
  {id:'KOR',name:'Coreia do Sul',  flag:'🇰🇷',conf:'AFC',     color:'#003478',group:'A'},
  {id:'CZE',name:'Tchéquia',       flag:'🇨🇿',conf:'UEFA',    color:'#D7141A',group:'A'},
  // Grupo B
  {id:'CAN',name:'Canadá',         flag:'🇨🇦',conf:'CONCACAF',color:'#FF0000',group:'B'},
  {id:'BIH',name:'Bósnia-Herz.',   flag:'🇧🇦',conf:'UEFA',    color:'#002395',group:'B'},
  {id:'QAT',name:'Qatar',          flag:'🇶🇦',conf:'AFC',     color:'#8D1B3D',group:'B'},
  {id:'SUI',name:'Suíça',          flag:'🇨🇭',conf:'UEFA',    color:'#FF0000',group:'B'},
  // Grupo C
  {id:'BRA',name:'Brasil',         flag:'🇧🇷',conf:'CONMEBOL',color:'#009C3B',group:'C'},
  {id:'MAR',name:'Marrocos',       flag:'🇲🇦',conf:'CAF',     color:'#C1272D',group:'C'},
  {id:'HAI',name:'Haiti',          flag:'🇭🇹',conf:'CONCACAF',color:'#00209F',group:'C'},
  {id:'SCO',name:'Escócia',        flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',conf:'UEFA',    color:'#003366',group:'C'},
  // Grupo D
  {id:'USA',name:'Estados Unidos', flag:'🇺🇸',conf:'CONCACAF',color:'#002868',group:'D'},
  {id:'PAR',name:'Paraguai',       flag:'🇵🇾',conf:'CONMEBOL',color:'#D52B1E',group:'D'},
  {id:'AUS',name:'Austrália',      flag:'🇦🇺',conf:'AFC',     color:'#00843D',group:'D'},
  {id:'TUR',name:'Turquia',        flag:'🇹🇷',conf:'UEFA',    color:'#E30A17',group:'D'},
  // Grupo E
  {id:'GER',name:'Alemanha',       flag:'🇩🇪',conf:'UEFA',    color:'#333333',group:'E'},
  {id:'CUW',name:'Curaçao',        flag:'🇨🇼',conf:'CONCACAF',color:'#003DA5',group:'E'},
  {id:'CIV',name:'Costa do Marfim',flag:'🇨🇮',conf:'CAF',     color:'#F77F00',group:'E'},
  {id:'ECU',name:'Equador',        flag:'🇪🇨',conf:'CONMEBOL',color:'#FFD100',group:'E'},
  // Grupo F
  {id:'NED',name:'Holanda',        flag:'🇳🇱',conf:'UEFA',    color:'#FF6600',group:'F'},
  {id:'JPN',name:'Japão',          flag:'🇯🇵',conf:'AFC',     color:'#BC002D',group:'F'},
  {id:'SWE',name:'Suécia',         flag:'🇸🇪',conf:'UEFA',    color:'#006AA7',group:'F'},
  {id:'TUN',name:'Tunísia',        flag:'🇹🇳',conf:'CAF',     color:'#E70013',group:'F'},
  // Grupo G
  {id:'BEL',name:'Bélgica',        flag:'🇧🇪',conf:'UEFA',    color:'#CC0000',group:'G'},
  {id:'EGY',name:'Egito',          flag:'🇪🇬',conf:'CAF',     color:'#CE1126',group:'G'},
  {id:'IRN',name:'Irã',            flag:'🇮🇷',conf:'AFC',     color:'#239F40',group:'G'},
  {id:'NZL',name:'Nova Zelândia',  flag:'🇳🇿',conf:'OFC',     color:'#00247D',group:'G'},
  // Grupo H
  {id:'ESP',name:'Espanha',        flag:'🇪🇸',conf:'UEFA',    color:'#AA151B',group:'H'},
  {id:'CPV',name:'Cabo Verde',     flag:'🇨🇻',conf:'CAF',     color:'#003893',group:'H'},
  {id:'KSA',name:'Arábia Saudita', flag:'🇸🇦',conf:'AFC',     color:'#006C35',group:'H'},
  {id:'URU',name:'Uruguai',        flag:'🇺🇾',conf:'CONMEBOL',color:'#5EB6E4',group:'H'},
  // Grupo I
  {id:'FRA',name:'França',         flag:'🇫🇷',conf:'UEFA',    color:'#002395',group:'I'},
  {id:'SEN',name:'Senegal',        flag:'🇸🇳',conf:'CAF',     color:'#00853F',group:'I'},
  {id:'IRQ',name:'Iraque',         flag:'🇮🇶',conf:'AFC',     color:'#007A3D',group:'I'},
  {id:'NOR',name:'Noruega',        flag:'🇳🇴',conf:'UEFA',    color:'#EF2B2D',group:'I'},
  // Grupo J
  {id:'ARG',name:'Argentina',      flag:'🇦🇷',conf:'CONMEBOL',color:'#74ACDF',group:'J'},
  {id:'ALG',name:'Argélia',        flag:'🇩🇿',conf:'CAF',     color:'#006233',group:'J'},
  {id:'AUT',name:'Áustria',        flag:'🇦🇹',conf:'UEFA',    color:'#ED2939',group:'J'},
  {id:'JOR',name:'Jordânia',       flag:'🇯🇴',conf:'AFC',     color:'#CE1126',group:'J'},
  // Grupo K
  {id:'POR',name:'Portugal',       flag:'🇵🇹',conf:'UEFA',    color:'#006600',group:'K'},
  {id:'COD',name:'Rep. Congo',     flag:'🇨🇩',conf:'CAF',     color:'#007FFF',group:'K'},
  {id:'UZB',name:'Uzbequistão',    flag:'🇺🇿',conf:'AFC',     color:'#1EB53A',group:'K'},
  {id:'COL',name:'Colômbia',       flag:'🇨🇴',conf:'CONMEBOL',color:'#FCD116',group:'K'},
  // Grupo L
  {id:'ENG',name:'Inglaterra',     flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',conf:'UEFA',    color:'#CF091B',group:'L'},
  {id:'CRO',name:'Croácia',        flag:'🇭🇷',conf:'UEFA',    color:'#FF0000',group:'L'},
  {id:'GHA',name:'Gana',           flag:'🇬🇭',conf:'CAF',     color:'#006B3F',group:'L'},
  {id:'PAN',name:'Panamá',         flag:'🇵🇦',conf:'CONCACAF',color:'#DA121A',group:'L'},
]

// Seção introdutória do álbum: FWC-00 (Panini Logo) + FWC-01..FWC-19 (todos foil)
const INST = [
  'Panini Logo',                        // FWC-00
  'Emblema Oficial 1/2',                // FWC-01
  'Emblema Oficial 2/2',                // FWC-02
  'Mascotes Oficiais',                  // FWC-03
  'Slogan Oficial',                     // FWC-04
  'Bola Oficial',                       // FWC-05
  'Canadá — País Sede',                 // FWC-06
  'México — País Sede',                 // FWC-07
  'EUA — País Sede',                    // FWC-08
  'FIFA Museum — Itália 1934',          // FWC-09
  'FIFA Museum — Uruguai 1950',         // FWC-10
  'FIFA Museum — Alemanha Ocid. 1954',  // FWC-11
  'FIFA Museum — Brasil 1962',          // FWC-12
  'FIFA Museum — Alemanha Ocid. 1974',  // FWC-13
  'FIFA Museum — Argentina 1986',       // FWC-14
  'FIFA Museum — Brasil 1994',          // FWC-15
  'FIFA Museum — Brasil 2002',          // FWC-16
  'FIFA Museum — Itália 2006',          // FWC-17
  'FIFA Museum — Alemanha 2014',        // FWC-18
  'FIFA Museum — Argentina 2022',       // FWC-19
]

// Layout por time: índices 0-10 → slots 02-12 (jogadores 1-11)
//                  índices 11-17 → slots 14-20 (jogadores 12-18)
// Slot 01 = Escudo (foil) | Slot 13 = Foto do Time | Sem uniformes em 2026
const P: Record<string, string[]> = {
  MEX: ['Luis Malagón','Johan Vásquez','Jorge Sánchez','César Montes','Jesús Gallardo','Israel Reyes','Diego Laínez','Carlos Rodríguez','Edson Álvarez','Orbelín Pineda','Marcel Ruiz','Érick Sánchez','Hirving Lozano','Santiago Giménez','Raúl Jiménez','Alexis Vega','Roberto Alvarado','César Huerta'],
  RSA: ['Ronwen Williams','Sipho Chaine','Aubrey Modiba','Samukele Kabini','Mbekezeli Mbokazi','Khulumani Ndamane','Siyabonga Ngezana','Khuliso Mudau','Nkosinathi Sibisi','Teboho Mokoena','Thalente Mbatha','Bathasi Aubaas','Yaya Sithole','Sipho Mbule','Lyle Foster','Iqraam Rayners','Mohau Nkota','Oswin Appollis'],
  KOR: ['Hyeonwoo Jo','Seunggyu Kim','Minjae Kim','Yumin Cho','Youngwoo Seol','Hanbeom Lee','Taeseok Lee','Myungjae Lee','Jaesung Lee','Inbeom Hwang','Kangin Lee','Seungho Paik','Jens Castrop','Donggyeong Lee','Guesung Cho','Heung-min Son','Heechan Hwang','Hyeon-gyu Oh'],
  CZE: ['Matej Kovář','Jindřich Staněk','Ladislav Krejčí','Vladimír Coufal','Jaroslav Zelený','Tomáš Holeš','David Zima','Michal Sadílek','Lukáš Provod','Lukáš Červ','Tomáš Souček','Pavel Šulc','Matěj Vydra','Vasil Kušej','Tomáš Chorý','Václav Černý','Adam Hložek','Patrik Schick'],
  CAN: ['Maxime Crépeau','Alphonso Davies','Alistair Johnston','Samuel Adekugbe','Richie Laryea','Derek Cornelius','Moïse Bombito','Kamal Miller','Stephen Eustáquio','Ismaël Koné','Jonathan Osorio','Jacob Shaffelburg','Mathieu Choinière','Niko Sigur','Tajon Buchanan','Liam Millar','Cyle Larin','Jonathan David'],
  BIH: ['Nikola Vasilj','Amer Dedić','Sead Kolašinac','Tarik Muharemović','Nihad Mujakić','Nikola Katić','Amir Hadžiahmetović','Benjamin Tahirović','Armin Gigović','Ivan Šunjić','Ivan Bašić','Dženis Burnić','Esmir Bajraktarević','Amar Memić','Ermedin Demirović','Edin Džeko','Samed Bazdar','Haris Tabaković'],
  QAT: ['Meshaal Barsham','Sultan Albrake','Lucas Mendes','Homam Ahmed','Boualem Khoukhi','Pedro Miguel','Tarek Salman','Mohamed Al-Mannai','Karim Boudiaf','Assim Madibo','Ahmed Fatehi','Mohammed Waad','Abdulaziz Hatem','Hassan Al-Haydos','Edmilson Junior','Akram Hassan Afif','Ahmed Al-Ganehi','Almoez Ali'],
  SUI: ['Gregor Kobel','Yvon Mvogo','Manuel Akanji','Ricardo Rodríguez','Nico Elvedi','Aurèle Amenda','Silvan Widmer','Granit Xhaka','Denis Zakaria','Remo Freuler','Fabian Rieder','Ardon Jashari','Johan Manzambi','Michel Aebischer','Breel Embolo','Ruben Vargas','Dan Ndoye','Zeki Amdouni'],
  BRA: ['Alisson','Bento','Marquinhos','Éder Militão','Gabriel Magalhães','Danilo','Wesley','Lucas Paquetá','Casemiro','Bruno Guimarães','Luiz Henrique','Vinícius Júnior','Rodrygo','João Pedro','Matheus Cunha','Gabriel Martinelli','Raphinha','Estêvão'],
  MAR: ['Yassine Bounou','Munir El Kajoui','Achraf Hakimi','Noussair Mazraoui','Nayef Aguerd','Romain Saïss','Jawad El Yamiq','Adam Masina','Sofyan Amrabat','Azzedine Ounahi','Eliesse Ben Seghir','Bilal El Khannous','Ismail Saibari','Youssef En-Nesyri','Abde Ezzalzouli','Soufiane Rahimi','Brahim Díaz','Ayoub El Kaabi'],
  HAI: ['Johny Placide','Carlens Arcus','Martin Expérience','Jean-Kevin Duverne','Ricardo Adé','Duke Lacroix','Garven Metusala','Hannes Delcroix','Leverton Pierre','Danley Jean Jacques','Jean-Ricner Bellegarde','Christopher Attys','Derrick Etienne Jr','Josue Casimir','Ruben Providence','Duckens Nazon','Louicius Deedson','Frantzdy Pierrot'],
  SCO: ['Angus Gunn','Jack Hendry','Kieran Tierney','Aaron Hickey','Andrew Robertson','Scott McKenna','John Souttar','Anthony Ralston','Grant Hanley','Scott McTominay','Billy Gilmour','Lewis Ferguson','Ryan Christie','Kenny McLean','John McGinn','Lyndon Dykes','Che Adams','Ben Doak'],
  USA: ['Matt Freese','Chris Richards','Tim Ream','Mark McKenzie','Alex Freeman','Antonee Robinson','Tyler Adams','Tanner Tessmann','Weston McKennie','Christian Roldan','Timothy Weah','Diego Luna','Malik Tillman','Christian Pulisic','Brenden Aaronson','Ricardo Pepi','Haji Wright','Folarin Balogun'],
  PAR: ['Roberto Fernández','Orlando Gill','Gustavo Gómez','Fabián Balbuena','Juan José Cáceres','Omar Alderete','Junior Alonso','Mathías Villasanti','Diego Gómez','Damián Bobadilla','Andrés Cubas','Matías Galarza Fonda','Julio Enciso','Alejandro Romero Gamarra','Miguel Almirón','Ramón Sosa','Ángel Romero','Antonio Sanabria'],
  AUS: ['Mathew Ryan','Joe Gauci','Harry Souttar','Alessandro Circati','Jordan Bos','Aziz Behich','Cameron Burgess','Lewis Miller','Milos Degenek','Jackson Irvine','Riley McGree',"Aiden O'Neill",'Connor Metcalfe','Patrick Yazbek','Craig Goodwin','Kusini Yengi','Nestory Irankunda','Mohamed Touré'],
  TUR: ['Uğurcan Çakır','Mert Müldür','Zeki Çelik','Abdülkerim Bardakçı','Çağlar Söyüncü','Merih Demiral','Ferdi Kadıoğlu','Kaan Ayhan','İsmail Yüksek','Hakan Çalhanoğlu','Orkun Kökçü','Arda Güler','İrfan Can Kahveci','Yunus Akgün','Can Uzun','Barış Alper Yılmaz','Kerem Aktürkoğlu','Kenan Yıldız'],
  GER: ['Marc-André ter Stegen','Jonathan Tah','David Raum','Nico Schlotterbeck','Antonio Rüdiger','Waldemar Anton','Ridle Baku','Maximilian Mittelstädt','Joshua Kimmich','Florian Wirtz','Felix Nmecha','Leon Goretzka','Jamal Musiala','Serge Gnabry','Kai Havertz','Leroy Sané','Karim Adeyemi','Nick Woltemade'],
  CUW: ['Eloy Room','Armando Obispo','Sherel Floranus','Jurien Gaari','Joshua Brenet','Roshon van Eijma','Shurandy Sambo','Livano Comenencia','Godfried Roemeratoe','Juninho Bacuna','Leandro Bacuna','Tahith Chong','Kenji Gorre','Jearl Margaritha','Jurgen Locadia','Jeremy Antonisse','Gervane Kastaneer','Sontje Hansen'],
  CIV: ['Yahia Fofana','Ghislain Konan','Wilfried Singo','Odilon Kossounou','Evan Ndicka','Willy Boly','Emmanuel Agbadou','Ousmane Diomande','Franck Kessié','Seko Fofana','Ibrahim Sangaré','Jean-Philippe Gbamin','Amad Diallo','Sébastien Haller','Simon Adingra','Yan Diomande','Evann Guessand','Oumar Diakite'],
  ECU: ['Hernán Galíndez','Gonzalo Valle','Piero Hincapié','Pervis Estupiñán','Willian Pacho','Ángelo Preciado','Joel Ordóñez','Moisés Caicedo','Alan Franco','Kendry Páez','Pedro Vite','John Veboah','Leonardo Campana','Gonzalo Plata','Nilson Angulo','Alan Minda','Kevin Rodríguez','Enner Valencia'],
  NED: ['Bart Verbruggen','Virgil van Dijk','Micky van de Ven','Jurrien Timber','Denzel Dumfries','Nathan Aké','Jeremie Frimpong','Jan Paul van Hecke','Tijjani Reijnders','Ryan Gravenberch','Teun Koopmeiners','Frenkie de Jong','Xavi Simons','Justin Kluivert','Memphis Depay','Donyell Malen','Wout Weghorst','Cody Gakpo'],
  JPN: ['Zion Suzuki','Henry Hiroki Mochizuki','Ayumu Seko','Junnosuke Suzuki','Shogo Taniguchi','Tsuyoshi Watanabe','Kaishu Sano','Yuki Soma','Ao Tanaka','Daichi Kamada','Takefusa Kubo','Ritsu Doan','Keito Nakamura','Takumi Minamino','Shuto Machino','Junya Ito','Koki Ogawa','Ayase Ueda'],
  SWE: ['Victor Johansson','Isak Hien','Gabriel Gudmundsson','Emil Holm','Victor Nilsson Lindelöf','Gustaf Lagerbielke','Lucas Bergvall','Hugo Larsson','Jesper Karlström','Yasin Ayari','Mattias Svanberg','Daniel Svensson','Ken Sema','Roony Bardghji','Dejan Kulusevski','Anthony Elanga','Alexander Isak','Viktor Gyökeres'],
  TUN: ['Bechir Ben Said','Aymen Dahmen','Yan Valery','Montassar Talbi','Yassine Meriah','Ali Abdi','Dylan Bronn','Ellyes Skhiri','Aïssa Laidouni','Ferjani Sassi','Mohamed Ali Ben Romdhane','Hannibal Mejbri','Elias Achouri','Elias Saad','Hazem Mastouri','Ismael Gharbi','Sayfallah Ltaief','Naim Sliti'],
  BEL: ['Thibaut Courtois','Arthur Theate','Timothy Castagne','Zeno Debast','Brandon Mechele','Maxim De Cuyper','Thomas Meunier','Youri Tielemans','Amadou Onana','Nicolas Raskin','Alexis Saelemaekers','Hans Vanaken','Kevin De Bruyne','Jérémy Doku','Charles De Ketelaere','Leandro Trossard','Loïs Openda','Romelu Lukaku'],
  EGY: ['Mohamed El-Shenawy','Mohamed Hany','Mohamed Hamdy','Yasser Ibrahim','Khaled Sobhi','Ramy Rabia','Hossam Abdelmaguid','Ahmed Fatouh','Marwan Attia','Zizo','Hamdy Fathy','Mohamed Lasheen','Emam Ashour','Osama Faisal','Mohamed Salah','Mostafa Mohamed','Trezeguet','Omar Marmoush'],
  IRN: ['Alireza Beiranvand','Morteza Pouraliganji','Ehsan Hajsafi','Milad Mohammadi','Shojae Khalilzadeh','Ramin Rezaeian','Hossein Kanaani','Sadegh Moharrami','Saleh Hardani','Saeed Ezatolahi','Saman Ghoddos','Omid Noorafkan','Roozbeh Cheshmi','Mohammad Mohebi','Sardar Azmoun','Mehdi Taremi','Alireza Jahanbakhsh','Ali Gholizadeh'],
  NZL: ['Max Crocombe Payne','Alex Paulsen','Michael Boxall','Liberato Cacace','Tim Payne','Tyler Bindon','Francis de Vries','Finn Surman','Joe Bell','Sarpreet Singh','Ryan Thomas','Matthew Garbett','Marko Stamenić','Ben Old','Chris Wood','Elijah Just','Callum McCowatt','Kosta Barbarouses'],
  ESP: ['Unai Simón','Robin Le Normand','Aymeric Laporte','Dean Huijsen','Pedro Porro','Dani Carvajal','Marc Cucurella','Martín Zubimendi','Rodri','Pedri','Fabián Ruiz','Mikel Merino','Lamine Yamal','Dani Olmo','Nico Williams','Ferran Torres','Álvaro Morata','Mikel Oyarzabal'],
  CPV: ['Vozinha','Logan Costa','Pico','Diney','Steven Moreira','Wagner Pina','Joao Paulo','Yannick Semedo','Kevin Pina','Patrick Andrade','Jamiro Monteiro','Deroy Duarte','Garry Rodrigues','Jovane Cabral','Ryan Mendes','Dailon Livramento','Willy Semedo','Bebé'],
  KSA: ['Nawaf Alaqidi','Abdulrahman Al-Sanbi','Saud Abdulhamid','Nawaf Bouwashl','Jihad Thakri','Moteb Al-Harbi','Hassan Altambakti','Musab Aljuwayr','Ziyad Aljohani','Abdullah Alkhaibari','Nasser Aldawsari','Saleh Abu Alshamat','Marwan Alsahafi','Salem Aldawsari','Abdulrahman Al-Aboud','Feras Akbrikan','Saleh Alshehri','Abdullah Al-Hamdan'],
  URU: ['Sergio Rochet','Santiago Mele','Ronald Araújo','José María Giménez','Sebastián Cáceres','Mathías Olivera','Guillermo Varela','Nahitán Nández','Federico Valverde','Giorgian De Arrascaeta','Rodrigo Bentancur','Manuel Ugarte','Nicolás De la Cruz','Maximiliano Araújo','Darwin Núñez','Federico Viñas','Rodrigo Aguirre','Facundo Pellistri'],
  FRA: ['Mike Maignan','Théo Hernández','William Saliba','Jules Koundé','Ibrahima Konaté','Dayot Upamecano','Lucas Digne','Aurélien Tchouaméni','Eduardo Camavinga','Manu Koné','Adrien Rabiot','Michael Olise','Ousmane Dembélé','Bradley Barcola','Désiré Doué','Kingsley Coman','Hugo Ekitike','Kylian Mbappé'],
  SEN: ['Edouard Mendy','Yehvann Diouf','Moussa Niakhaté','Abdoulaye Seck','Ismail Jakobs','El Hadji Malick Diouf','Kalidou Koulibaly','Idrissa Gana Gueye','Pape Matar Sarr','Pape Gueye','Habib Diarra','Lamine Camara','Sadio Mané','Ismaïla Sarr','Boulaye Dia','Iliman Ndiaye','Nicolas Jackson','Krepin Diatta'],
  IRQ: ['Jalal Hassan','Rebin Sulaka','Hussein Ali','Akam Hashem','Merchas Doski','Zaid Tahseen','Manaf Younis','Zidane Iqbal','Amir Al-Ammari','Ibrahim Bavesh','Ali Jasim','Youssef Amyn','Aimar Sher','Marko Farji','Osama Rashid','Ali Al-Hamadi','Aymen Hussein','Mohanad Ali'],
  NOR: ['Ørjan Nyland','Julian Ryerson','Leo Østigård','Kristoffer Vassbakk Ajer','Marcus Holmgren Pedersen','David Møller Wolfe','Torbjørn Heggem','Morten Thorsby','Martin Ødegaard','Sander Berge','Andreas Schjelderup','Patrick Berg','Erling Haaland','Alexander Sørloth','Aron Dønnum','Jørgen Strand Larsen','Antonio Nusa','Oscar Bobb'],
  ARG: ['Emiliano Martínez','Nahuel Molina','Cristian Romero','Nicolás Otamendi','Nicolás Tagliafico','Leonardo Balerdi','Enzo Fernández','Alexis Mac Allister','Rodrigo De Paul','Exequiel Palacios','Leandro Paredes','Nico Paz','Franco Mastantuono','Nico González','Lionel Messi','Julián Álvarez','Lautaro Martínez','Ángel Correa'],
  ALG: ['Alexis Guendouz','Ramy Bensebaini','Youcef Atal','Rayan Aït-Nouri','Mohamed Amine Tougai','Aïssa Mandi','Ismael Bennacer','Houssem Aquar','Hicham Boudaoui','Ramiz Zerrouki','Nabil Bentalab','Farés Chaibi','Riyad Mahrez','Saïd Benrahma','Anis Hadj Moussa','Amine Gouiri','Baghdad Bounedjah','Mohammed Amoura'],
  AUT: ['Alexander Schlager','Patrick Pentz','David Alaba','Kevin Danso','Philipp Lienhart','Stefan Posch','Phillipp Mwene','Alexander Prass','Xaver Schlager','Marcel Sabitzer','Konrad Laimer','Florian Grillitsch','Nicolas Seiwald','Romano Schmid','Patrick Wimmer','Christoph Baumgartner','Michael Gregoritsch','Marko Arnautović'],
  JOR: ['Yazeed Abulaila','Ihsan Haddad','Mohammad Abu Hashish','Yazan Al-Arab','Abdallah Nasib','Saleem Obaid','Mohammad Abualnadi','Ibrahim Saadeh','Nizar Al-Rashdan','Noor Al-Rawabdeh','Mohannad Abu Taha','Amer Jamous','Musa Al-Taamari','Yazan Al-Naimat','Mahmoud Al-Mardi','Ali Olwan','Mohammad Abu Zrayq','Ibrahim Sabra'],
  POR: ['Diogo Costa','José Sá','Rúben Dias','João Cancelo','Diogo Dalot','Nuno Mendes','Gonçalo Inácio','Bernardo Silva','Bruno Fernandes','Rúben Neves','Vitinha','João Neves','Cristiano Ronaldo','Francisco Trincão','João Félix','Gonçalo Ramos','Pedro Neto','Rafael Leão'],
  COD: ['Lionel Mpasi','Aaron Wan-Bissaka','Axel Tuanzebe','Arthur Masuaku','Chancel Mbemba','Joris Kayembe','Charles Pickel',"Ngal'ayel Mukau",'Edo Kayembe','Samuel Moutoussamy','Noah Sadiki','Théo Bongonda','Meschak Elia','Yoane Wissa','Brian Cipenga','Fiston Mayele','Cédric Bakambu','Nathanaël Mbuku'],
  UZB: ['Utkir Yusupov','Farrukh Savfiev','Sherzod Nasrullaev','Umar Eshmurodov','Husniddin Aliqulov','Rustamjon Ashurmatov','Khojiakbar Alijonov','Abdukodir Khusanov','Odiljon Hamrobekov','Otabek Shukurov','Jamshid Iskanderov','Azizbek Turgunboev','Khojimat Erkinov','Eldor Shomurodov','Oston Urunov','Jaloliddin Masharipov','Igor Sergeev','Jakhongir Sidikov'],
  COL: ['Camilo Vargas','David Ospina','Dávinson Sánchez','Yerry Mina','Daniel Muñoz','Johan Mojica','Jhon Lucumí','Santiago Arias','Jefferson Lerma','Kevin Castaño','Richard Ríos','James Rodríguez','Juan Fernando Quintero','Jorge Carrascal','Jhon Arias','Jhon Córdoba','Luis Suárez','Luis Díaz'],
  ENG: ['Jordan Pickford','John Stones','Marc Guéhi','Ezri Konsa','Trent Alexander-Arnold','Reece James','Dan Burn','Jordan Henderson','Declan Rice','Jude Bellingham','Cole Palmer','Morgan Rogers','Anthony Gordon','Phil Foden','Bukayo Saka','Harry Kane','Marcus Rashford','Ollie Watkins'],
  CRO: ['Dominik Livaković','Duje Ćaleta-Car','Joško Gvardiol','Josip Stanišić','Luka Vušković','Josip Šutalo','Kristijan Jakić','Luka Modrić','Mateo Kovačić','Martin Baturina','Lovro Majer','Mario Pašalić','Petar Sučić','Ivan Perišić','Marco Pašalić','Ante Budimir','Andrej Kramarić','Franjo Ivanović'],
  GHA: ['Lawrence Ati Zigi','Tariq Lamptey','Mohammed Salisu','Alidu Seidu','Alexander Djiku','Gideon Mensah','Caleb Yirenkyi','Abdul Fatawu Issahaku','Thomas Partey','Salis Abdul Samed','Kamaldeen Sulemana','Mohammed Kudus','Iñaki Williams','Jordan Ayew','André Ayew','Joseph Paintsil','Osman Bukari','Antoine Semenyo'],
  PAN: ['Orlando Mosquera','Luis Mejía','Fidel Escobar','Andrés Andrade','Michael Amir Murillo','Eric Davis','José Córdoba','César Blackman','Cristian Martínez','Aníbal Godoy','Adalberto Carrasquilla','Édgar Bárcenas','Carlos Harvey','Ismael Díaz','José Fajardo','Cecilio Waterman','José Luiz Rodríguez','Alberto Quintero'],
}

export function generateAllStickers(): Sticker[] {
  const s: Sticker[] = []
  // Seção FWC: 20 stickers (FWC-00 a FWC-19), todos foil
  INST.forEach((name, i) => s.push({
    id: `FWC-${String(i).padStart(2,'0')}`,
    teamId: 'FWC', number: i, name, isSpecial: true, type: 'inst'
  }))
  // Times: 48 × 20 stickers = 960
  TEAMS.forEach(t => {
    const pl = P[t.id] ?? []
    s.push({id:`${t.id}-01`,teamId:t.id,number:1,name:'Escudo',isSpecial:true,type:'escudo'})
    for(let i=0;i<11;i++)
      s.push({id:`${t.id}-${String(i+2).padStart(2,'0')}`,teamId:t.id,number:i+2,name:pl[i]??`Jogador ${i+1}`,isSpecial:false,type:'jogador'})
    s.push({id:`${t.id}-13`,teamId:t.id,number:13,name:'Foto do Time',isSpecial:false,type:'foto'})
    for(let i=11;i<18;i++)
      s.push({id:`${t.id}-${String(i+3).padStart(2,'0')}`,teamId:t.id,number:i+3,name:pl[i]??`Jogador ${i+1}`,isSpecial:false,type:'jogador'})
  })
  return s // 20 + 960 = 980 total
}

export const STATUS_CONFIG: Record<StickerStatus,StatusConfig> = {
  faltando:{label:'Faltando',icon:'⬜',svg:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="#6b93b8" stroke-width="1.5"/></svg>',color:'#6b93b8',bg:'#0d1f33',border:'#1e3a5a'},
  tenho:   {label:'Tenho',   icon:'📦',svg:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" fill="#3b82f6"/></svg>',color:'#3b82f6',bg:'#091d40',border:'#1e3a8a'},
  colada:  {label:'Colada',  icon:'✅',svg:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5l3 3 6-6" stroke="#00c850" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',color:'#00c850',bg:'#092a16',border:'#1a4a2a'},
  repetida:{label:'Repetida',icon:'🔄',svg:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 4h8M9 2l2 2-2 2" stroke="#ff9500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 10H3M5 8l-2 2 2 2" stroke="#ff9500" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',color:'#ff9500',bg:'#2a1800',border:'#4a2e00'},
}

export const ACHIEVEMENTS: Achievement[] = [
  {id:'first_scan', icon:'📸',title:'Primeira Captura',       desc:'Escaneou sua primeira figurinha',          check:(s)=>s.total>=1},
  {id:'first_paste',icon:'📖',title:'Primeiras Páginas',      desc:'Colou a primeira figurinha no álbum',      check:(s)=>s.pasted>=1},
  {id:'brazil',     icon:'🇧🇷',title:'Orgulho Verde-Amarelo',  desc:'Completou a seleção do Brasil',            check:(_,c)=>getTeamProgress('BRA',c)>=20},
  {id:'special',    icon:'✨',title:'Brilho Especial',         desc:'Tem uma figurinha especial metalizada',    check:(_,c)=>Object.keys(c).some(id=>id.startsWith('FWC-')||id.endsWith('-01'))},
  {id:'trader',     icon:'🔄',title:'Negociante Nato',         desc:'Acumulou 10 figurinhas repetidas',         check:(s)=>s.repeated>=10},
  {id:'c100',       icon:'💯',title:'Centena',                 desc:'Tem 100 ou mais figurinhas',               check:(s)=>s.total>=100},
  {id:'c500',       icon:'⚡',title:'Coleção de Elite',         desc:'Tem 500 ou mais figurinhas',               check:(s)=>s.total>=500},
  {id:'half',       icon:'🌟',title:'Metade do Caminho',       desc:'Completou 50% do álbum',                   check:(s)=>s.pct>=50},
  {id:'ninety',     icon:'🔥',title:'Quase Lá!',               desc:'Completou 90% do álbum',                   check:(s)=>s.pct>=90},
  {id:'complete',   icon:'🥇',title:'ÁLBUM COMPLETO!',          desc:'Parabéns! Álbum 100% completo!',           check:(s)=>s.pct>=100},
]

export function getTeamProgress(teamId:string,col:CollectionMap):number{
  let n=0; for(let i=1;i<=20;i++) if(col[`${teamId}-${String(i).padStart(2,'0')}`]) n++; return n
}
export function getGroupProgress(group:string,col:CollectionMap):{owned:number;total:number}{
  const teams=TEAMS.filter(t=>t.group===group)
  return{owned:teams.reduce((s,t)=>s+getTeamProgress(t.id,col),0),total:teams.length*20}
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
