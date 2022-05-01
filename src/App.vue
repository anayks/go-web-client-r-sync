<template>
	<div id="app">
		<div
			class="entity"
			v-for="entity in entities"
			:key="entity.id"
			:style="{
				top: `${entity.y}px`,
				left: `${entity.x}px`,
				background: getBackground(entity),
			}"
		/>
		<div
			class="entity"
			:style="{
				top: `${player.y}px`,
				left: `${player.x}px`,
				background: 'red',
			}"
		/>
	</div>
</template>
<script>

const MaxDown      = 2000 * 2
const MaxRight     = 3000 * 2
const MaxDepth	   = 3000 * 2

export default
{
	name: 'app',
	data() {
		return {
			entities: [],
			player: {
				x: 2,
				y: 2,
				z: 0,
			},
			rotate: true,
		};
	},
	methods: {
		getPosByRotate(entity) {
			if(this.rotate) {
				return entity.x
			}
			return entity.z;
		},
		getBackground(entity) {
			const id = entity.id;
			if(id % 20 == 0) {
				return `violet`;
			}
			return "black";
		},
		keyDown(e) {
			const key = e.key;
			console.log(key);
			if(key == "ArrowUp") {
				this.moveTop(5);
			} else if(key == "ArrowDown") {
				this.moveDown(5);
			} else if(key == "ArrowLeft") {
				this.moveLeft(5);
			} else if(key == "ArrowRight") {
				this.moveRight(5);
			} else if(key == "z") {
				this.moveDepth(5);
			} else if(key == "x") {
				this.moveUpward(5);
			} else if(key == "r") {
				this.changeRotate();
			}
		},
		changeRotate() {
			this.rotate = !this.rotate;
		},
		moveTop(y = 1) {
			if(this.player.y-y <= 0) {
				this.player.y = 0
				this.player = Object.assign({}, this.player);
				return
			}
			this.player.y -= y
			this.player = Object.assign({}, this.player);
		},
		moveDown(y = 1) {
			if(this.player.y+y >= MaxDown) {
				this.player.y = MaxDown
				return
			}
			this.player.y = this.player.y + y
		},
		moveRight(x = 1) {
			if(this.player.x+x >= MaxRight) {
				this.player.x = MaxRight
				return
			}
			this.player.x = this.player.x + x
		},
		moveLeft(x = 1) {
			if(this.player.x-x <= 0) {
				this.player.x = 0
				return
			}
			this.player.x = this.player.x - x
		},
		moveDepth(z = 1) {
			if(this.player.z-z <= 0) {
				this.player.z = 0;
				return
			}
			this.player.z = this.player.z - z
		},
		moveUpward(z = 1) {
			if(this.player.z+z >= MaxDepth) {
				this.player.z = MaxDepth
				return
			}
			this.player.z = this.player.z + z
		},

		waitResult() {
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "http://localhost:8050/");
			xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			xhr.onload = () => {
				try {
					const result = xhr.response;
					if(!result) {
						return;
					}
					const entities = JSON.parse(result);
					this.entities = entities;
				} catch {}
			};
			const data = JSON.stringify(this.player);
			xhr.send(data);
		},
	},
	computed: {
	},
	mounted() {
		setInterval(this.waitResult, 50);

		window.data = this;

		document.addEventListener('keydown', this.keyDown);
	}
}
</script>
<style>
.entity {
	width: 1vh;
	height: 1vh;

	background: black;

	transition: all 45ms;

	position: absolute;
}

body {
	height: 100vh;
	width: 100vw;

	padding: 0;
	margin: 0;
}

</style>