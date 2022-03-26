<script>
    export let active, col, row, color
</script>

<span class="tile {active ? "active" : ""}" style="grid-row-start: {row+1}; grid-column-start: {col}; background: linear-gradient(0, {color + ", "+ color}cc);">
</span>

<style>
    .tile {
        aspect-ratio: 1;
        border-radius: 50%;
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 1px 3px 0px #44444496;
        background-color: #fff;
    }

    .active {
        border: 3px dashed #00000059;
    }
</style>