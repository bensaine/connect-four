<script>
    import Tile from './Tile.svelte';
    import { socketStore, roomStore } from './store.js'
    export let board, width, height;

    function handleMove(col) {
        $socketStore.emit('addToCol', { roomId: $roomStore.id, col})
    }

    // socket.on('addToCol', (data) => {
    //     console.log(data)
    //     if (data.from === socket.userId) return
    //     console.log("move")
    //     addToCol(data.col)
    //     currTeam = 1 - currTeam;
    //     myTurn = true
    // })
    
    const getSelf = () => {
        return $roomStore.players.find(player => player.userId === $socketStore.userId)
    }
    const getTeamColor = (teamId) => {
        return teamId >= 0 ? $roomStore.teams.find(team => team.id == teamId).color : '#fff'
    }
    
</script>

<div class="grid" style="grid-template-columns: repeat({width}, 1fr); grid-template-rows: auto repeat({height}, 1fr);">
	{#each [...Array(width).keys()] as col}
        <span id={col} class="btn {$roomStore.turn == getSelf().team ? "active" : ""}" on:click={handleMove(col)} style="background-color: {getTeamColor(getSelf().team)+"e8"};">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </span>
    {/each}
    {#each board as row, y}
		{#each row as tile, x} 
            <Tile active={tile.team >= 0} col={x + 1} row={y + 1} color={getTeamColor(tile.team)} />
		{/each}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		position: relative;
		width: 500px;
		height: 500px;
		margin: auto;
		grid-gap: 15px;
		padding: 15px;
		background-image: linear-gradient(to bottom right, rgb(31 119 198), rgb(50, 96, 232));
        border-radius: 2em;
        box-shadow: 4px 6px 18px 5px #44444459;
	}

    .btn {
        display: none;
        border-radius: 10em;
        cursor: pointer;
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