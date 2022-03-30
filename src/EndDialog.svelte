<script>
	import { roomStore, socketStore, getUserTeam } from "./store.js"
	import Dialog from "./Dialog.svelte"
	import Button from "./Button.svelte"

	const getStandingPhrase = () => {
		return $roomStore.winner == -1 ? "drawed" : $roomStore.winner == getUserTeam($roomStore.players, $socketStore.userId) ? "won" : "lost"
	}
</script>

<Dialog active={$roomStore.winner != null}>
	<h2 class="win-status">You {getStandingPhrase()}</h2>
	<span>... in {(Date.parse($roomStore.finishedAt) - Date.parse($roomStore.startedAt)) / 1000} seconds</span>
	<div class="dialog-btns">
		<Button>View Board</Button>
		<Button on:click={() => {$socketStore.emit('leaveRoom', {roomId: $roomStore.id})}}>Back to Lobby</Button>
	</div>
</Dialog>

<style>
	.win-status {
		font-size: 1.8em;
		margin: 0;
	}

	.dialog-btns {
		display: flex;
		gap: 0.5em;
		margin-top: 1.8em;
	}
</style>
