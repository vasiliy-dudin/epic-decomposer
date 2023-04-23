<template>
	<div class="form-check">
		<input
			class="form-check-input"
			type="checkbox"
			:id="uniqueId"
			:checked="task.checked"
			@change="toggleCheck"
		/>
		<label class="form-check-label" :for="uniqueId">{{ task.name }}</label>
	</div>
	<div class="input-time">
		<input
			type="number"
			class="form-control input-time__input"
			:value="task.time"
			@input="timeChange"
			step="0.5"
			min="0"
		/>
		<span> h.</span>
	</div>
</template>

<script>
	import { nanoid } from "nanoid";

	export default {
		name: "TaskItem",
		props: {
			task: Object,
		},
		emits: ["toggleCheck", "timeChange"],
		data() {
			return {
				uniqueId: nanoid(6),
			};
		},
		methods: {
			toggleCheck() {
				this.$emit("toggleCheck", this.task);
			},
			timeChange(event) {
				this.$emit("timeChange", this.task, event.target.value);
			},
		},
	};
</script>
