import { generateHash } from "/js/min.md5.js";
import {LangEnum, createScriptObj} from "/js/script-obj.js";
import * as Chart from "/js/draw-chart.js";

//File
function readSingleFile(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = initiateFile;
  reader.readAsText(file);
}

function initiateFile(e) {
  const contents = e.target.result;
  scriptData = e.target.result;
  splittedScript = scriptData.split("\n");
  const md5 = generateHash(contents);
  displayHash(md5);
  displayFileContent(contents);

  const lang = detectLanguage(splittedScript);
  saveFrequency(splittedScript, lang);
  displayFrequncy();
  displayDayChart();
}

function main() {
  document.getElementById("file-input").addEventListener("change", readSingleFile, false);
  document.querySelector(".toggle-btn").addEventListener("click", toogleSection);
}

main();
