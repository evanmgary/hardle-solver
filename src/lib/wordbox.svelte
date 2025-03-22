<script lang='ts'>
    import * as Popover from "./components/ui/popover";
    let props = $props()
    const letters: string[] = Array(props.wordLength).fill('')
    for (let i = 0; i < props.wordLength; i++){
        letters[i] = props.word[i]
    }
</script>

<div>
    <Popover.Root>
        <Popover.Trigger>
            <div class={['flex']}>
                <div class={['w-75', 'h-15', 'border-3']}>
                    {#each letters as letter, i}
                        <div class={['w-1/5', 'h-full', ]}><span>{letter}</span></div>
                    {/each}
                </div>
                <div class={['flex', 'text-white']}>
                    <div class={['bg-[#158c41]']}>
                        <span>{props.green}</span>
                    </div>
                    <div class={['bg-[#d79a06]']}>
                        <span>{props.yellow}</span>
                    </div>
                    <div class={[]}>
                        <span>({props.wordsRemaining.length})</span>
                    </div>
                </div>
            </div>
        </Popover.Trigger>
        <Popover.Content>
            <div>
                <span>Possible words:</span>
                <span>
                    {#each props.possibleWords as word}
                        {word + " "}
                    {/each}
                </span>
                
            </div>
        </Popover.Content>
    </Popover.Root>
    
</div>
