let gradients = {
  green: "#C4E759, #6DE195",
  blue: "#8DEBFF, #6CACFF",
  purple: "#D3A2DB, #9A6DF6",
  red: "#EE9B87, #EA5E57",
  orange: "#FFC48D, #FFA36C",
  pink: "#FFA1DF, #FF6CF0",
  darkgreen: "#86C46D, #509B59",
  lightgrey: "#CACACA, #B6B6B6",
}
let timetype = false
const timespm = {
  "8": "8:00",
  "8.5": "8:30",
  "9": "9:00",
  "9.5": "9:30",
  "10": "10:00",
  "10.5": "10:30",
  "11": "11:00",
  "11.5": "11:30",
  "12": "12:00",
  "12.5": "12:30",
  "13": "13:00",
  "13.5": "13:30",
  "14": "14:00",
  "14.5": "14:30",
  "15": "15:00",
  "15.5": "15:30",
  "16": "16:00",
  "16.5": "16:30",
  "17": "17:00",
  "17.5": "17:30",
  "18": "18:00",
}
const timesam = {
  "8": "8:00",
  "8.5": "8:30",
  "9": "9:00",
  "9.5": "9:30",
  "10": "10:00",
  "10.5": "10:30",
  "11": "11:00",
  "11.5": "11:30",
  "12": "12:00",
  "12.5": "12:30",
  "13": "1:00",
  "13.5": "1:30",
  "14": "2:00",
  "14.5": "2:30",
  "15": "3:00",
  "15.5": "3:30",
  "16": "4:00",
  "16.5": "4:30",
  "17": "5:00",
  "17.5": "5:30",
  "18": "6:00",
}
let times = timespm;
console.log("times", times)
const timeorder = [
  8,
  8.5,
  9,
  9.5,
  10,
  10.5,
  11,
  11.5,
  12,
  12.5,
  13,
  13.5,
  14,
  14.5,
  15,
  15.5,
  16,
  16.5,
  17,
  17.5,
  18
]


let classes = []
let spotsfilled = [
  Array(20).fill(false),
  Array(20).fill(false),
  Array(20).fill(false),
  Array(20).fill(false),
  Array(20).fill(false)
];




const scheduleEl = document.querySelector(".schedule");
const addEl = document.querySelector(".addclass");
const editEl = document.querySelector(".editclass")
let selectedclass = -1;
let currentzoom = 0.5;

function generate() {
  let content = "";
  content += `<div class="classgridbox"></div>`;
  content += `<div class="link">Horaire créé avec: etiennejanelle.github.io/horaire </div>`;
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  for ( let i = 0; i < days.length; i++ ) {
    content += `<div class="day" style="grid-area: 1 / ${i+2} / 2 / ${i+3} ">${days[i]}</div>`
  }
  for (let i = 0; i < 11; i++) {
    let time = i + 8;
    content += `<div class="time" style="grid-area: ${i*2+1} / 1 / ${i*2+2} / 2 ">${times[time]}</div>`
  }
  
  if (classes.length == 0) {
    content += `<div class="emptynotice">Cliquez à un endroit sur la grille<br/>pour ajouter un cours</div>`
  }
  
  spotsfilled = [
    Array(20).fill(false),
    Array(20).fill(false),
    Array(20).fill(false),
    Array(20).fill(false),
    Array(20).fill(false)
  ];
  for (let i in classes) {
    const data = classes[i]
    if (data == "deleted") {continue}
    
    for (let j = data.start * 2 - 16; j < data.end * 2 - 16; j++) {
      spotsfilled[data.day - 1][j] = true;
    }
    content += `<div class="class ${data.new ? "new" : ""} ${i == selectedclass ? "selected" : ""} ${data.newlyselected ? "newlyselected" : ""}" style="
      grid-area: ${data.start * 2 - 14} / ${data.day+1} / ${data.end * 2 - 14} / ${data.day+2};
      background: linear-gradient(135deg, ${gradients[data.color]})"
      ${i == selectedclass ? "" : `onclick="selectclass(${i})"`}>
        <div class="classname">${data.name}</div>
        ${data.group != "" ? `<div class="classgroup">Gr. ${data.group}</div>` : ""}
        <div class="classlocal">${data.local}</div>
      ${i == selectedclass ? `
        <div class="classexpandup" onmousedown="classexpand(${i}, this, event, false, true)" ontouchstart="classexpand(${i}, this, event, true, true)"></div>
        <div class="classexpanddown" onmousedown="classexpand(${i}, this, event, false, false)" ontouchstart="classexpand(${i}, this, event, true, false)"></div>
      ` : ""}
    </div>`
    classes[i].new = false;
    classes[i].newlyselected = false;
  }
  
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 20; j+=2) {
      if (!spotsfilled[i][j] && !spotsfilled[i][j-1]) {
        if (j > 0) {
          content += `<div class="emptyborder" style="
            grid-area: ${j + 2} / ${i + 2} / ${j + 4} / ${i + 3};">
          </div>`
        }
      }
      
      if (!spotsfilled[i][j] && !spotsfilled[i][j+1]) {
        content += `<div class="emptyclass" style="
        grid-area: ${j + 2} / ${i + 2} / ${j + 4} / ${i + 3};"
        onclick="addclass(${i + 1},${j / 2 + 8})"
        >
      </div>`
      }
    }
  }
  
  
  scheduleEl.innerHTML = content;
}


