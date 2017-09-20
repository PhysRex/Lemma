

var intervalID, soundID;
var i=0 , j=0, k=0;
// console.log("K", k);
var timeInterval = 1000;

function phrase() {
  function category() {
    var cat = document.querySelector(".category");
    var opt = cat.options[cat.selectedIndex].value;
    return phrases[opt];
  }
  return category;
}

function randomArr(length, maxNum) {
  // return array of length *length*,
  //of random numbers from [0, maxNum]
  
  // maxNum -= 1;
  var arr = [];
  for (var i = 0; i<length; i++) {
    x = Math.round(Math.random()*maxNum);
    arr.push(x);
  }
  return arr;
}

function menu() {
  var splash = document.querySelector(".splash");
  var settings = document.querySelector(".settings");
  splash.classList.toggle("hide");
  settings.classList.toggle("hide");
}

function menuExit() {
  var splash = document.querySelector(".splash");
  var settings = document.querySelector(".settings");
  splash.classList.toggle("hide");
  settings.classList.toggle("hide");

  reset();
}

function reset() {
  i=0 , j=0, k=0;
  
  clearInterval(intervalID);
  totalTime = timeInFunc();  

  // reset all settings
  next();

  // play sound
  plays(totalTime);

  var timerElem = document.querySelector(".timer");
  timerElem.innerHTML = totalTime() + ":00";

  intervalID = setInterval(timer, timeInterval);
}

function start() {
  var splash = document.querySelector(".splash");
  var game = document.querySelector(".game");
  splash.classList.toggle("hide");
  game.classList.toggle("hide");

  reset();
}

function startReturn() {  
  var splash = document.querySelector(".splash");
  var game = document.querySelector(".game");
  splash.classList.toggle("hide");
  game.classList.toggle("hide");

  // reset timer and clear interval 
  clearInterval(intervalID);
  totalTime = timeInFunc();  
}

function next() {
  var lemma = document.querySelector(".lemma");
  lemma.innerHTML = "";

  var lemmas = phrase();

  var rand = randomArr(1,lemmas().length-1)[0];
  lemma.innerHTML = lemmas()[rand];
  lemmas().splice(rand,1);

}

