<script>
    import Tile from './Tile.svelte';
    import { socketStore, roomStore, getUserTeam, getTeamColor } from './store.js'
    export let board, width, height;
    let selectedCol

    function handleMove(col) {
        $socketStore.emit('addToCol', { roomId: $roomStore.id, col})
    }

    function onMouseMove(e) {
        console.log(e)
        var bounds = e.target.getBoundingClientRect();
        selectedCol = Math.floor((e.clientX - bounds.left)/(500/width));
        if (selectedCol < 0) selectedCol = 0;
        if (selectedCol > width-1) selectedCol = width-1;
    }
</script>

<div class="grid" style="grid-template-columns: repeat({width}, 1fr); grid-template-rows: auto repeat({height}, 1fr);" on:mousemove={onMouseMove} on:click={handleMove(selectedCol)}>
    {#each board as row, y}
		{#each row as tile, x} 
            <Tile active={tile.team >= 0} flashing={x == selectedCol && $roomStore.turn == getUserTeam($roomStore, $socketStore.userId)} col={x + 1} row={y + 1} color={getTeamColor($roomStore, tile.team)} flashColor={getTeamColor($roomStore, getUserTeam($roomStore, $socketStore.userId))}/>
		{/each}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		position: relative;
        min-width: 500px;
        min-height: 500px;
		margin: auto;
		grid-gap: 15px;
		padding: 15px;
		background-image: linear-gradient(to bottom right, rgb(31 119 198), rgb(50, 96, 232));
        border-radius: 2em;
        box-shadow: 4px 6px 18px 5px #44444459;
        z-index: 1;
	}

    .btn {
        display: none;
        border-radius: 10em;
        cursor: pointer;
        z-index: 1;
    }

    .btn.active  {
        display: block;
    }

    .btn svg {
        height: 25px;
    }

	@media (max-width: 560px) {
		.grid {
			width: 80vw;
			height: 80vw;
		}
	}
</style>