function generateedit() {
  if (selectedclass == -1) {
    editEl.classList.remove("active");
    return
  }
  editEl.classList.add("active")
  
  const data = classes[selectedclass]
  
  editEl.style.setProperty("--gradient", "linear-gradient(135deg, " + gradients[data.color] + ")");
  let content = "";
  
  content += `
  <div class="editname editfield">
      <input type="text" placeholder="Nom du cours" value="${data.name}" oninput="editclassname(${selectedclass},this)">
  </div>`;
  
  content += `
  <div class="editgroup editfield">
      <input type="text" placeholder="Groupe" value="${data.group}" oninput="editclassgroup(${selectedclass},this)">
  </div>`;
  
  content += `
  <div class="editlocal editfield">
      <input type="text" placeholder="Local" value="${data.local}" oninput="editclasslocal(${selectedclass},this)">
  </div>`;
  
  let startoptions = `<option value="" disabled>Heure de début</option>`
  for (let i = 0; i < timeorder.length; i++) {
    startoptions += `<option value="${timeorder[i]}" ${timeorder[i] == data.start ? "selected" : ""}>${times[timeorder[i]]}</option>`
  }
  
  let endoptions = `<option value="" disabled>Heure de fin</option>`
  for (let i = 0; i < timeorder.length; i++) {
    endoptions += `<option value="${timeorder[i]}" ${timeorder[i] == data.end ? "selected" : ""}>${times[timeorder[i]]}</option>`
  }
  
  
  content += `<div class="editstart editfield">
    <select required name="" id="" onchange="editclassstart(${selectedclass}, this)">
    ${startoptions}
    </select>
  </div>
  
  <div class="editend editfield">
    <select required name="" id="" onchange="editclassend(${selectedclass}, this)">
    ${endoptions}
    </select>
  </div>`;
  
  let coloroptions = ""
  for (let i in gradients) {
    coloroptions += `<div class="editcolor ${data.color == i ? "selected" : ""}" style="--optiongradient: linear-gradient(135deg, ${gradients[i]})" onclick="editclasscolor(${selectedclass}, \'' + '${i}' + '\')"></div>`
  }
  
  content += `<div class="editcolors">
    ${coloroptions}
  </div>
  
  <div class="editdelete" onclick="deleteclass()"><ion-icon name="trash-outline"></ion-icon></div>`;
  
  editEl.innerHTML = content;
  console.log("content", editEl.innerHTML)
}


function addclass(day, time) {
  classes.push({
    name: "",
    group: "",
    local: "",
    day: day,
    start: time,
    end: time + 1,
    color: "green",
    new: true,
    newlyselected: true,
  })
  selectedclass = classes.length - 1;
  generate()
  generateedit();
}

