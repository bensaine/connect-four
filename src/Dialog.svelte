<script>
    export let active = true
</script>

{#if active}
    <div class="overlay" on:click={() => active = false}>
        <div class="dialog">
            <slot></slot>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);        
        z-index: 2;
        cursor: pointer;
    }

    .dialog {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5em;
        color: #776e65;
        background: #fff6ec;
        width: 25em;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        padding: 1em;
        border-radius: 0.5em;
        cursor: default;
    }
</style>