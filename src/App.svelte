<script>
	import Board from './Board.svelte'
	import { socketStore, sessionStore, userStore, roomStore } from './store.js'
	import Join from './Join.svelte';
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import PlayerList from './PlayerList.svelte';
	let soundPlayer
	let board = []

	onMount(() => {
		const sessionId = $sessionStore;
		if (sessionId) {
			$socketStore.auth = { sessionId };
			$socketStore.connect();
		}

		$socketStore.on("session", ({ sessionId, userId }) => {
			console.log("session", sessionId, userId)
			$socketStore.auth = { sessionId };
			$sessionStore = sessionId;
			$socketStore.userId = userId;
			$socketStore.emit('getUser', { id: $socketStore.userId}, (user) => {
				console.log("user", user)	
				$userStore = user
				console.log("userStore", $userStore)
			});
			$socketStore.emit('getRoomByPlayer', { id: $socketStore.userId }, (room) => {
				console.log("room", room)	
				$roomStore = room
				console.log("roomStore", $roomStore)
			});
		});
	});

	$socketStore.on('updateRoom', (room) => {
		console.log("updateRoom", room)
		$roomStore = room
	});

	$socketStore.on('playSound', (url) => {
		soundPlayer.src = url
        soundPlayer.play()
	});
	
	export function getUser(userId) {
		console.log("getUser", userId)
		let user;
		$socketStore.emit('getUser', { id: userId }, (data) => {
			console.log("getUser1", data)
			user = data
		});
		return user
	}
</script>

<main>
	<h1>Connect Four!</h1>
	{#if !$roomStore || Object.keys($roomStore).length == 0}
		<Join />
	{:else}
		<PlayerList players={$roomStore.players} teams={$roomStore.teams} turn={$roomStore.turn}/>
		<Board bind:this={board} board={$roomStore.board} width={$roomStore.boardWidth} height={$roomStore.boardHeight}/>
		<div class="room-code">
			<span>{$roomStore.id}</span>
			<svg on:click={() => {navigator.clipboard.writeText($roomStore.id)}} xmlns="http://www.w3.org/2000/svg" class="btn-copy" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
			</svg>
		</div>
	{/if}
	<audio bind:this={soundPlayer} class="audio"></audio>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.room-code {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0.7em;
		color: #776e65;
		background: #eee4da;
		border-top-left-radius: 0.5em;
		gap: 0.5em;
		position: fixed;
		bottom: 0;
		right: 0;
	}

	.btn-copy {
		cursor: pointer;
		width: 1.5em;
	}
	.audio {
        display: none;
    }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>