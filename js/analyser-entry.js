import { generateHash } from "/js/md5.min.js";
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
    displayHash(scriptData.getMd5Hash());
    displayNameArticle(scriptData.getNameFrequency());
    displayDayArticle(scriptData.getDayFrequency());
    displayHourArticle(scriptData.getHourFrequency());
    setArticlesVisibility(true);
    drawTextCloud(scriptData.getWordFrequency());
  };

  const displayHash = function(hash){
    const node = document.querySelector('#hash-code');
    node.textContent = hash
  }

  const drawTextCloud = function(wordFrequency){
    const parent = document.querySelector('#text-cloud').parentNode;
    const wordsForCloud = [];
    const trimmedWords = wordFrequency.slice(0, 100);
    trimmedWords.forEach(element => {
      wordsForCloud.push({text: element[0], size: element[1] * 50});
    });
    const textCloud = wordCloud('#text-cloud', wordsForCloud, parent.offsetWidth, 500);
    textCloud.update(wordsForCloud);
  };

  const setArticlesVisibility =  function(flag){
    const articles = document.querySelectorAll('.container > article');
    for (let article of articles){
      if (flag){
        article.classList.toggle('active');
      }
    }
  };

  const displayNameArticle = function (nameFrequency){
    const chartNode = document.querySelector('#name-chart');
    const textNode = document.querySelector('#name-ranking');
    const top5 = nameFrequency.slice(0, 5);
    const chart = drawChart(chartNode, '이름', top5);
    showRankText(textNode, nameFrequency);
  };

  const displayDayArticle = function (dayFrequency){
    const chartNode = document.querySelector('#day-chart');
    const textNode = document.querySelector('#day-ranking');
    const chart = drawChart(chartNode, '요일', dayFrequency);
    showRankText(textNode, dayFrequency);
  };

  const displayHourArticle = function(hourFrequency){
    const chartNode = document.querySelector('#time-chart');
    const textNode = document.querySelector('#time-ranking');
    const top7 = hourFrequency.slice(0, 7);
    const chart = drawChart(chartNode, '시간', top7);
    showRankText(textNode, hourFrequency);
  }

  const drawChart = function(domNode, label, frquencyList){
    const labels = [];
    const values = [];
    frquencyList.forEach(element => {
      labels.push(element[0]);
      values.push(element[1]);
    });
    return Chart.createBarChart(domNode, label, labels, values);
  };

  const showRankText = function (domNode, list, cutline = -1) {
    let topItems = list;
    if (cutline > 0){
      topItems = list.slice(0, cutline);
    }

    topItems.forEach(element => {
      const item = document.createElement("p");
      item.textContent = String(element[0]);
      domNode.append(item);
    });
  }
  
  const reader = new FileReader();
  reader.onload = initFile;
  reader.readAsText(file);
}

(function() {
  const toggleFileContent = function(){
    const btn = document.querySelector('.toggle-btn');
    const fileContent = document.querySelector('#file-content');

    btn.classList.toggle("active");
    fileContent.classList.toggle("active");
  };

  document.getElementById("file-input").addEventListener("change", readSingleFile, false);
  document.querySelector(".toggle-btn").addEventListener("click", toggleFileContent);
})();