function selectclass(index) {
  selectedclass = index;
  classes[selectedclass].newlyselected = true;
  generate();
  generateedit();
}

function deselect() {
  selectedclass = -1;
  editEl.classList.remove("active");
  generate();
}

function deleteclass() {
  classes[selectedclass] = "deleted";
  selectedclass = -1;
  editEl.classList.remove("active");
  generate();
}

function editclassname(index, el) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].name = el.value;
  generate()
}
function editclassgroup(index, el) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].group = el.value;
  generate()
}
function editclasslocal(index, el) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].local = el.value;
  generate()
}
function editclassstart(index, el) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].start = parseFloat(el.value);
  generate()
}
function editclassend(index, el) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].end = parseFloat(el.value);
  generate()
}
function editclasscolor(index, value) {
  if (index != selectedclass) {console.log("warning: modified a class that isnt selected")}
  classes[index].color = value;
  generate()
  generateedit()
}




function download() {
  let downloaddata = encodeURI('data:text/json;charset=utf-8,' + JSON.stringify({
    note: "Pour obtenir une version image de l'horaire, utilisez le bouton caméra du créateur d'horaire",
    n2: "La version data de l'horaire permet de le rouvrir pour faire des modifications plus tard",
    n3: "Lien du créateur d'horaire: etiennejanelle.github.io/horaire",
    version: "1.1",
    data: classes
  }, null, 2));
  let filename = "horaire.json";
  let link = document.createElement('a');
  link.setAttribute('href', downloaddata);
  link.setAttribute('download', filename);
  link.click();
  link.remove();
}
function upload() {
  selectedclass = -1;
  editEl.classList.remove("active");
  
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = () => {
    let file = Array.from(input.files)[0];
    let fr = new FileReader();
    fr.onload = function(e) {
      classes = JSON.parse(e.target.result).data;
      generate()
    }
    fr.readAsText(file)
  };
  input.click();
}
function changetime() {
  timetype = !timetype;
  if (timetype) {
    times = timesam
  } else {
    times = timespm
  }
  console.log("changed times", times)
  generate();
  generateedit()
}
function zoom(value) {
  currentzoom = Math.min(Math.max(0.2, currentzoom + value), 1.5);
  document.documentElement.style.fontSize = currentzoom + "px"
}

function screenshot() {
  scheduleEl.classList.add("screenshot")
  //document.documentElement.style.fontSize = "1px"
  html2canvas(scheduleEl, {scale: 5}).then(function(canvas) {
    let dataurl = canvas.toDataURL("image/png");
    let filename = "horaire.png";
    let link = document.createElement('a');
    link.setAttribute('href', dataurl);
    link.setAttribute('download', filename);
    link.click();
    link.remove();
    scheduleEl.classList.remove("screenshot")
    //document.documentElement.style.fontSize = currentzoom + "px"
  })
}

function screenshotnew() {
  document.body.classList.add("screenshot")
  
  var scale = 2;
  domtoimage.toPng(scheduleEl, {
    width: scheduleEl.clientWidth * scale,
    height: scheduleEl.clientHeight * scale,
    style: {
      transform: 'scale('+scale+')',
      transformOrigin: 'top left'
    }
  }).then(function (dataurl) {
    let filename = "horaire.png";
    let link = document.createElement('a');
    link.setAttribute('href', dataurl);
    link.setAttribute('download', filename);
    link.click();
    link.remove();
    document.body.classList.remove("screenshot")
  })
}

function startscreenshot() {
  selectedclass = -1;
  editEl.classList.remove("active");
  generate();
  document.body.classList.add("screenshot")
  document.querySelector(".screenshotwarning")
    .classList.add("active")
}
function nextscreenshot() {
  document.querySelector(".screenshotwarning")
    .classList.remove("active");
  document.querySelector(".exitscreenshot")
    .classList.add("active");
}
function endscreenshot() {
  document.querySelector(".exitscreenshot")
    .classList.remove("active");
  document.body.classList.remove("screenshot")
}

