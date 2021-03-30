export const LangEnum = Object.freeze({ko:0, en:1, jp: 2});

function checkIsValidLine(line, lang){
    if(lang === LangEnum.ko){
        if(line.split(',').length >= 2 && line.split(' ').length >= 8
            && line.split(':').length >= 2){
            return true;
        }
    }

    return false
}

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
        if(!checkIsValidLine(line, lang)){
            return null;
        }
        const splitted = line.split(' ');
        const year = parseInt(splitted[0].substr(0, 4));
        const month = parseInt(splitted[1].substr(0, splitted[1].length - 1));
        const day = parseInt(splitted[2].substr(0, splitted[2].length - 1));
        const time = splitted[4].substr(0, splitted[4].length - 1);
        let hourAndMinut = time.split(':');
        let hour = parseInt(hourAndMinut[0]);
        const minut = parseInt(hourAndMinut[1]);

        if(splitted[3] == '오후'){
            hour += 12;
        }
        
        return new Date(year, month-1, day, hour, minut);
    }
}

export function parseName(line, lang) {
    if(lang == LangEnum.ko){
        if(!checkIsValidLine(line, lang)){
            return null;
        }
        const pos = line.indexOf(':');
        const commaIndex = line.indexOf(',');
        const colonIndex = line.indexOf(':', pos + 1);
        return line.substring(commaIndex + 2, colonIndex - 1);
    }
}

export function parseChatting(line, lang) {
    if(lang == LangEnum.ko){
        if(!checkIsValidLine(line, lang)){
            return null;
        }
        const colonIndex = line.indexOf(':');
        return line.substring(colonIndex + 2, line.length - 1);
    }
}