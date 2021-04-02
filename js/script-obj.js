import { generateHash } from "/js/min.md5.js";

export const LangEnum = Object.freeze({ ko: 0, en: 1, jp: 2 });
const KO_DATE_REGEX = /(?<=\n)\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2}(?=,)/g;
const KO_NAME_REGEX = /(?<=(\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2},\s)).+(?=\s:\s)/g;
const KO_CHATTING_REGEX = /(?<=(\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2},\s.+\s:\s)).+/g
const postposition = ['이', '가', '께서', '에서', '서', '이다', '의', '을', '를', '에', '에게', '께', '한테', '에서', '에게서', '로', '로서', '고', '라고', '이라고', '와', '과', '랑', '이랑', '처럼', '만큼', '요', '밖에', '이나', '이란', '이든가', '이든지', '이나마', '이야말로'];

export function createScriptObj(content){
  //Property
  const md5Hash = generateHash(content);
  const script = content;
  const parsedDates = parseToDateArray(script);
  const parsedWords = parseWords(script);
  //Support Korean only for now
  const lang = content.test(/(?<=\n)(저장한 날짜)\s:\s\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2}(?=\n)/)?LangEnum.ko : null;
  const wordFrequency = countWordsFrequency(parsedWords);
  const nameFrequency = countWordsFrequency(script);
  const dayFrequency = countDayFrequency(parsedDates);
  const hourFrequency = countHourFreqeuncy(parsedDates);
  const beginDate = parsedDates[0];
  const endDate = parsedDates[parsedDates.length - 1];

  //Private Method
  const countWordsFrequency = (parsedWords) => {return countFrequency(parsedWords)};

  const countDayFrequency = function(parsedDate){
    const dayArray = []
    parsedWords.forEach(element => {
      const dayLabel = getDayLabel(element.getDay());
      dayArray.push(dayLabel);
    });

    return countFrequency(dayArray);
  };

  const countHourFreqeuncy = function(parsedDate){
    const hourArray = []
    parsedDate.forEach(element => {
      hourArray.push(element.getHours());
    });

    return countFrequency(hourArray);
  };

  const countNameFrequnecy = function(script){
    const nameArray = script.match(KO_NAME_REGEX);
    return countFrequency(nameArray);
  }

  const parseToDateArray = function(script){
    const dateStrArray = script.match(KO_DATE_REGEX);
    const dateArray = [];
    const KO_YEAR_REGEX = /\d{4}(?=년)/;
    const KO_MONTH_REGEX = /\d{1,2}(?=월)/;
    const KO_DAY_REGEX = /\d{1,2}(?=일)/;
    const KO_TIME_REGEX = /(?<=((오전)|(오후))\s)\d{1,2}:\d{1,2}/;
    
    dateStrArray.array.forEach(element => {
      const year = parseInt(element.match(KO_YEAR_REGEX)[0]);
      const month = parseInt(element.match(KO_MONTH_REGEX)[0]);
      const day = parseInt(element.match(KO_DAY_REGEX)[0]);
      const timeStrArray = element.match(KO_TIME_REGEX)[0].split(':');
      let hour = parseInt(timeStrArray[0]);
      const minute = parseInt(timeStrArray[1]);
      const isAfternoon = element.test(/(오후)/);

      if (isAfternoon){
        hour += 12;
      }

      dateArray.push(new Date(year, month - 1, day, hour, minute));
    });
    
    return dateArray;
  };

  const parseWords = function(script){
    const chattingLines = script.match(KO_CHATTING_REGEX);
    const words = chattingLines.split(' ');
    for(i = 0; i < words.length; i++){
      words[i] = removePostposition(words[i]);
    }

    return words;
  };

  const countFrequency = function(array){
    let map = new Map();
    array.forEach(element => {
      if(map.has(element)){
        ++map[element];
      }
      else{
        map.set(element, 1);
      }
    });

    const sorted = Object.keys(dict)
    .map(function (key) {return [key, dict[key]];})
    .sort(function (first, second) {return second[1] - first[1];});

    return sorted;
  };

  const removePostposition = function(word) {
    postposition.forEach(filterWord => {
      if(word.endsWith(filterWord)){
        return words.slice(0,word.length - filterWord.length);
      }
    });
    return word;
  }

  const getDayLabel = function(day) {
    const week = new Array("일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일");
    const dayLabel = week[day];
    return dayLabel;
  }

  return {
    getMd5Hash: () => {return md5Hash;},

    getLanguage: () => {return lang;},

    getScript: () => {return script;},

    getWordFrequency: () => {return wordFrequency;},

    getNameFrequency: () => {return nameFrequency;},

    getDayFrequency: () => {return dayFrequency;},

    getHourFrequency: () => {return hourFrequency},

    getBeginDate: () => {return beginDate;},

    getEndDate: () => {return endDate}
  };
}