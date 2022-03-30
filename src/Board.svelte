<script>
    import Tile from './Tile.svelte';
    import { socketStore, roomStore, getUserTeam, getTeamColors } from './store.js'
    export let board, width, height;
    let selectedCol, userTeam, teamColors

    function handleMove(col) {
        $socketStore.emit('addToCol', { roomId: $roomStore.id, col})
    }

    function onMouseMove(e) {
        var bounds = e.target.getBoundingClientRect();
        selectedCol = Math.floor((e.clientX - bounds.left)/(500/width));
        if (selectedCol < 0) selectedCol = 0;
        if (selectedCol > width-1) selectedCol = width-1;
    }

    userTeam = getUserTeam($roomStore.players, $socketStore.userId)
    teamColors = getTeamColors($roomStore.teams)
</script>

<div class="grid" style="grid-template-columns: repeat({width}, 1fr); grid-template-rows: auto repeat({height}, 1fr);" on:mousemove={onMouseMove} on:click={handleMove(selectedCol)}>
    {#each board as row, y}
		{#each row as tile, x} 
            <Tile active={tile.team >= 0} flashing={x == selectedCol && $roomStore.turn == userTeam} col={x + 1} row={y + 1} color={teamColors[tile.team]} flashColor={teamColors[userTeam]}/>
		{/each}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		position: relative;
        width: 30em;
        aspect-ratio: 1;
		margin: auto;
		grid-gap: 15px;
		padding: 15px;
		background-image: linear-gradient(to bottom right, rgb(31 119 198), rgb(50, 96, 232));
        border-radius: 1.8em;
        box-shadow: 4px 6px 18px 5px #44444459;
        z-index: 1;
	}

    @media (max-width: 640px) {
        .grid {
            width: 85%;
        }
    }
</style>