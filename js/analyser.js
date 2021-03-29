import {generateHash} from './md5.js'

let fileProfile = {}

function readSingleFile(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;
    const md5 = generateHash(contents);
    displayHash(md5)
  };
  reader.readAsText(file);
}

function displayHash(hash) {
  const element = document.getElementById('file-content');
  element.textContent = hash
}

function main(){
  document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);
}

main()