function classexpand(index, el, event, istouch, istop) {
  el.classList.add("active");
  const classEl = document.querySelector(".class.selected");
  let mouseY = 0;
  
  function expandmovement(moveevent) {
    const remscale = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2));
    const gridbounds = document.querySelector(".classgridbox").getBoundingClientRect()
    
    let time = Math.round(Math.min(Math.max((mouseY - gridbounds.top) / gridbounds.height * 20, 0), 20)) / 2 + 8
    console.log("time", time)
    
    if (istop) {
      // confirm if the position is valid
      if (time >= classes[selectedclass].end) {
        time = classes[selectedclass].end - 0.5
      }
      if (time < classes[selectedclass].start) {
        const targettime = time;
        time = classes[selectedclass].start
        while (time > targettime) {
          time -= 0.5;
          if (spotsfilled[classes[selectedclass].day - 1][time * 2 - 16]) {
            time += 0.5;
            break;
          }
        }
      }
      
      // display that position
      classEl.style.gridRowStart = time * 2 - 14
      const classPosition = classEl.getBoundingClientRect();
      el.style.transform = `translateY(${(mouseY - classPosition.top)/remscale}rem)`
      console.log("transform", `translateY(${mouseY- classPosition.top}px)`)
      
    } else {
      // confirm if the position is valid
      if (time <= classes[selectedclass].start) {
        time = classes[selectedclass].start + 0.5
      }
      if (time > classes[selectedclass].end) {
        const targettime = time;
        time = classes[selectedclass].end
        while (time < targettime) {
          time += 0.5;
          if (spotsfilled[classes[selectedclass].day - 1][time * 2 - 17]) {
            time -= 0.5;
            break;
          }
        }
      }
      
      // display that position
      classEl.style.gridRowEnd = time * 2 - 14
      const classPosition = classEl.getBoundingClientRect();
      el.style.transform = `translateY(${(mouseY - classPosition.bottom)/remscale}rem)`
      console.log("transform", `translateY(${mouseY - classPosition.bottom}px)`)
    }
  }
  function expandconfirm(confirmevent) {
    const remscale = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2));
    const gridbounds = document.querySelector(".classgridbox").getBoundingClientRect()
    
    let time = Math.round(Math.min(Math.max((mouseY - gridbounds.top) / gridbounds.height * 20, 0), 20)) / 2 + 8
    console.log("time", time)
    
    if (istop) {
      // confirm if the position is valid
      if (time >= classes[selectedclass].end) {
        time = classes[selectedclass].end - 0.5
      }
      if (time < classes[selectedclass].start) {
        const targettime = time;
        time = classes[selectedclass].start
        while (time > targettime) {
          time -= 0.5;
          if (spotsfilled[classes[selectedclass].day - 1][time * 2 - 16]) {
            time += 0.5;
            break;
          }
        }
      }
      classes[selectedclass].start = time
    } else {
      // confirm if the position is valid
      if (time <= classes[selectedclass].start) {
        time = classes[selectedclass].start + 0.5
      }
      if (time > classes[selectedclass].end) {
        const targettime = time;
        time = classes[selectedclass].end
        while (time < targettime) {
          time += 0.5;
          if (spotsfilled[classes[selectedclass].day - 1][time * 2 - 17]) {
            time -= 0.5;
            break;
          }
        }
      }
      classes[selectedclass].end = time
    }
    generate()
    generateedit()
  }
  if (istouch) {
    el.addEventListener('touchmove', (e) => {
      mouseY = e.targetTouches[0].clientY
      expandmovement(e)
    });
    el.addEventListener('touchend', (e) => {
      expandconfirm(e)
    })
  } else {
    el.addEventListener('mousemove', (e) => {
      mouseY = e.clientY;
      expandmovement(e)
    });
    el.addEventListener('mouseup', (e) => {
      expandconfirm(e)
    });
    el.addEventListener('mouseout', (e) => {
      expandconfirm(e)
    })
  }
}

generate();
generateedit();
currentzoom = Math.min(Math.max(0.2, 0.01 * Math.floor(window.innerHeight * 0.077)), 1.5);
  document.documentElement.style.fontSize = currentzoom + "px"