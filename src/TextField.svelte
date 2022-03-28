<script>
    import { createEventDispatcher } from 'svelte';
    export let value = '', placeholder = '', disabled = false
    const dispatch = createEventDispatcher();

    const handleKeypress = e => {
        if (e.charCode === 13) {
            dispatch('submit');
        }
    }
</script>

<input type="text" {placeholder} {value} {disabled} on:input|preventDefault on:keypress={handleKeypress}/>

<style>
    input {
        cursor: pointer;
        outline: none;
        font-size: 1.5em;
        width: 8em;
        color: #776e65;
        padding: 0.5em 0.8em;
        border-radius: 0.25em;
        transition: all 0.2s ease-in-out;
        border: 0.15em solid #eee4da;
        margin: 0;
        box-sizing: content-box;
    }

    input:hover:not(:disabled), input:focus:not(:disabled) {
        border: 0.15em solid #ddd;
    }
    
</style>