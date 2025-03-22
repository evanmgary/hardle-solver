<script>
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import Toggle from "$lib/components/ui/toggle/toggle.svelte";
    import { data } from "$lib/state.svelte";
    import Wordbox from "$lib/wordbox.svelte";
    import {findWords, analyzeWord} from "$lib/index"
</script>

<h1>Hardle Solver</h1>
