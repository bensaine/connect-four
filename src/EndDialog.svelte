<script>
	import { roomStore, socketStore } from "./store.js"
	import Dialog from "./Dialog.svelte"
	import Button from "./Button.svelte"
	let closed = false

	const getStandingPhrase = () => {
		let phrase = ""
		if ($roomStore.winner == -1) phrase = "drawed"
		else {
			phrase = $roomStore.winner == roomStore.getUserTeam($socketStore.userId)
				? "won"
				: "lost"
		}
		if ($roomStore.players.length == 1) phrase += " by forfeit"
		return phrase
	}
</script>

<Dialog active={$roomStore.winner != null && !closed}>
	<h2 class="win-status">You {getStandingPhrase()}</h2>
	<span>... in {(Date.parse($roomStore.finishedAt) - Date.parse($roomStore.startedAt)) / 1000} seconds</span>
	<div class="dialog-btns">
		<Button on:click={() => closed = true}>View Board</Button>
		<Button
			on:click={() => {
				$socketStore.emit("leaveRoom", { roomId: $roomStore.id })
			}}>Leave to Lobby</Button
		>
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
