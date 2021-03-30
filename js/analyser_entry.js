import {generateHash} from '/js/min.md5.js'
import {LangEnum, detectLanguage, parseDate, parseName, parseChatting} from '/js/script_parsing.js'

let scriptProfile = {'nameFrequency': null, 'hourFrequency': null, 'dayFrequency': null};
let scriptData = null;
let splittedScript;
const toggledText = '▲ 접기'
const notToggledText = '▼ 펼치기'

//Script
function getDayLabel(day) {
  var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
  var dayLabel = week[day];
  return dayLabel;
}

function sortDictionary(dict){
  let items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });
  
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  return items
}

function saveFrequency(scriptArray, lang){
  let nameDict = {};
  let hourDict = {};
  let dayDict = {};

  if(lang == LangEnum.ko){
      scriptArray.forEach(element => {
          const name = parseName(element, lang);
          if (name === null){
            return;
          }
          const date = parseDate(element, lang);
          const dayLable = getDayLabel(date.getDay()); 

          if(name in nameDict){
            ++nameDict[name];
          }
          else{
            nameDict[name] = 1;
          }
          
          if(dayLable in dayDict){
              ++dayDict[dayLable];
          }
          else{
              dayDict[dayLable] = 1;
          }

          if(date.getHours() in hourDict){
              ++hourDict[date.getHours()];
          }
          else{
            hourDict[date.getHours()] = 1;
          }
      });
  }

  const mappingFunc = function(key) {
    return [key, dict[key]];
  };
  const sortFunc = function(first, second) {
    return second[1] - first[1];
  };

  let nameArray = sortDictionary(nameDict);
  let dayArray = sortDictionary(dayDict);
  let hourArray = sortDictionary(hourDict);
  scriptProfile['nameFrequency'] = nameArray;
  scriptProfile['dayFrequency'] = dayArray;
  scriptProfile['hourFrequency'] = hourArray;
}

//LocalStorage
function tryLoadData(hash){
  const data = localStorage.getItem(hash)
  if(data === null){
      return;
  }

  scriptData = JSON.parse(data);
}

//Display
function displayHash(hash) {
  const element = document.querySelector('#hash-code');
  element.textContent = hash;
}

function displayFileContent(content){
  const element = document.querySelector('#file-content');
  element.textContent = content;
}

function displayFrequncy(){
  const nameContainer = document.querySelector('#name-chart');
  const timeContainer = document.querySelector('#time-chart');
  const dayContainer = document.querySelector('#day-chart');

  nameContainer.innerHTML = '';
  timeContainer.innerHTML = '';
  dayContainer.innerHTML = '';
  for (let i=0; i<5; i++){
    const name = scriptProfile['nameFrequency'][i][0];
    const nameFreq = scriptProfile['nameFrequency'][i][1];
    const hour = scriptProfile['hourFrequency'][i][0];
    const hourFreq = scriptProfile['hourFrequency'][i][1];
    const day = scriptProfile['dayFrequency'][i][0];
    const dayFreq = scriptProfile['dayFrequency'][i][1];

    const nameItem = document.createElement('p');
    nameItem.textContent = String(i + 1) + '위: ' + name + '(' + String(nameFreq/splittedScript.length * 100) + '%)';
    const timeItem = document.createElement('p');
    timeItem.textContent = String(i + 1) + '위: ' + hour + '시 (' + String(hourFreq/splittedScript.length * 100) + '%)';
    const dayItem = document.createElement('p');
    dayItem.textContent = String(i + 1) + '위: ' + day + '(' + String(dayFreq/splittedScript.length * 100) + '%)';

    nameContainer.append(nameItem);
    timeContainer.append(timeItem);
    dayContainer.append(dayItem);
  }
}

function toogleSection(e) {
  const script = document.querySelector('#file-content')
  const toggleBtn = e.target

  if (script.classList.contains('hide')){
    toggleBtn.textContent = toggledText;
  }
  else{
    toggleBtn.textContent = notToggledText;
  }

  script.classList.toggle('hide')

  if (scriptData !== null){
    script.textContent = scriptData;
  }
  else{
    script.textContent = '보여드릴게 없어요! 파일을 업로드 해 주세요.';
  }
}

//File
function readSingleFile(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = initiateFile
  reader.readAsText(file);
}

function initiateFile(e) {
  const contents = e.target.result;
  scriptData = e.target.result;
  splittedScript = scriptData.split('\n');
  const md5 = generateHash(contents);
  displayHash(md5);
  displayFileContent(contents);

  const lang = detectLanguage(splittedScript);
  saveFrequency(splittedScript,  lang);
  displayFrequncy();
}



function main(){
  document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
  document.querySelector('.toggle-btn')
  .addEventListener('click', toogleSection);
}

main();