function padZero(num) {
  num = parseInt(num);
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

function timeInFunc() {
  function timeClosure() {
    return document.querySelector("#timeIn").value;    
  }
  return timeClosure;
}

// total time per round (in mins)
var totalTime = timeInFunc();

function countdown([min, sec]) {
  // returns input time minus 1 sec.
  // console.log("MINS:", min, "SECS:", sec);
  var result;
  min = parseInt(min);
  sec = parseInt(sec);

  if (min === 0 && sec === 0) {
    min = "0";
    sec = "00";    
  } else {
    if (sec>0) {
    sec = padZero(sec-1);
    } else {
      min = (min-1).toString();
      sec = "59";
    }
  }
   
  return [min.toString(), sec.toString()];
}

function timer() {
  var timerElem = document.querySelector(".timer");
  timerElem.innerHTML = totalTime[0] + ":" + totalTime[1];
  if (totalTime[0]==="0" && totalTime[1]==="00") {
    // play end of round sound
    soundEnd();

    timerElem.innerHTML = "round over";    

    // open score modal
    modal(1);

  } else {
    totalTime = (typeof totalTime === "function") ? countdown(totalTime()) : countdown(totalTime);
    timerElem.innerHTML = totalTime[0] + ":" + totalTime[1];

    //play sound faster
    if (parseInt(totalTime[0]) === 0 && parseInt(totalTime[1]) < 30 && i===0) {
      i++;
      console.log("faster!:", parseInt(totalTime[0]),":", parseInt(totalTime[1]) );
      clearInterval(soundID);
      plays(totalTime);
    }

    if (parseInt(totalTime[0]) === 0 && parseInt(totalTime[1]) < 15 && j===0) {
      j++;
      console.log("MUCH faster!:", parseInt(totalTime[0]),":", parseInt(totalTime[1]) );
      clearInterval(soundID);
      plays(totalTime);
    }

    if (parseInt(totalTime[0]) === 0 && parseInt(totalTime[1]) < 5 && k===0) {
      k++;
      console.log("MUCH MUCH faster!:", parseInt(totalTime[0]),":", parseInt(totalTime[1]) );
      clearInterval(soundID);
      plays(totalTime);
    }
  }

  // console.log(timerElem.innerHTML);
}

// console.log("timeParam:", totalTime(), totalTime()[0], totalTime()[1]);

function plays(time) {
  time = (typeof time === "function") ? time() : time;
  var mins = parseInt(time[0]);
  var secs = parseInt(time[1]);
  
  var timeParam = (mins>=1) ? 1000 : (secs>30) ? 1000 : (secs>15) ? 500 : (secs>5) ? 250 : 125;

  var mp3 = document.createElement("audio");
  mp3.setAttribute('src', './_audio/beep.mp3');
  mp3.load();
  document.documentElement.appendChild(mp3);  
  function sounds() {
    console.log("beep!");
    
    mp3.currentTime = 0;
    mp3.play();
  }
  
  soundID = setInterval(sounds, timeParam);  
  
  // use mp3.pause() to pause
}

function soundWin() {
  clearInterval(soundID);
  
  var mp3 = document.createElement("audio");
  mp3.setAttribute('src', 'http://soundbible.com/mp3/Ta Da-SoundBible.com-1884170640.mp3');
  mp3.load();
  document.documentElement.appendChild(mp3);  
  mp3.play();
  
}

function soundEnd() {
  clearInterval(soundID);
  
  var mp3 = document.createElement("audio");
  mp3.setAttribute('src', 'http://soundbible.com/mp3/Buzz-SoundBible.com-1790490578.mp3');
  mp3.load();
  document.documentElement.appendChild(mp3);  
  mp3.play();
  
}

function modal(roundParam=0) {
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("modalBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on the button, open the modal
  modal.style.display = "block";

  // pause sound
  clearInterval(soundID);

  function resetRound() {
    if (roundParam!=0) {
      reset();
    }
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() { 
    modal.style.display = "none";
    intervalID = setInterval(timer, timeInterval);
    resetRound();
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        intervalID = setInterval(timer, timeInterval);
        resetRound();
      }
  }

  score();
}

function score() {
  // pause interval 
  clearInterval(intervalID);

  // Get the modal
  var modal = document.getElementById('myModal');
  // plus & minus score 
  var teamA = document.getElementById("teamA");
  var teamB = document.getElementById("teamB");
  var scoreA = document.getElementById("scoreA");
  var scoreB = document.getElementById("scoreB");
  var plusA = document.getElementById("btn-A-plus");
  var plusB = document.getElementById("btn-B-plus");
  var minusA = document.getElementById("btn-A-minus");
  var minusB = document.getElementById("btn-B-minus");

  plusA.onclick = function() {
    scoreA.innerText++;
    checkScore();
    // setTimeout(checkScore, 500);
  }
  plusB.onclick = function() {
    scoreB.innerText++;
    checkScore();
    // setTimeout(checkScore, 500);
  }
  minusA.onclick = function() {
    if (scoreA.innerText<=0) {
      return;
    }
    scoreA.innerText--;
  }
  minusB.onclick = function() {
    if (scoreB.innerText<=0) {
      return;
    }
    scoreB.innerText--;
  }

  function checkScore() {
    var scoreContent = document.querySelector(".score-content");
    var scoreEnd = document.querySelector("#scoreEnd");

    // console.log("max:", scoreMax());
    // console.log("team A:", scoreA.innerText);
    // console.log("team B:", scoreB.innerText);

    if (scoreA.innerText === scoreMax() || scoreB.innerText === scoreMax()) {
      soundWin();

      var winner = (scoreA.innerText>scoreB.innerText) ? teamA : teamB;

      scoreContent.classList.toggle("hide");
      scoreEnd.classList.toggle("hide");
      
      scoreEnd.innerHTML = winner.value +" Wins!";

      window.onclick = function(event) {
        if (event.target == modal) {
          scoreA.innerText = 0;
          scoreB.innerText = 0;
          modal.style.display = "none";

          scoreContent.classList.toggle("hide");
          scoreEnd.classList.toggle("hide");
          
          startReturn();
        }
      }
    }
  }

}

function scoreMax() {
  function sliderMax() {
    return document.querySelector("#pointsIn").value;  
  }
  return sliderMax();
}

// FIXME: create stats for players
var storeLocally = {
  testLocalStorage: function() {
    if (typeof(Storage) === "undefined") {
      alert("Sorry! No Web Storage support");
      return;
    }
  },
  keepValues: function() {
    this.testLocalStorage();
    localStorage.setItem("todosArray", JSON.stringify(todosList.todos));
  },
  retrieveValues: function() {
    this.testLocalStorage();
    todosList.todos = JSON.parse(localStorage.getItem("todosArray"));
    view.displayTodos();
  }
}

// view.setUpEventListeners();
// storeLocally.retrieveValues();



// // TEMPLATE FOR localStorage OBJECT
// if (typeof(Storage) !== "undefined") {
//     // Code for localStorage/sessionStorage.
// } else {
//     // Sorry! No Web Storage support..
// }

// // Store
// localStorage.setItem('lastname', 'Smith');
// // or:
// localStorage.lastname = "Smith";
// // Retrieve
// document.getElementById("result").innerHTML = localStorage.lastname;

// // Retrieve
// localStorage.setItem("test", "Hello World!"); //It's saved!
// var test = localStorage.getItem("test"); //Let's grab it and save it to a variable
// console.log(test); //Logs "Hello World!"


// // stores click count
// if (localStorage.clickcount) {
//     localStorage.clickcount = Number(localStorage.clickcount) + 1;
// } else {
//     localStorage.clickcount = 1;
// }
// document.getElementById("result").innerHTML = "You have clicked the button " +
// localStorage.clickcount + " time(s).";

// // stores click count, only for current session!
// if (sessionStorage.clickcount) {
//     sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
// } else {
//     sessionStorage.clickcount = 1;
// }
// document.getElementById("result").innerHTML = "You have clicked the button " +
// sessionStorage.clickcount + " time(s) in this session.";




var phrases = {
  classic: ["yak","house","yam","head","sun","hat","loaf","society","underwear","amount","statement","suggestion","shoes","trousers","can","flesh","song","geese","rabbit","cracker","wish","station","run","rose","advertisement","condition","cause","voyage","reason","toad","measure","impulse","rifle","country","order","sticks","crib","bikes","flavor","tank","example","horn","marble","flame","division","sisters","level","oatmeal","lumber","work","slip","rail","cherries","fact","kettle","blow","picture","birthday","paper","drop","pig","mitten","comparison","experience","wood","year","school","cow","thumb","scene","card","stocking","hole","throne","volleyball","fang","door","fish","trip","shop","reading","wing","coil","plants","friend","current","verse","pin","toys","kiss","front","turn","hair","wrench","grade","bubble","legs","zinc","love","library","floor","committee","slave","glove","baby","grandmother","spade","building","memory","taste","crack","summer","men","suit","animal","cub","behavior","mice","scarecrow","substance","trucks","things","reward","carpenter","record","cactus","creator","rainstorm","meat","earthquake","seed","flower","health","aunt","cent","seashore","change","queen","pie","writing","regret","gun","skate","ladybug","arm","lip","pencil","grandfather","orange","education","ray","range","button","children","donkey","produce","surprise","crowd","bat","smash","desire","minute","brick","history","chance","top","fairies","form","sea","eggs","respect","wealth","fall","bed","fold","money","spring","thread","government","finger","mine","furniture","bulb","cart","lunchroom","whip","locket","digestion","daughter","metal","bird","toy","writer","lunch","books","cakes","road","tramp","trees","expansion","cloth","foot","crate","jail","wave","blade","frogs","cook","railway","test","waste","muscle","dogs","birth","stem","zebra","hour","jewel","trains","flag","power","egg","language","side","frame","pest","care","apparatus","anger","loss","ants","swing","pear","believe","basket","tail","step","bead","cup","toothpaste","self","knee","steel","ticket","dust","tent","oven","show","lettuce","color","prose","calendar","cobweb","bedroom","face","wire","bells","poison","burst","laugh","club","girl","development","transport","boot","doctor","ear","snakes","birds","stomach","stream","hot","protest","actor","tendency","view","talk","plant","branch","shape","houses","meeting","gold","rabbits","force","blood","leather","food","cream","popcorn","bell","shelf","income","silk","value","jam","stranger","hospital","eye","pail","discussion","rat","battle","religion","night","dirt","coal","grip","territory","stamp","copper","advice","trouble","river","pollution","addition","holiday","stew","potato","minister","lamp","room","industry","plough","office","support","scarf","profit","sand","linen","governor","doll","scent","field","leg","move","train","hall","twist","acoustics","sweater","bit","needle","milk","giraffe","skin","peace","tomatoes","person","scale","nut","coat","tub","pull","car","nose","robin","place","observation","month","unit","horse","cellar","cats","cheese","town","part","zephyr","plot","heat","fowl","box","sidewalk","cake","shake","degree","boy","angle","fireman","weight","plate","act","channel","sleep","error","arithmetic","wall","brother","scissors","join","teeth","kitty","pigs","veil","bait","quicksand","berry","stitch","attack","insurance","crayon","tray","ghost","planes","push","question","discovery","throat","quiet","number","stove","hope","vein","aftermath","roll","beds","agreement","steam","shade","guide","punishment","clover","boundary","sense","smell","mother","wrist","curve","hydrant","icicle","ring","bag","waves","cemetery","property","jelly","lock","detail","maid","size","sheet","sponge","expert","knowledge","screw","string","sign","basketball","finger","visitor","distance","party","cable","way","ball","sofa","twig","honey","bomb","zipper","carriage","collar","appliance","ground","need","partner","effect","harbor","sound","theory","shirt","low","approval","company","stick","quartz","chess","drink","selection","chickens","bite","business","corn","slope","home","kick","instrument","bike","toothbrush","pleasure","smile","edge","invention","yarn","point","crime","ducks","flight","cabbage","beef","earth","line","notebook","porter","dress","request","sleet","mist","stone","yoke","root","key","cast","bath","nest","time","mark","feeling","deer","bushes","soda","group","skirt","mask","powder","afternoon","morning","air","snow","representative","wax","gate","airport","pet","squirrel","playground","dinosaurs","coach","limit","rings","cough","hate","neck","jeans","eggnog","son","cave","whistle","brass","silver","reaction","badge","land","dolls","cover","vase","woman","wine","sky","trade","camp","laborer","title","system","friction","downtown","salt","wilderness","sail","duck","uncle","celery","guitar","snake","canvas","structure","name","chalk","fire","middle","back","growth","vegetable","play","passenger","water","babies","texture","fuel","creature","knife","butter","fly","pancake","calculator","achiever","mass","use","mint","spark","bone","plane","nerve","sack","magic","vest","table","vessel","dime","army","wash","bear","man","rock","rub","hobbies","turkey","mouth","tiger","shock","liquid","coast","rhythm","shoe","bridge","rake","secretary","cushion","truck","snail","songs","grain","cannon","action","board","start","soup","teaching","lake","mind","increase","toes","pot","credit","look","winter","parcel","mailbox","clam","attraction","stretch","pen","drain","chicken","crow","lace","boat","rule","trick","quiver","rice","rate","spot","sheep","fog","bee","hand","quill","jump","baseball","trail","glass","death","event","frog","quarter","window","cherry","noise","sink","cattle","grass","account","brake","plastic","watch","market","activity","vacation","voice","circle","ocean","wind","spoon","giants","cars","wool","spiders","pump","sock","position","tongue","afterthought","page","cows","rain","umbrella","worm","store","volcano","argument","cap","note","decision","bottle","mountain","eyes","fruit","pizzas","street","art","design","thunder","chin","machine","grape","fork","elbow","engine","hill","weather","stage","van","thing","tin","sugar","day","tax","ink","price","offer","thought","existence","treatment","week","ship","connection","science","dog","temper","border","pies","monkey","hook","letter","driving","breath","curtain","ice","juice","apparel","snails","rest","arch","adjustment","idea","flowers","island","pan","hammer","farm","desk","caption","spy","smoke","kittens","cat","jar","exchange","women","recess","nation","tooth","swim","humor","sort","north","zoo","wound","hands","horses","bucket","walk","destruction","judge","book","authority","distribution","wren","sister","interest","pets","dad","belief","amusement","girls","end","church","soap","crook","route","dinner","thrill","roof","meal","motion","space","haircut","control","competition","star","servant","oranges","jellyfish","shame","wheel","yard","relation","war","quilt","pipe","class","toe","receipt","basin","hose","balance","quince","pickle","airplane","fear","camera","rod","insect","tree","riddle","pocket","drawer","sneeze","story","team","friends","word","moon","dock","square","match","payment","iron","direction","purpose","oil","harmony","knot","alarm","flock","seat","plantation","stop","mom","straw","debt","crown","touch","beginner","base","letters"],
  verbs: ["warn","chase","hop","burn","scorch","add","form","want","fancy","dream","branch","coil","stop","decide","frame","miss","tame","employ","ask","buzz","tow","strip","dam","peep","measure","search","fire","fold","skip","accept","tire","include","curve","raise","paint","talk","brake","need","admit","thank","scream","knot","nod","exist","double","head","owe","arrange","pedal","number","supply","drain","support","coach","collect","pause","crack","guide","complete","happen","settle","repair","rescue","lock","permit","cure","suggest","tick","exercise","switch","drum","radiate","listen","pull","clear","prepare","spark","breathe","reduce","whine","water","carry","apologise","boast","join","moor","present","appear","regret","glue","colour","delight","tease","protect","improve","receive","trip","annoy","slip","curl","confess","inject","end","claim","bomb","harass","mourn","fence","impress","serve","succeed","sack","zip","weigh","strengthen","wait","calculate","prefer","scold","soak","instruct","rely","approve","meddle","preserve","saw","bump","carve","tap","remind","moan","slap","shop","sneeze","x-ray","jog","greet","admire","play","smash","level","scribble","fetch","plug","rhyme","concern","drag","return","ignore","ruin","steer","scrape","suck","shade","suppose","order","expect","sprout","fill","wobble","groan","part","ski","imagine","mend","offer","bake","store","check","kill","queue","grab","unlock","jail","fear","interrupt","dress","post","scare","explode","fool","pray","kneel","rejoice","program","command","introduce","pop","guard","bow","squeak","shelter","desert","ban","box","use","polish","sin","own","fasten","grate","treat","crush","man","mine","seal","taste","attend","wreck","discover","unfasten","fax","try","kiss","invent","spray","wriggle","bang","print","entertain","clip","work","untidy","tremble","brush","hook","gaze","press","share","communicate","wonder","beam","warm","crawl","behave","step","beg","request","whisper","bare","produce","sigh","long","continue","attract","answer","earn","drip","peel","kick","connect","plant","spoil","identify","prick","scatter","care","wrestle","stamp","excite","cry","push","retire","deliver","dust","melt","argue","intend","wail","interfere","guarantee","rock","rot","decay","flow","alert","deserve","disagree","worry","nest","expand","overflow","tickle","observe","memorise","whirl","heap","report","advise","concentrate","blind","hug","object","stare","cheer","battle","possess","book","tug","launch","chew","rinse","develop","wrap","whistle","borrow","found","test","remove","mess up","blink","cross","last","wash","trap","wander","flood","afford","attempt","blot","relax","slow","sip","detect","drown","stroke","avoid","harm","shrug","remember","look","applaud","smell","park","rule","shiver","file","stay","analyse","satisfy","rob","name","shock","risk","unpack","replace","spare","lick","stain","learn","arrest","nail","suspend","irritate","wink","disarm","preach","allow","separate","disapprove","bruise","squeal","inform","perform","load","bat","list","walk","stuff","bless","compete","promise","punch","move","cover","record","hope","influence","float","arrive","reign","obtain","agree","surprise","sail","terrify","punish","mix","bore","interest","guess","precede","match","peck","pine","dare","divide","bubble","poke","hate","mark","practise","flap","start","wish","laugh","injure","squeeze","enjoy","sound","strap","contain","twist","rush","knock","reflect","knit","mate","clean","attack","fail","blush","squash","follow","bathe","face","clap","confuse","charge","extend","destroy","trick","matter","tumble","train","stretch","point","embarrass","chop","balance","pick","like","count","refuse","unite","telephone","decorate","tie","mug","time","correct","pack","heal","hurry","attach","note","appreciate","heat","reproduce","reject","doubt","explain","close","sparkle","damage","invite","stir","release","trouble","suffer","manage","provide","belong","trust","please","increase","tip","escape","realise","cause","fade","gather","hand","smile","snore","complain","examine","turn","depend","spot","grip","camp","announce","marry","tempt","challenge","prevent","license","grin","snow","trace","undress","deceive","pour","waste","choke","land","occur","boil","place","hover","march","fit","visit","suit","wipe","cough","encourage","pinch","murder","scratch","snatch","pass","sign","trade","comb","question","type","paste","disappear","repeat","phone","empty","describe","label","watch","zoom","open","rain","fry","pat","pretend","suspect","call","multiply","remain","drop","obey","save","wave","consist","pump","lighten","hunt","grease","itch","delay","cycle","hammer","juggle","reply","flash","stitch","handle","bleach","thaw","offend","haunt","joke","surround","change","milk","smoke","crash","paddle","sniff","shave","race","bury","frighten","notice","touch","tour","hang","dance","vanish","fix","consider","enter","dislike","jump","compare","copy","glow","trot","back","educate","puncture","reach","whip","recognise","excuse","welcome","subtract","live","yawn","rub","judge","amuse","flower","spill","bolt","plan","hum","cheat","force","soothe","signal","dry","muddle","screw","bounce","love","spell","help","transport","lie","yell","scrub","roll","film","travel","jam"],
  quotes:  [
  "HEEERE'S JOHNNY!","I could just scream!","Gee! I love that kind of talk.","Bite my shiny metal ass!","And that's the way it is.","This tape will elf-destruct in five seconds.","yabba dabba do!","Sock It To Me!","Come on down!","Aaaaay!","Dy-no-mite!","Woo woo woo","Smooches","Hey!","Good Morning, Angels.","Hello-o-o Nurse!","Goodnight everybody!","I'm Ready","Good Morning, Krusty Krew","I love it when a plan comes together.","Zoinks!","Scooby-Dooby-Doo!","Don't be ridiculous.","You got it, Dude!","Make it so.","Oh, boy.","D'oh!","More Power!","Garbage day is a very dangerous day.","How you doin'?","I Know!","More cowbell","The Tribe has spoken.","Grab your gear!","I'm going ghost!","You're Fired.","Don't tell me what I can't do!","Bazinga!","I know what we're gonna do today!","Eat my shorts", "¡Ay, caramba!", "Don't have a cow man","Wubba Lubba Dub Dub","I'll be back","Hasta la vista, baby","Here's Johnny!","I love the smell of napalm in the morning","My precious","I am Groot","Frankly, my dear, I don't give a damn","What have I done","Here's looking at you, kid","I'm going to make him an offer he can't refuse","Why so serious?","Morning","Go ahead, make my day","You've got to ask yourself one question: Do I feel lucky? Well, do ya, punk?","Show me the money!","I have a bad feeling about this","May the force be with you","We're doomed!","It's a trap!","You talkin' to me?","You're Gonna need a bigger boat","Say hello to my little friend","Release the Kraken!","The name is Bond, James Bond","I pity the fool","We have ways to make men talk","It has been revoked"
  ],
  animals: ["dog","cat","fish","puffer","rat","hedgehog","ferret","mouse","crab","rabbit","hamster","gecko","spider","bird","dragon","tortoise","turtle","snake","aye","aye","squid","jelly","fish","oto","slug","snail","worm","ant","wood","lice","squirrel","stick bug","insect","crocodile","allegator","blob","fish","cuttle","fish","shark","pigeon","whale","duck","goose","sea","goal","tuna","lion","tiger","bear","zebra","toad","newt","deer","panda","leopard","cheetah","panther","gorilla","chimp","sloth","elephant","camel","horse","lama","emu","ostrich","wolf","giraffe","rhino","hippo","star","fish","wood pecker","koala","bear","man","worm","chicken","pig","cow","goat","scorpion","bats","moles","shrew","racoon","fly","lady","bird","cockroach","salamander","boar","cat","wasp","bee"],
  books: [],
  countries: ["China","India","United States","Indonesia","Brazil","China","India","United States","Indonesia","Brazil","Pakistan","Nigeria","Bangladesh","Russia","Japan","Mexico","Ethiopia","Philippines","Egypt","Vietnam","Germany","Democratic Republic of the Congo","Iran","Turkey","Thailand","France","United Kingdom","Italy","Tanzania","South Africa","Myanmar","South Korea","Colombia","Kenya","Spain","Argentina","Ukraine","Sudan","Uganda","Algeria","Poland","Iraq","Canada","Morocco","Saudi Arabia","Uzbekistan","Malaysia","Peru","Venezuela","Ghana","Nepal","Angola","Yemen","Afghanistan","Mozambique","Australia","North Korea","Taiwan","Cameroon","Ivory Coast","Madagascar","Niger","Sri Lanka","Romania","Burkina Faso","Syria","Mali","Malawi","Chile","Kazakhstan","Netherlands","Ecuador","Guatemala","Zambia","Cambodia","Senegal","Chad","Zimbabwe","Guinea","South Sudan","Rwanda","Somalia","Belgium","Tunisia","Haiti","Cuba","Bolivia","Greece","Benin","Czech Republic","Burundi","Portugal","Dominican Republic","United Arab Emirates","Sweden","Jordan","Azerbaijan","Hungary","Belarus","Honduras","Austria","Tajikistan","Israel","Switzerland","Papua New Guinea","Hong Kong ","Togo","Bulgaria","Serbia","Sierra Leone","Paraguay","El Salvador","Laos","Libya","Nicaragua","Kyrgyzstan","Lebanon","Denmark","Singapore","Finland","Eritrea","Slovakia","Norway","Central African Republic","Costa Rica","Palestine","New Zealand","Ireland","Turkmenistan","Republic of the Congo","Oman","Croatia","Kuwait","Liberia","Panama","Mauritania","Georgia","Moldova","Bosnia and Herzegovina","Uruguay","Puerto Rico ","Mongolia","Armenia","Albania","Lithuania","Jamaica","Qatar","Namibia","Botswana","Macedonia","Slovenia","Latvia","Lesotho","The Gambia","Kosovo","Gabon","Guinea-Bissau","Bahrain","Trinidad and Tobago","Estonia","Mauritius","Equatorial Guinea","East Timor","Swaziland","Djibouti","Fiji","Cyprus","Comoros","Bhutan","Guyana","Macau ","Solomon Islands","Montenegro","Western Sahara","Luxembourg","Suriname","Cape Verde","Transnistria","Malta","Brunei","Belize","Bahamas","Maldives","Iceland","Northern Cyprus","Barbados","Vanuatu","French Polynesia ","New Caledonia ","Abkhazia","Samoa","São Tomé and Príncipe","Saint Lucia","Guam ","Curaçao ","Nagorno-Karabakh Republic","Kiribati","Aruba ","Saint Vincent and the Grenadines","United States Virgin Islands ","Grenada","Tonga","Federated States of Micronesia","Jersey ","Seychelles","Antigua and Barbuda","Isle of Man ","Andorra","Dominica","Guernsey ","Bermuda ","Cayman Islands ","American Samoa ","Northern Mariana Islands ","Greenland ","Marshall Islands","South Ossetia","Faroe Islands ","Saint Kitts and Nevis","Sint Maarten ","Liechtenstein","Monaco","Saint-Martin ","Gibraltar ","San Marino","Turks and Caicos Islands ","British Virgin Islands ","Bonaire ","Cook Islands ","Palau","Anguilla ","Wallis and Futuna ","Tuvalu","Nauru","Saint Barthélemy ","Saint Pierre and Miquelon ","Saint Helena, Ascension and Tristan da Cunha ","Montserrat ","Sint Eustatius ","Falkland Islands ","Norfolk Island ","Christmas Island ","Saba ","Niue ","Tokelau ","Vatican City","Cocos ","Pitcairn Islands ","Pakistan","Nigeria","Bangladesh","Russia","Japan","Mexico","Ethiopia","Philippines","Egypt","Vietnam","Germany","Democratic Republic of the Congo","Iran","Turkey","Thailand","France","United Kingdom","Italy","Tanzania","South Africa","Myanmar","South Korea","Colombia","Kenya","Spain","Argentina","Ukraine","Sudan","Uganda","Algeria","Poland","Iraq","Canada","Morocco","Saudi Arabia","Uzbekistan","Malaysia","Peru","Venezuela","Ghana","Nepal","Angola","Yemen","Afghanistan","Mozambique","Australia","North Korea","Taiwan","Cameroon","Ivory Coast","Madagascar","Niger","Sri Lanka","Romania","Burkina Faso","Syria","Mali","Malawi","Chile","Kazakhstan","Netherlands","Ecuador","Guatemala","Zambia","Cambodia","Senegal","Chad","Zimbabwe","Guinea","South Sudan","Rwanda","Somalia","Belgium","Tunisia","Haiti","Cuba","Bolivia","Greece","Benin","Czech Republic","Burundi","Portugal","Dominican Republic","United Arab Emirates","Sweden","Jordan","Azerbaijan","Hungary","Belarus","Honduras","Austria","Tajikistan","Israel","Switzerland","Papua New Guinea","Hong Kong ","Togo","Bulgaria","Serbia","Sierra Leone","Paraguay","El Salvador","Laos","Libya","Nicaragua","Kyrgyzstan","Lebanon","Denmark","Singapore","Finland","Eritrea","Slovakia","Norway","Central African Republic","Costa Rica","Palestine","New Zealand","Ireland","Turkmenistan","Republic of the Congo","Oman","Croatia","Kuwait","Liberia","Panama","Mauritania","Georgia","Moldova","Bosnia and Herzegovina","Uruguay","Puerto Rico ","Mongolia","Armenia","Albania","Lithuania","Jamaica","Qatar","Namibia","Botswana","Macedonia","Slovenia","Latvia","Lesotho","The Gambia","Kosovo","Gabon","Guinea-Bissau","Bahrain","Trinidad and Tobago","Estonia","Mauritius","Equatorial Guinea","East Timor","Swaziland","Djibouti","Fiji","Cyprus","Comoros","Bhutan","Guyana","Macau ","Solomon Islands","Montenegro","Western Sahara","Luxembourg","Suriname","Cape Verde","Transnistria","Malta","Brunei","Belize","Bahamas","Maldives","Iceland","Northern Cyprus","Barbados","Vanuatu","French Polynesia ","New Caledonia ","Abkhazia","Samoa","São Tomé and Príncipe","Saint Lucia","Guam ","Curaçao ","Nagorno-Karabakh Republic","Kiribati","Aruba ","Saint Vincent and the Grenadines","United States Virgin Islands ","Grenada","Tonga","Federated States of Micronesia","Jersey ","Seychelles","Antigua and Barbuda","Isle of Man ","Andorra","Dominica","Guernsey ","Bermuda ","Cayman Islands ","American Samoa ","Northern Mariana Islands ","Greenland ","Marshall Islands","South Ossetia","Faroe Islands ","Saint Kitts and Nevis","Sint Maarten ","Liechtenstein","Monaco","Saint-Martin ","Gibraltar ","San Marino","Turks and Caicos Islands ","British Virgin Islands ","Bonaire ","Cook Islands ","Palau","Anguilla ","Wallis and Futuna ","Tuvalu","Nauru","Saint Barthélemy ","Saint Pierre and Miquelon ","Saint Helena, Ascension and Tristan da Cunha ","Montserrat ","Sint Eustatius ","Falkland Islands ","Norfolk Island ","Christmas Island ","Saba ","Niue ","Tokelau ","Vatican City","Cocos ","Pitcairn Islands"],
  cities: ["Karachi","Shanghai","Beijing","Dhaka","Delhi","Lagos","Istanbul","Tokyo","Guangzhou","Mumbai","Moscow","São Paulo","Shenzhen","Suzhou","Lahore","Cairo","Kinshasa","Jakarta","Seoul","Mexico City","Lima","London","New York City","Bengaluru","Bangkok","Nanjing","Dongguan","Chongqing","Tehran","Quanzhou","Shenyang","Bogotá","Hyderabad","Ho Chi Minh City","Hong Kong","Baghdad","Fuzhou","Chennai","Changsha","Wuhan","Tianjin","Hanoi","Faisalabad","Rio de Janeiro","Qingdao","Foshan","Zunyi","Santiago","Riyadh","Ahmedabad","Singapore","Shantou","Ankara","Yangon","Saint Petersburg","Casablanca","Abidjan","Chengdu","Alexandria","Kolkata","Xi'an","Surat","Johannesburg","Dar es Salaam","Shijiazhuang","Harbin","Giza","İzmir","Zhengzhou","New Taipei City","Los Angeles","Changchun","Cape Town","Yokohama","Khartoum","Guayaquil","Hangzhou","Xiamen","Berlin","Busan","Ningbo","Jeddah","Durban","Hyderabad","Algiers","Kabul","Hefei","Mashhad","Pyongyang","Madrid","Baku","Peshawar","Rawalpindi","Tangshan","Ekurhuleni","Nairobi","Zhongshan","Multan","Pune","Addis Ababa","Jaipur","Buenos Aires","Wenzhou","Incheon","Quezon City","Kiev","Salvador","Rome","Luanda","Lucknow","Kaohsiung","Kanpur","Surabaya","Taichung","Basra","Toronto","Taipei","Gujranwala","Chicago","Osaka","Quito","Chaozhou","Dubai","Fortaleza","Chittagong","Bandung","Managua","Brasília","Belo Horizonte","Daegu","Houston","Douala","Medellin","Yaoundé","Nagpur","Cali","Tashkent","Nagoya","Isfahan","Phnom Penh","Kochi","Paris","Ouagadougou","Lanzhou","Kano","Dalian","Guatemala City","Havana","Medan","Accra","Visakhapatnam","Jinan","Karaj","Minsk","Caracas","Sana'a","Sapporo","Islamabad","Tainan","Bucharest","Curitiba","Shiraz","Vienna","Brazzaville","Bhopal","Hamburg","Manila","Kuala Lumpur","Maputo","Budapest","Warsaw","Lusaka","Tabriz","Palembang","Almaty","Tijuana","Patna","Montreal","Davao City","Harare","Barcelona","Maracaibo","Caloocan","Philadelphia","Novosibirsk","Phoenix","Oran","Semarang","Recife","Kobe","Daejeon","Kampala","Kawasaki","Guadalajara","Auckland","Vijayawada","Fukuoka","Kwangju","Porto Alegre","Kyoto","Santa Cruz de la Sierra","Munich","Yekaterinburg","Barranquilla","Milan","Ibadan","Makassar","Córdoba","Prague","Mandalay","Montevideo","Nizhny Novgorod","Abuja","Calgary","Saitama","Dallas","Hiroshima","Rosario","Brisbane","Belgrade","Campinas","Ulsan","Omsk","Dakar","Abu Dhabi","Monterrey","Tripoli","Rostov-on-Don","Tbilisi","Fez","Birmingham","Yerevan","Cologne","Tunis"],
  random: ["Holy Agility","Holy Almost","Holy Alphabet","Holy Alps","Holy Alter Ego","Holy Anagram","Holy Apparition","Holy Armadillo","Holy Armour Plate","Holy Ashtray","Holy Asp","Holy Astronomy","Holy Astringent Plum-like Fruit","Holy Audubon","Holy Backfire","Holy Ball And Chain","Holy Bank Balance","Holy Bankruptcy","Holy Banks","Holy Bargain Basements","Holy Barracuda","Holy Bat Logic","Holy Bat Trap","Holy Batman","Holy Benedict Arnold","Holy Bijou","Holy Bikini","Holy Bill Of Rights","Holy Birthday Cake","Holy Black Beard","Holy Blackout","Holy Blank Cartridge","Holy Blizzard","Holy Blonde Mackerel Ash","Holy Bluebeard","Holy Bouncing Boiler Plate","Holy Bowler","Holy Bullseye","Holy Bunions","Holy Caffeine","Holy Camouflage","Holy Captain Nemo","Holy Caruso","Holy Catastrophe","Holy Cat(s)","Holy Chicken Coop","Holy Chilblains","Holy Chocolate Eclair","Holy Cinderella","Holy Cinemascope","Holy Cliche","Holy Cliffhangers","Holy Clockwork","Holy Clockworks","Holy Cofax You Mean","Holy Coffin Nails","Holy Cold Creeps","Holy Complications","Holy Conflagration","Holy Contributing to the Delinquency of Minors","Holy Corpuscles","Holy Cosmos","Holy Costume Party","Holy Crack Up","Holy Crickets","Holy Crossfire","Holy Crucial Moment","Holy Cryptology","Holy D'artagnan","Holy Davy Jones","Holy Detonator","Holy Disappearing Act","Holy Distortion","Holy Diversionary Tactics","Holy Dr. Jekyll and Mr. Hyde","Holy Egg Shells","Holy Encore","Holy Endangered Species","Holy Epigrams","Holy Escape-hatch","Holy Explosion","Holy Fate-worse-than-death","Holy Felony","Holy Finishing-touches","Holy Fireworks","Holy Firing Squad","Holy Fishbowl","Holy Flight Plan","Holy Flip-flop","Holy Flood Gate","Holy Floor Covering","Holy Flypaper","Holy Fly Trap","Holy Fog","Holy Forecast","Holy Fork In The Road","Holy Fourth Amendment","Holy Fourth Of July","Holy Frankenstein","Holy Frankenstein It's Alive","Holy Fratricide","Holy Frogman","Holy Fruit Salad","Holy Frying Towels","Holy Funny Bone","Holy Gall","Holy Gambles","Holy Gemini","Holy Geography","Holy Ghost Writer","Holy Giveaways","Holy Glow Pot","Holy Golden Gate","Holy Graf Zeppelin","Holy Grammar","Holy Graveyards","Holy Greed","Holy Green Card","Holy Greetings-cards","Holy Guacamole","Holy Guadalcanal","Holy Gullibility","Holy Gunpowder","Holy Haberdashery","Holy Hailstorm","Holy Hairdo","Holy Hallelujah","Holy Halloween","Holy Hallucination","Holy Hamburger","Holy Hamlet","Holy Hamstrings","Holy Happenstance","Holy Hardest Metal In The World","Holy Harem","Holy Harshin","Holy Haziness","Holy Headache","Holy Headline","Holy Heart Failure","Holy Heartbreak","Holy Heidelberg","Holy Helmets","Holy Helplessness","Holy Here We Go Again","Holy Hi-fi","Holy Hieroglyphic","Holy High-wire","Holy Hijack","Holy Hijackers","Holy History","Holy Hoaxes","Holy Hole In A Donut","Holy Hollywood","Holy Holocaust","Holy Homecoming","Holy Homework","Holy Homicide","Holy Hoodwink","Holy Hoof Beats","Holy Hors D'Oeuvre","Holy Horseshoes","Holy Hostage","Holy Hot Foot","Holy Houdini","Holy Human Collectors Item","Holy Human Pearls","Holy Human Pressure Cookers","Holy Human Surfboards","Holy Hunting Horn","Holy Hurricane","Holy Hutzpa","Holy Hydraulics","Holy Hypnotism","Holy Hypodermics","Holy Ice Picks","Holy Ice Skates","Holy Iceberg","Holy Impossibility","Holy Impregnability","Holy Incantation","Holy Inquisition","Holy Interplanetary Yardstick","Holy Interruptions","Holy Iodine","Holy IT and T","Holy Jack In The Box","Holy Jackpot","Holy Jail Break","Holy Jaw Breaker","Holy Jelly Molds","Holy Jet Set","Holy Jigsaw Puzzles","Holy Jitter Bugs","Holy Joe","Holy Journey To The Center Of The Earth","Holy Jumble","Holy Jumpin' Jiminy","Holy Karats","Holy Key Hole","Holy Key Ring","Holy Kilowatts","Holy Kindergarten","Holy Knit One Purl Two","Holy Knock Out Drops","Holy Known Unknown Flying Objects","Holy Kofax","Holy Las Vegas","Holy Leopard","Holy Levitation","Holy Liftoff","Holy Living End","Holy Lodestone","Holy Long John Silver","Holy Looking Glass","Holy Love Birds","Holy Luther Burbank","Holy Madness","Holy Magic Lantern","Holy Magician","Holy Main Springs","Holy Marathon","Holy Mashed Potatoes","Holy Masquerade","Holy Matador","Holy Mechanical Armies","Holy Memory Bank","Holy Merlin Magician","Holy Mermaid","Holy Merry Go Around","Holy Mesmerism","Holy Metronome","Holy Miracles","Holy Miscast","Holy Missing Relatives","Holy Molars","Holy Mole Hill","Holy Mucilage","Holy Multitudes","Holy Murder","Holy Mush","Holy Naive","Holy New Year's Eve","Holy Nick Of Time","Holy Nightmare","Holy Non Sequiturs","Holy Oleo","Holy Olfactory","Holy One Track Bat Computer Mind","Holy Oversight","Holy Oxygen","Holy Paderewski","Holy Paraffin","Holy Perfect Pitch","Holy Pianola","Holy Pin Cushions","Holy Polar Front","Holy Polar Ice Sheet","Holy Polaris","Holy Popcorn","Holy Potluck","Holy Pressure Cooker","Holy Priceless Collection of Etruscan Snoods","Holy Pseudonym","Holy Purple Cannibals","Holy Puzzlers","Holy Rainbow","Holy Rats In A Trap","Holy Ravioli","Holy Razors Edge","Holy Recompense","Holy Red Herring","Holy Red Snapper","Holy Reincarnation","Holy Relief","Holy Remote Control Robot","Holy Reshevsky","Holy Return From Oblivion","Holy Reverse Polarity","Holy Rheostat","Holy Ricochet","Holy Rip Van Winkle","Holy Rising Hemlines","Holy Roadblocks","Holy Robert Louis Stevenson","Holy Rock Garden","Holy Rocking Chair","Holy Romeo And Juliet","Holy Rudder","Holy Safari","Holy Sarcophagus","Holy Sardine","Holy Scalding","Holy Schizophrenia","Holy Sedatives","Holy Self Service","Holy Semantics","Holy Serpentine","Holy Sewer Pipe","Holy Shamrocks","Holy Sherlock Holmes","Holy Show-Ups","Holy Showcase","Holy Shrinkage","Holy Shucks","Holy Skull Tap","Holy Sky Rocket","Holy Slipped Disc","Holy Smoke","Holy Smokes","Holy Smokestack","Holy Snowball","Holy Sonic Booms","Holy Special Delivery","Holy Spider Webs","Holy Split Seconds","Holy Squirrel Cage","Holy Stalactites","Holy Stampede","Holy Standstills","Holy Steam Valve (also uttered by Alfred in concern over a kidnapped Robin.)","Holy Stew Pot","Holy Stomach Aches","Holy Stratosphere","Holy Stuffing","Holy Subliminal","Holy Sudden Incapacitation","Holy Sundials","Holy Surprise Party","Holy Switch A Roo","Holy Taj Mahal","Holy Tartars","Holy Taxation","Holy Taxidermy","Holy Tee Shot","Holy Ten Toes","Holy Terminology","Holy Time Bomb","Holy Tintinnabulation","Holy Tipoffs","Holy Titanic","Holy Tome","Holy Toreador","Holy Trampoline","Holy Transistors","Holy Travel Agent","Holy Trickery","Holy Triple Feature","Holy Trolls And Goblins","Holy Tuxedo","Holy Uncanny Photographic Mental Processes","Holy Understatements","Holy Underwritten Metropolis","Holy Unlikelihood","Holy Unrefillable Prescriptions","Holy Vat","Holy Venezuela","Holy Vertebrae","Holy Voltage","Holy Waste Of Energy","Holy Wayne Manor","Holy Weaponry","Holy Wedding Cake","Holy Wernher von Braun","Holy Whiskers","Holy Wigs","Holy Zorro"],
  sustantivos: ["vez","año","tiempo","día","cosa","hombre","parte","vida","momento","forma","casa","mundo","mujer","caso","país","lugar","persona","hora","trabajo","punto","mano","manera","fin","tipo","gente","ejemplo","lado","hijo","problema","cuenta","medio","palabra","niño","sin embargo","padre","cambio","historia","idea","agua","noche","ciudad","modo","nombre","familia","realidad","obra","verdad","mes","razón","grupo","relación","cuerpo","hecho","principio","señor","pueblo","tarde","ojo","calle","libro","fuerza","luz","santo","frente","amigo","sentido","paso","situación","gracia","siglo","dios","tierra","papel","madre","tema","clase","dinero","campo","cabeza","orden","don","semana","final","interés","vista","acuerdo","número","fondo","camino","voz","estudio","valor","medida","centro","necesidad","condición","falta","edad","estado","ser","puerta","cara","época","color","experiencia","movimiento","pesar","posibilidad","juego","aire","guerra","resultado","ley","aspecto","pie","especie","servicio","actividad","cuestión","duda","diferencia","mañana","cantidad","acción","sociedad","peso","efecto","objeto","amor","muerte","partido","derecho","poder","importancia","sistema","viaje","suelo","respecto","conocimiento","libertad","atención","esfuerzo","resto","zona","miedo","proceso","minuto","mesa","ocasión","programa","favor","respuesta","línea","espacio","nivel","gobierno","cabo","pregunta","imagen","carrera","figura","animal","base","posición","motivo","prueba","política","dato","empresa","asunto","presencia","cultura","serie","carácter","mayoría","escuela","autor","hermano","función","causa","decisión","música","expresión","río","seguridad","término","metro","médico","arte","consecuencia","acto","pena","segundo","altura","deseo","joven","sueño","tarea","carta","propiedad","producto","gusto","ayuda","lengua","plan","vuelta","proyecto","memoria","origen","elemento","mercado","curso","sangre","interior","uso","brazo","profesor","futuro","oportunidad","mitad","recuerdo","opinión","boca","dirección","pieza","actitud","mar","entrada","contacto","corazón","capital","título","cuarto","material","golpe","comunicación","enfermedad","bien","materia","sitio","naturaleza","capacidad","distancia","información","ambiente","desarrollo","sol","compañero","salida","conciencia","costumbre","paz","noticia","circunstancia","dolor","estilo","precio","planta","personaje","éxito","hija","edificio","autoridad","piedra","conjunto","suerte","espíritu","miembro","recurso","pared","equipo","error","dificultad","voluntad","reunión","modelo","fecha","propósito","cuidado","puesto","grado","lucha","jefe","periódico","par","público","calidad","ciencia","tamaño","doctor","cuadro","caballo","responsabilidad","detalle","marcha","carne","pensamiento","cargo","santa","construcción","juicio","terreno","piso","compañía","texto","fuente","presente","revista","esperanza","máquina","frase","sala","instrumento","defensa","director","explicación","artículo","radio","película","elección","visita","apoyo","presidente","arma","árbol","encuentro","corriente","lectura","existencia","lenguaje","destino","educación","operación","nota","teatro","negocio","letra","sentimiento","solución","comida","impresión","plano","intención","ritmo","banco","piel","control","investigación","conversación","verano","respeto","norte","tradición","población","pareja","pasado","diario","generación","visión","peligro","oro","etapa","silencio","artista","labor","cielo","práctica","límite","masa","formación","perro","izquierda","energía","confianza","flor","esposa","revolución","maestro","fenómeno","presión","alumno","teoría","tono","salud","señora","vía","alma","madera","fiesta","calor","hogar","mente","preocupación","concepto","teléfono","hoja","escritor","intento","regla","riesgo","policía","estudiante","plaza","llamada","sensación","enemigo","unidad","idioma","raíz","compromiso","comentario","carga","marido","derecha","extremo","individuo","contenido","obligación","corte","total","daño","mensaje","lista","región","niña","culpa","discusión","pelo","fe","referencia","sur","gesto","perspectiva","colegio","venta","documento","televisión","chico","novela","alcance","crisis","literatura","batalla","dueño","vecino","sector","pintura","accidente","influencia","empleado","moneda","facilidad","matrimonio","iglesia","oficina","institución","frío","domingo","reacción","acontecimiento","costa","método","comunidad","coche","página","frecuencia","conclusión","escena","estructura","beneficio","alimento","velocidad","barrio","análisis","frontera","temor","ataque","cine","rama","comienzo","barco","partida","aparato","extranjero","cámara","creación","gana","moda","ruido","cama","técnica","consejo","violencia","sonido","estrella","mirada","pierna","hambre","placer","profesión","objetivo","honor","montaña","instante","viento","lluvia","ejército","tren","círculo","ventaja","isla","torno","amistad","cadena","político","rey","ánimo","trato","ejercicio","organización","agosto","secretario","dedo","gasto","café","diálogo","discurso","hermana","caja","juez","particular","poeta","sorpresa","ventana","característica","suma","volumen","estación","argumento","categoría","plata","conflicto","avión","ropa","examen","habitante","justicia","criterio","plazo","kilómetro","hospital","satisfacción","silla","juventud","acceso","marco","prensa","excepción","ausencia","sombra","profundidad","leche","consideración","premio","nacimiento","invierno","diciembre","comportamiento","crítica","fuego","tendencia","norma","rueda","puente","rasgo","cuento","signo","señal","campaña","puerto","aventura","marca","ilusión","compra","inteligencia","virtud","remedio","territorio","facultad","fotografía","techo","conducta","salto","pan","disposición","general","disciplina","personal","columna","indio","gato","margen","resistencia","pérdida","tratamiento","entrevista","espectáculo","personalidad","mayo","representación","régimen","punta","alegría","misión","empleo","participación","período","busca","superficie","pasión","vehículo","enero","capítulo","fracaso","experto","inquietud","organismo","religión","departamento","periodista","interpretación","belleza","universidad","riqueza","rato","equilibrio","fruto","representante","exceso","capa","defecto","fábrica","espalda","género","economía","bosque","paisaje","llamado","paciente","tensión","ministro","impulso","comercio","espera","reserva","competencia","observación","vacío","cifra","escala","procedimiento","fórmula","ámbito","informe","dimensión","cliente","manifestación","pico","sensibilidad","regreso","temperatura","julio","bomba","órgano","avance","humanidad","firma","soldado","clima","emoción","automóvil","mal","habilidad","identidad","desgracia","deber","cola","progreso","muestra","hábito","mecanismo","vivienda","área","mezcla","habitación","instrucción","versión","lujo","intervención","llegada","alrededor","testigo","dominio","raza","descubrimiento","vacaciones","provincia","saber","claridad","arena","postura","salón","escenario","largo","hotel","oficio","fila","patrón","pecho","tienda","protección","funcionario","transporte","red","caída","valle","vuelo","sexo","iniciativa","concentración","grito","esencia","cocina","reflejo","definición","abogado","sesión","reloj","muchacho","octubre","exposición","ingreso","dibujo","hueso","militar","motor","oposición","patio","fruta","ideal","actor","confusión","traje","exigencia","víctima","playa","trabajador","hierro","tela","producción","febrero","símbolo","medicina","búsqueda","tranquilidad","espejo","comprensión","cerebro","tiro","abuelo","declaración","sujeto","enseñanza","permiso","evolución","tío","moral","parque","ingeniero","borde","entusiasmo","independencia","mentira","sueldo","comparación","seno","canto","potencia","oficial","fortuna","crimen","ciudadano","baño","reconocimiento","exterior","crédito","alternativa","canal","agente","pago","filosofía","lector","triunfo","sábado","amiga","carretera","victoria","pájaro","biblioteca","reflexión","vocación","continente","tabla","ensayo","plato","jardín","imaginación","poesía","guardia","privilegio","monte","precisión","sacrificio","hilo","aparición","poema","curiosidad","diente","primo","apariencia","novedad","castigo","carro","aumento","pobreza","dólar","local","industria","caballero","especialista","temporada","humor","nación","felicidad","amante","cálculo","composición","rapidez","huevo","crecimiento","clave","tragedia","colección","chica","prestigio","sección","bolsa","cinta","cuello","continuación","abril","actuación","factor","esquina","hombro","infancia","descanso","zapato","parecer","familiar","mérito","muro","montón","disco","demanda","mueble","desastre","secreto","angustia","nube","miseria","significado","fama","palacio","oído","polvo","sacerdote","lección","rosa","olor","contrato","presentación","cárcel","división","revés","cualidad","índice","marzo","atmósfera","planeta","orgullo","jornada","palo","diseño","lógica","herencia","deporte","reina","bandera","maravilla","banda","cristal","anécdota","leyenda","muerto","azúcar","inclinación","rostro","separación","eco","cita","actualidad","fantasía","promesa","pata","foto","administración","civilización","ocupación","asiento","pista","testimonio","regalo","contradicción","metal","aceite","código","unión","extensión","duro","varón","evidencia","dignidad","escándalo","colega","horario","orilla","copia","huella","ejemplar","cura","garantía","vaso","perfil","proporción","ceremonia","vidrio","ruta","anuncio","soledad","tesis","rincón","nariz","bolsillo","asociación","mando","sabor","década","preparación","afecto","protesta","patria","consumo","selva","deuda","horizonte","talento","gas","té","gloria","noviembre","candidato","llave","inconveniente","afán","etcétera","comisión","posesión","dama","onda","botella","torre","combinación","cadáver","paquete","apellido","conferencia","propuesta","intensidad","explosión"]
}


