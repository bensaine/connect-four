<script>
	export let turn, players = [], teams = []

    export const getTeamPlayers = (team) => {
        return players.filter((player) => (player.team === team))
    }
</script>

<div class="player-card">
	<div class="card-body">
        {#each teams as team, i}
            <div class="team {turn == team.id ? "active" : ""}" style={turn == team.id ? "border: 0.2em solid "+team.color+";" : ""}>
                <div class="team-name">
                    <span class="team-color" style="background-color: {team.color};"></span>
                    <span>{team.name}</span>
                </div>
                <div class="team-players">
                    {#each getTeamPlayers(team.id) as player}
                        <div class="player">
                            <div class="player-name">
                                <span>{player.username}</span>
                            </div>
                        </div>
                    {/each}
                    {#if getTeamPlayers(team.id).length == 0}
                        <div class="player">
                            <div class="player-name no-players">
                                <span>Waiting...</span>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            {#if i != teams.length - 1}
                <span class="vs">VS</span>
            {/if}
        {/each}
	</div>
</div>

<style>
    .player-card {
        margin-bottom: 2em;
    }

    .card-body {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1.5em;
    }

	.team {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        width: 10em;
        text-align: left;
        padding: 0.5em 1em;
        background-color: #f6ebe0;
		border-radius: 0.25em;
		box-shadow: 0 0.25em 0.25em rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease-in-out;
	} 

    .team-name {
        display: flex;
        align-items: center;
        gap: 0.5em;
        color: #776e65;
    }

    .team-color {
        height: 1em;
        width: 1em;
        border: 1px solid #776e65;
        border-radius: 50%;
        display: inline-block;
    }

    .active {
        box-shadow: 0 0.25em 0.25em rgba(0, 0, 0, 0.2);
        padding: 1em 1.5em;
    }

    .player-name {
        font-size: 1.25em;
    }

    .no-players {
        color: #776e65;
    }

    @media (max-width: 500px) {
        .card-body {
            flex-direction: column;
            gap: 1em;
        }
	}
</style>
