export const LangEnum = Object.freeze({ko:0, en:1, jp: 2});

export function detectLanguage(scriptArray) {
    if (scriptArray[1].includes("저장한 날짜")){
        return LangEnum.ko;
    }

    if (scriptArray[1].includes("Date Saved")){
        return LangEnum.en;
    }

    if (scriptArray[1].includes("保存した日付")){
        return LangEnum.jp;
    }

    return null
}

export function getStartDate(scriptArray, lang) {
    return parseDate(scriptArray[5], lang);
}

export function getLastDate(scriptArray, lang) {
    return parseDate(scriptArray[scriptArray.length -2], lang);
}

export function parseDate(line, lang) {
    if(lang === LangEnum.ko){
        const splitted = line.split(line, ' ');
        const year = splitted[0].substr(0, 4);
        const month = splitted[1].subtring(0, splitted[1].length - 2);
        const day = splitted[2].substr(0, splitted[2].length - 1);
        const time = splitted[4].substr(0, splitted[2].length - 1);
        let hourAndMinut = time.split(time, ':');

        if(splitted[3] == '오후'){
            hourAndMinut[0] += 12;
        }
        
        return new Date(year, month-1, day, hourAndMinut[0], hourAndMinut[1]);
    }
}

export function parseName(line, lang) {
    if(lang == LangEnum.ko){
        const commaIndex = line.indexOf(',');
        const colonIndex = line.indexOf(':');
        return line.substring(commaIndex + 2, colonIndex - 2);
    }
}

export function parseChatting(line, lang) {
    if(lang == LangEnum.ko){
        const colonIndex = line.indexOf(':');
        return line.substring(colonIndex + 2, line.length - 1);
    }
}