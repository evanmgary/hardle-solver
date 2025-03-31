<script lang='ts'>
    import * as Popover from "$lib/components/ui/popover";
    let props = $props()
    const letters: string[] = Array(props.wordLength).fill('')
    for (let i = 0; i < props.wordLength; i++){
        letters[i] = props.history.word[i]
    }
</script>

<div>
    <Popover.Root>
        <Popover.Trigger>
            <div class={['flex', 'flex-row', 'w-70']}>
                <div class={['flex', 'flex-row','w-40' ,'h-8']}>
                    {#each letters as letter, i}
                        <div class={['basis-1/5', 'h-full', 'uppercase', 'border', 'border-blue-100', 'mr-1']}><span>{letter}</span></div>
                    {/each}
                </div>
                <div class={['flex', 'flex-row', 'text-white']}>
                    <div class={['bg-[#158c41]', 'w-8', 'border-3', 'align-middle', 'mr-2']}>
                        <span>{props.history.green}</span>
                    </div>
                    <div class={['bg-[#d79a06]', 'w-8', 'border-3', 'align-middle', 'mr-2']}>
                        <span>{props.history.yellow}</span>
                    </div>
                    <div class={[]}>
                        <span>({props.remainingWords.length})</span>
                    </div>
                </div>
            </div>
        </Popover.Trigger>
        <Popover.Content>
            <div>
                <span>Possible words:</span>
                <span>
                    {#each props.remainingWords.slice(0, 70) as word}
                        {word + " "}
                    {/each}
                    {"..."}
                </span>
                
            </div>
        </Popover.Content>
    </Popover.Root>
    
</div>
