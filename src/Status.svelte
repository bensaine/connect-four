<script>
	import { socketStore, roomStore } from "./store.js"
	let status

	roomStore.subscribe(() => {
		if (!$roomStore) return
		if (!$roomStore.started) {
			status = "Waiting for other players"
		} else if ($roomStore.turn == roomStore.getUserTeam($socketStore.userId)) {
			status = "Your turn to play"
		} else {
			status = "Waiting for opponent to play"
		}
	})
</script>

<span class="status">{status}...</span>

<style>
	.status {
		color: #776e65;
		font-size: 1.35em;
		margin: 0;
        animation: breathing 5s infinite ease-in-out;
	}

	@keyframes breathing {
		0% {
            opacity: 1;
		}

		50% {
            opacity: 0.2;
		}

		100% {
            opacity: 1;
		}
	}

	@media (max-width: 640px) {
		.status {
			font-size: 1.13em;
		}
	}
</style>
