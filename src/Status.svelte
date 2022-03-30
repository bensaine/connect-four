<script>
    import { socketStore, roomStore, getUserTeam} from "./store.js";
    let status;

    roomStore.subscribe(() => {
        if (!$roomStore) return;
        if (!$roomStore.started) {
            status = "Waiting for other players";
        } else if ($roomStore.turn == getUserTeam($roomStore.players, $socketStore.userId)) {
            status = "Your turn to play";
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
    }

    @media (max-width: 640px) {
        .status {
            font-size: 1.13em;
        }
    }
</style>