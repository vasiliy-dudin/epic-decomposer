<template>
	<div class="task-item">
	  <div class="form-check">
		<input class="form-check-input" type="checkbox" :id="task.name" :checked="task.checked" @change="toggleCheck" />
		<label class="form-check-label" :for="task.name">{{ task.name }}</label>
	  </div>
	  <div class="input-group mb-3 d-inline-block">
		<input type="number" class="form-control" :value="task.time" @input="timeChange" step="0.5" min="0" /> ч.
	  </div>
	</div>
  </template>
  
  
  
  <script>
  export default {
	name: 'TaskItem',
	props: {
	  task: Object
	},
	methods: {
	  toggleCheck() {
		this.$emit('toggleCheck', this.task);
	  },
	  timeChange(event) {
		this.$emit('timeChange', this.task, event.target.value);
	  }
	}
  }
  </script>
  