<template>
	<transition :name="animation">
		<div
			class="loading-overlay is-active"
			:class="{ 'is-full-page': isFullPage }"
			v-if="isActive"
			>
			<div class="loading-background" @click="cancel"/>
			<div class="loading-icon"/>
		</div>
	</transition>
</template>

<script>
// From Buefy loading component
const isSSR = typeof window === "undefined";
const HTMLElement = isSSR ? Object : window.HTMLElement;

export default {
	name: "Loading",
	props: {
		active: Boolean,
		programmatic: Boolean,
		container: [Object, Function, HTMLElement],
		isFullPage: {
			type: Boolean,
			default: true
		},
		animation: {
			type: String,
			default: "fade"
		},
		canCancel: {
			type: Boolean,
			default: false
		},
		onCancel: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			isActive: this.active || false
		};
	},
	watch: {
		active(value) {
			this.isActive = value;
		}
	},
	methods: {
		/**
		 * Close the Modal if canCancel.
		 */
		cancel() {
			if (!this.canCancel || !this.isActive) return;
			this.close();
		},
		/**
		 * Emit events, and destroy modal if it's programmatic.
		 */
		close() {
			this.onCancel.apply(null, arguments);
			this.$emit("close");
			this.$emit("update:active", false);
			// Timeout for the animation complete before destroying
			if (this.programmatic) {
				this.isActive = false;
				setTimeout(() => {
					this.$destroy();
					//removeElement(this.$el);
					if (typeof this.$el.remove !== "undefined") {
						this.$el.remove();
					} else {
						this.$el.parentNode.removeChild(this.$el);
					}
				}, 150);
			}
		},
		/**
		 * Keypress event that is bound to the document.
		 */
		keyPress(event) {
			// Esc key
			if (event.keyCode === 27) this.cancel();
		}
	},
	created() {
		if (typeof window !== "undefined") {
			document.addEventListener("keyup", this.keyPress);
		}
	},
	beforeMount() {
		// Insert the Loading component in body tag
		// only if it's programmatic
		if (this.programmatic) {
			if (!this.container) {
				document.body.appendChild(this.$el);
			} else {
				this.isFullPage = false;
				this.container.appendChild(this.$el);
			}
		}
	},
	mounted() {
		if (this.programmatic) this.isActive = true;
	},
	beforeDestroy() {
		if (typeof window !== "undefined") {
			document.removeEventListener("keyup", this.keyPress);
		}
	}
};
</script>

<style lang="scss">
@-webkit-keyframes spinAround {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}

@keyframes spinAround {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}

@mixin overlay() {
	bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

@mixin loader() {
	animation: spinAround 500ms infinite linear;
  border: 2px solid #ccc;
  border-radius: 290486px;
  border-right-color: transparent;
  border-top-color: transparent;
  content: "";
  display: block;
  height: 1em;
  position: relative;
  width: 1em;
}

.loading-overlay {
	@include overlay;

	align-items: center;
	display: none;
	justify-content: center;
	overflow: hidden;

	&.is-active {
		display: flex;
	}

	&.is-full-page {
		z-index: 999;
		position: fixed;
		.loading-icon {
			&:after {
				top: calc(50% - 2.5em);
				left: calc(50% - 2.5em);
				width: 5em;
				height: 5em;
			}
		}
	}

	.loading-background {
		@include overlay;

		background: #7f7f7f;
		background: rgba(255, 255, 255, 0.5);
	}

	.loading-icon {
		position: relative;
		&:after {
			@include loader;

			position: absolute;
			top: calc(50% - 1.5em);
			left: calc(50% - 1.5em);
			width: 3em;
			height: 3em;
			border-width: 0.25em;
		}
	}
}
</style>
