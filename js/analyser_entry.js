import {generateHash} from '/js/min.md5.js'

let scriptProfile = {}
let scriptData = null;
let splittedScript;
const toggledText = '▲ 접기'
const notToggledText = '▼ 펼치기'

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
}



function main(){
  document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
  document.querySelector('.toggle-btn')
  .addEventListener('click', toogleSection);
}

main();
