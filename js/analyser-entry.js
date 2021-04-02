import { generateHash } from "/js/min.md5.js";
import {LangEnum, createScriptObj} from "/js/script-obj.js";
import * as Chart from "/js/draw-chart.js";
import {wordCloud} from "/js/text-cloud.js"

function readSingleFile(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const initFile = function(e){
    const scriptData = createScriptObj(e.target.result);
    const fileContent = document.querySelector('#file-content');
    fileContent.textContent = scriptData.getScript();
    drawTextCloud(scriptData.getWordFrequency());
    setArticlesVisibility(true);
  };

  const drawTextCloud = function(wordFrequency){
    const wordsForCloud = [];
    const textCloud = wordCloud('#text-cloud');
    wordFrequency.forEach(element => {
      wordsForCloud.push({text: element[0], size: element[1]});
    });
    textCloud.update(wordsForCloud);
  };

  const setArticlesVisibility =  function(flag){
    articles = document.querySelectorAll('.container > article');
    for (let article of articles){
      if (flag){
        article.classList.toggle('active');
      }
    }
  };
  
  const reader = new FileReader();
  reader.onload = initFile;
  reader.readAsText(file);
}

(function() {
  const toggleFileContent = function(){
    const btn = document.querySelector('#toggle-btn');
    const fileContent = document.querySelector('#file-content');

    btn.classList.toggle("active");
    fileContent.classList.toggle("active");
  };

  document.getElementById("file-input").addEventListener("change", readSingleFile, false);
  document.querySelector(".toggle-btn").addEventListener("click", toggleFileContent);
})();
