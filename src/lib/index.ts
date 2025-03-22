// place files you want to import through the `$lib` alias in this folder.

function subsets(word : string){
    
    let result: string[][] = []

    function recursive_sub(word: string, start: number, working: string[], result: string[][]){
        result.push([...working])
        for (let i = start; i < word.length; i++){
            working.push(word[i])
            recursive_sub(word, i + 1, working, result)
            working.pop()
        }
        return result
    }
    recursive_sub(word, 0, [], result)
    return result.map(item => item.join())
}

export function analyzeWord(word: string, userWord: string){
    let green = 0
    let yellow = 0
    let tempWord = word.slice(0)
    //Check each letter of userword to see if it is in the right place
    for (let i = 0; i < userWord.length; i++){
        if (userWord[i] == word[i]){
            green += 1 
            tempWord = tempWord.replace(userWord[i], "")
        }
        else{
            if (tempWord.includes(userWord[i])){
                yellow += 1
                tempWord = tempWord.replace(userWord[i], "")
            }
        }
    }

    return {green: green, yellow: yellow}
}

export function findWords(word: string, history: {userWord: string, green: number, yellow: number}[], dict: string[]){
    let remainingWords = [...dict]
    let remainingWordsHistory: string[][] = []
    let possibleWords: string[] = []
    for (let entry of history){
        //0 Green 0 Yellow Case
        if (entry.green == 0 && entry.yellow == 0){
            const zeroregex = "[^" + entry.userWord + "]{5}"
            for (let w of remainingWords){
                if (w.match(new RegExp(zeroregex))){
                    possibleWords.push(w)
                }
            }
            remainingWords = [...possibleWords]
            remainingWordsHistory.push([...remainingWords])
            possibleWords = []
            continue
        }
        const wordSubsets = subsets(entry.userWord)
        
        //Check greens
        if (entry.green >= entry.userWord.length){
            remainingWords = [entry.userWord]
            remainingWordsHistory.push([...remainingWords])
            break
        }
        if (entry.green > 0){
            const greenSubsets = wordSubsets.filter(subset => subset.length == entry.green)
            for (let w of remainingWords){
                for (let s of greenSubsets){
                    if (w.match(new RegExp(s))){
                        possibleWords.push(w)
                        continue
                    }
                }
            }
            remainingWords = [...possibleWords]
            possibleWords = []
        }
        if (entry.yellow > 0){
            const yellowSubsets = wordSubsets.filter(subset => subset.length == entry.yellow)
            //For a word from the remaining dict to pass it needs to match all generated regex from any one of the subsets
            //If the word is FENCE and we have the subset FEE from the user word FEEDS (0 green 3 yellow) it would need to pass /F/ and /E\w*E/ (which it does)
            for (let w of remainingWords){
                for (let sub of yellowSubsets){
                    let matched = true
                    const regexSet = genRegexSet(sub)
                    for (let regex of regexSet){
                        //If a regex doesn't match stop and try the next subset
                        if (!w.match(regex)){
                            matched = false
                            break
                        }
                    }
                    //If all regex matched the word passes and we can stop looking at subsets
                    if (matched){
                        possibleWords.push(w)
                        break
                    }
                }
            }
            remainingWords = [...possibleWords]
            possibleWords = []
        }
        //At this point both 0/0, greens, and yellow are checked. Add the remaining words to the history.
        remainingWordsHistory.push([...remainingWords])
    }
    return remainingWordsHistory
}

function genRegexSet(subset: string){
    let result: RegExp[] = []
    //Generate an array of regex to compare to words. Necessary to account for duplicate letters. The sort helps find duplicates.
    let sub = subset.split('').sort().join()
    let prevChar = ""
    let buildRegex = ""
    //The idea here is to make a regex for each letter or group of duplicate letters in a subset
    //Example: if the subset is "foo", we want "f" and "oo", in regex form /f/ and /o\w*o/
    for (let i = 0; i < sub.length ; i++){
        if (sub[i] !== prevChar){
            if (buildRegex !== ""){
                result.push(new RegExp(buildRegex))
                buildRegex = ""
            }
            buildRegex = sub[i]
            prevChar = sub[i]
        }
        else{
            buildRegex += "\\w*" + sub[i]
        }
    }
    result.push(new RegExp(buildRegex))
    
    return result
}