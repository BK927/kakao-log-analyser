import { generateHash } from "/js/md5.min.js";

export const LangEnum = Object.freeze({ ko: 0, en: 1, jp: 2 });
const KO_DATE_REGEX = /(?<=\n)\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2}(?=,)/g;
const KO_NAME_REGEX = /(?<=(\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2},\s)).+?(?=\s:\s)/g;
const KO_CHATTING_REGEX = /(?<=(\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2},\s.+\s:\s)).+/g
const KO_REGEX_WORDS_FILTER = /(ㅋ+)|(ㅇ+)|(ㅎ+)|(사진)|(이모티콘)|(ㅇㅅㅇ)|(ㄹㄱㄴ)|(ㅗㅜㅑ)|(샵검색:)|(아니)|(저거)|(와)|(왜)|(진짜)|(이제)|(근데)|(난)|(내가)|(지금)|(이거)|(그리고)|(요즘)|(그냥)|(너무)/g
const postposition = ['이', '가', '께서', '에서', '서', '이다', '의', '을', '를', '에', '에게', '께', '한테', '에서', '에게서', '로', '로서', '고', '라고', '이라고', '와', '과', '랑', '이랑', '처럼', '만큼', '요', '밖에', '이나', '이란', '이든가', '이든지', '이나마', '이야말로'];

export function createScriptObj(content){
  //Private Method
  const countWordsFrequency = (parsedWords) => {return countFrequency(parsedWords)};

  const countDayFrequency = function(parsedDate){
    const dayArray = []
    parsedDate.forEach(element => {
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
    
    dateStrArray.forEach(element => {
      const year = parseInt(element.match(KO_YEAR_REGEX));
      const month = parseInt(element.match(KO_MONTH_REGEX));
      const day = parseInt(element.match(KO_DAY_REGEX));
      const timeStrArray = element.match(KO_TIME_REGEX)[0].split(':');
      let hour = parseInt(timeStrArray[0]);
      const minute = parseInt(timeStrArray[1]);
      const isAfternoon = new RegExp('(오후)').test(element);

      if (isAfternoon){
        hour += 12;
      }

      dateArray.push(new Date(year, month - 1, day, hour, minute));
    });
    
    return dateArray;
  };

  const parseWords = function(script){
    let words =[]
    const trimmed = script.replaceAll(KO_REGEX_WORDS_FILTER, ' ');
    const chattingLines = trimmed.match(KO_CHATTING_REGEX);
    chattingLines.forEach(element => {
      words = words.concat(element.split(' '));
    });
    for(let i = 0; i < words.length; i++){
      words[i] = removePostposition(words[i]);
    }

    return words;
  };

  const countFrequency = function(arr){
    let map = new Map();
    for(let i = 0; i < arr.length; i++){
      if(map.has(arr[i])){
        map.set(arr[i], map.get(arr[i]) + 1);
      }
      else{
        map.set(arr[i], 1);
      }
    }

    const arrForSort = Array.from(map);
    arrForSort.sort(function (first, second) {return second[1] - first[1];});
    return arrForSort;
  };

  const removePostposition = function(word) {
    postposition.forEach(filterWord => {
      if(word.endsWith(filterWord)){
        return word.slice(0,word.length - filterWord.length);
      }
    });
    return word;
  }

  const getDayLabel = function(day) {
    const week = new Array("일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일");
    const dayLabel = week[day];
    return dayLabel;
  }

  //Property
  const md5Hash = generateHash(content);
  const script = content;
  const parsedDates = parseToDateArray(script);
  //const parsedWords = parseWords(script);
  //Support Korean only for now
  const lang = /(?<=\n)(저장한 날짜)\s:\s\d{4}년\s\d{1,2}월\s\d{1,2}일\s((오전)|(오후))\s\d{1,2}:\d{1,2}(?=\n)/.test(script)?LangEnum.ko : null;
  //const wordFrequency = countWordsFrequency(parsedWords);
  const nameFrequency = countNameFrequnecy(script);
  const dayFrequency = countDayFrequency(parsedDates);
  const hourFrequency = countHourFreqeuncy(parsedDates);
  const beginDate = parsedDates[0];
  const endDate = parsedDates[parsedDates.length - 1];
  const numberOfLines = parsedDates.length;

  return {
    getMd5Hash: () => {return md5Hash;},

    getLanguage: () => {return lang;},

    getScript: () => {return script;},

    //getWordFrequency: () => {return wordFrequency;},

    getNameFrequency: () => {return nameFrequency;},

    getDayFrequency: () => {return dayFrequency;},

    getHourFrequency: () => {return hourFrequency},

    getBeginDate: () => {return beginDate;},

    getEndDate: () => {return endDate},

    getnumberOfLines: numberOfLines
  };
}