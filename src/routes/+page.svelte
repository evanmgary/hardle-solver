<script lang="ts">
    import * as RadioGroup from "$lib/components/ui/radio-group/"
    import { history, remainingWordsHistory } from "$lib/state.svelte";
    import Wordbox from "$lib/wordbox.svelte";
    import {inDict, findWords, analyzeWord, getRandomWord} from "$lib/index"
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    let wordLocked = $state(false)
    let chosenWord = $state("")
    let userWord = $state("")
    let mode = $state("user-word")
    let userGreen = $state(0)
    let userYellow = $state(0)
    let randomWord = $state(getRandomWord())

    function clearAll(){
        history.length = 0
        remainingWordsHistory.length = 0
        chosenWord = ""
        userWord = ""
        wordLocked = false
        randomWord = getRandomWord()
    }

    function enterChosenWord(e: KeyboardEvent){
        if (e.code == "Enter"){
            if (!wordLocked && chosenWord.length == 5){
                if (!inDict(chosenWord)){
                    chosenWord = ""
                    return
                }
                wordLocked = true
                chosenWord = chosenWord.toLowerCase() 
            }
            if (chosenWord.length != 5){
                chosenWord = ""
            }
        }
    }
    function enterUserWord(e: KeyboardEvent){
        const inputWord = (mode === 'random-word' ? randomWord : chosenWord)
        if (e.code == "Enter"){
            if (userWord.length == 5){
                if (!inDict(userWord)){
                    userWord = ""
                    return
                }
                if (mode === "unknown"){
                    if ((userGreen + userYellow) > 5){
                        return
                    }
                    history.push({word: userWord.toLowerCase(), green: userGreen, yellow: userYellow})
                }
                else{
                    const analyzeResult = analyzeWord(inputWord, userWord)
                    history.push({word: userWord.toLowerCase(), green: analyzeResult.green, yellow: analyzeResult.yellow})
                }
               
                findWords(userWord)
                userWord = ""
            }
            else{
                userWord = ""
            }
        }
    }

    function incrementGreen(){
        userGreen += 1
        if (userGreen > 5){
            userGreen = 0
        }
    }
    function incrementYellow(){
        userYellow += 1
        if (userYellow > 5){
            userYellow = 0
        }
    }
</script>

<style>
    .wordboxes{
        margin: auto;
        width: 160px;
    }
    .inputarea{
        margin:auto;
        margin-top: 10px;
        width: 160px;
    }
</style>

<h1 class={['m-auto', 'text-xl', 'text-center', 'my-10']}>Hardle Solver</h1>
<Input class={['w-40','h-8', 'm-auto', 'my-4', 'text-lg', 'text-center', 'resize-none', 'uppercase', 'align-middle', 'bg-white', 'text-black']} maxlength={5} bind:value={chosenWord} placeholder="enter word" disabled={wordLocked} on:keydown={enterChosenWord} style="visibility: {mode === "user-word" ? "visible" : "hidden"};"></Input>
<div class={['m-auto', 'flex', 'w-60']}>
    <RadioGroup.Root bind:value={mode} on:change={clearAll} class="flex flex-column mr-10">
        <div class="flex items-center space-x-2">
            <RadioGroup.Item value="user-word" id="r1" />
            <Label for="r1">Entered Word</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value="random-word" id="r2" />
            <Label for="r2">Random Word</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroup.Item value="unknown" id="r3" />
            <Label for="r3">Unknown</Label>
          </div>
          <RadioGroup.Input name="mode" />
    </RadioGroup.Root>
    <Button on:click={clearAll}>Clear All</Button>
</div>

<div>
    <ul class={['wordboxes']}>
    {#each history as box, i (box)}
        <li>
            <Wordbox history={box} remainingWords={remainingWordsHistory[i]} wordLength={5} autofocus></Wordbox>
        </li>
    {/each}
    </ul>
    
</div>
<div class="flex flex-row m-auto w-50 inputarea">
    <Input class={['w-40','h-8','text-lg', 'text-center', 'resize-none',  'bg-white', 'text-black', 'uppercase']} bind:value={userWord} maxlength={5} disabled={!(wordLocked || (mode !== "user-word"))} on:keydown={enterUserWord}></Input>
    {#if mode === "unknown"}
        <div class={['flex', 'flex-row', 'text-white', 'h-8', 'items-middle']}>
            <button class={['bg-[#158c41]', 'w-8', 'border-3','align-middle','text-center', 'mr-2']} onclick={incrementGreen}>
                <span>{userGreen}</span>
            </button>
            <button class={['bg-[#d79a06]', 'w-8', 'border-3','align-middle','text-center' ,'mr-2']} onclick={incrementYellow}>
                <span>{userYellow}</span>
            </button>
        </div>
    {/if}
</div>

