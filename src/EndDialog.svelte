<script>
	import { roomStore, socketStore, getUserTeam } from "./store.js"
	import Dialog from "./Dialog.svelte"
	import Button from "./Button.svelte"

	const getStandingPhrase = () => {
		return $roomStore.winner == -1 ? "drawed" : $roomStore.winner == getUserTeam($roomStore, $socketStore.userId) ? "won" : "lost"
	}
</script>

<Dialog active={$roomStore.winner != null}>
	<h2 class="win-status">You {getStandingPhrase()}</h2>
	<span>... in {(Date.parse($roomStore.finishedAt) - Date.parse($roomStore.startedAt)) / 1000} seconds</span>
	<div class="dialog-btns">
		<Button>Back to Lobby</Button>
	</div>
</Dialog>

<style>
	.win-status {
		font-size: 2em;
		margin: 0;
	}

	.dialog-btns {
		margin-top: 2em;
	}
</style>
