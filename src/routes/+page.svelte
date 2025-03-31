<script lang="ts">
    import * as RadioGroup from "$lib/components/ui/radio-group/"
    import { history, remainingWordsHistory } from "$lib/state.svelte";
    import Wordbox from "$lib/wordbox.svelte";
    import {findWords, analyzeWord} from "$lib/index"
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    let wordLocked = $state(false)
    let chosenWord = $state("")
    let userWord = $state("")
    let mode = $state("user-word")

    function clearAll(){
        history.length = 0
        remainingWordsHistory.length = 0
        chosenWord = ""
        userWord = ""
        wordLocked = false
    }

    function enterChosenWord(e: KeyboardEvent){
        if (e.code == "Enter"){
            if (!wordLocked && chosenWord.length == 5){
                wordLocked = true
                chosenWord = chosenWord.toLowerCase() 
            }
            if (chosenWord.length != 5){
                chosenWord = ""
            }
        }
    }
    function enterUserWord(e: KeyboardEvent){
        if (e.code == "Enter"){
            if (userWord.length == 5){
                const analyzeResult = analyzeWord(chosenWord, userWord)
                history.push({word: userWord.toLowerCase(), green: analyzeResult.green, yellow: analyzeResult.yellow})
                findWords(userWord)
                userWord = ""
            }
            else{
                userWord = ""
            }
        }
    }
</script>

<style>
    .wordboxes{
        margin: auto;
        width: 160px;
    }
</style>

<h1 class={['m-auto', 'text-xl', 'text-center', 'my-10']}>Hardle Solver</h1>
<Input class={['w-40','h-8', 'm-auto', 'my-4', 'text-lg', 'text-center', 'resize-none', 'uppercase', 'align-middle', 'bg-white', 'text-black']} maxlength={5} bind:value={chosenWord} placeholder="enter word" disabled={wordLocked} on:keydown={enterChosenWord}></Input>
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

<div>---------------</div>

<div>
    <ul class={['wordboxes']}>
    {#each history as box, i (box)}
        <li>
            <Wordbox history={box} remainingWords={remainingWordsHistory[i]} wordLength={5} autofocus></Wordbox>
        </li>
    {/each}
    </ul>
    
</div>
<Input class={['w-40','h-8', 'm-auto', 'mt-4','text-lg', 'text-center', 'resize-none', 'align-middle', 'bg-white', 'text-black', 'uppercase']} bind:value={userWord} maxlength={5} disabled={!wordLocked} on:keydown={enterUserWord}></Input>