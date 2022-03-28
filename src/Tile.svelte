<script>
    export let active, flashing, col, row, color, flashColor
</script>

<span class="tile-slot {flashing && !active ? "flashing" : ""}" style="grid-row-start: {row+1}; grid-column-start: {col}; animation-delay: {(row-1)*0.05}s; --flash-color: {flashColor}70;">
    <span class="tile {active ? "active" : ""}" style="background: linear-gradient(0, {color + ", "+ color}cc);">
    </span>
</span>

<style>
    .tile-slot {
        background-color: #fff;
        aspect-ratio: 1;
        border-radius: 50%;
        box-shadow: 1px 3px 0px #44444496;
        pointer-events: none;
    }

    .flashing {
        animation: flash 1.5s infinite ease-in-out;
    }

    .tile {
        aspect-ratio: 1;
        border-radius: 50%;
        align-self: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .active {
        animation: 0.5s ease-out 0s 1 slideDown;
        border: 3px dashed #00000059;
    }

    @keyframes slideDown {
        0% {
            transform: translateY(-100em);
        }
        100% {
            transform: translateY(0);
        }
    }

    @keyframes flash {
        0% {
            box-shadow: inset 0 0 0 1000px var(--flash-color);
        }
        50% {
            box-shadow: inset 0 0 0 1000px #fff;
        }
        100% {
            box-shadow: inset 0 0 0 1000px var(--flash-color);
        }
    }
</style>