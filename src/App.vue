<template>
	<header>
		<div class="container">
			<h1 class="logo">Epic Decomposer</h1>
			<button class="btn btn-sm btn-light ms-3" @click="resetData">Сбросить</button>
		</div>		
	</header>
	<div id="app" class="container">	  
	  <div class="row">
		<div class="col-md-6">
			<div class="tasks">
				<div class="row">
					<div class="col-md-12">
						<label for="epicName">Название эпика:</label>
						<input id="epicName" type="text" class="form-control mb-5" v-model="epicName" @input="saveState" placeholder="Построить космолёт">
					</div>
				</div>

			<div v-for="(stage, stageIndex) in stages" :key="'stage' + stageIndex">
				<h2>{{ stage.name }}: {{ stageTotalTime(stage) }} ч.</h2>
				<table class="table table-bordered">
				<tbody>
					<tr v-for="(task, taskIndex) in tasksByStage(stage)" :key="'task' + taskIndex">
					<td>
						<task-item :task="task" @toggleCheck="toggleCheck" @timeChange="timeChange"></task-item>
					</td>
					</tr>
				</tbody>
				</table>
			</div>
		</div>
		</div>
		<div class="col-md-6 results">
		  <h2>Результаты:</h2>
		  <div 
		  	v-for="(stage, index) in stages" :key="'result' + index" 
			class="d-flex justify-content-between"
			>
			<h3>[{{ stage.name }}] {{ epicName }}: {{ stageTotalTime(stage) }} ч.</h3>
			<button class="btn btn-sm btn-outline-dark" @click="copyToClipboard(stage)">Копировать</button>
			<div class="highlight">
			  <pre class="pre-scrollable"><code>{{ filteredTasks(stage).map(task => `${task.name} - ${task.time} ч.`).join('\n') }}
			  </code></pre>
			</div>
		  </div>
		  <h2>Общее время: {{ totalTime }} ч.</h2>
		</div>
	  </div>
	</div>
  </template>




  <script>
  import TaskItem from './components/TaskItem.vue';
  import loadData from './data.js';
  
  export default {
	name: 'App',
	components: {
	  TaskItem
	},


	data() {
	return {
	  tasks: [],
	  stages: [],
	  epicName: '',
	};
  },
  async mounted() {
	const data = await loadData();
	this.tasks = data.tasks;
	this.stages = data.stages;
	this.loadState();
	this.updateTotalTime();
  },

  
	methods: {
		tasksByStage(stage) {
			return this.tasks.filter(task => task.stage === stage.name);
		},
		toggleCheck(task) {
			task.checked = !task.checked;
			this.updateTotalTime();
			this.saveState();
		},
	 
	  updateTotalTime() {
		this.totalTime = this.tasks.reduce((sum, task) => sum + (task.checked ? parseFloat(task.time) : 0), 0);
		},

	  filteredTasks(stage) {
		return this.tasks.filter(task => task.stage === stage.name && task.checked);
	  },
	  timeChange(task, newValue) {
			task.time = parseInt(newValue) || 0;
			this.updateTotalTime();
			this.saveState();
		},
		stageTotalTime(stage) {
			const totalTime = this.filteredTasks(stage)
				.map(task => parseFloat(task.time))
				.reduce((acc, time) => acc + time, 0);

			return (totalTime % 1 === 0) ? totalTime.toFixed(0) : totalTime.toFixed(1);
		},

		totalTime() {
			const totalTime = this.tasks
				.filter(task => task.checked)
				.map(task => parseFloat(task.time))
				.reduce((acc, time) => acc + time, 0);

			return (totalTime % 1 === 0) ? totalTime.toFixed(0) : totalTime.toFixed(1);
			},
		copyToClipboard(stage) {
			const content = this.filteredTasks(stage).map(task => `${task.name} - ${task.time} ч.`).join('\n');
			navigator.clipboard.writeText(content);
		},

		saveState() {
			const state = {
			tasks: this.tasks,
			epicName: this.epicName
			};
			localStorage.setItem('epicDecomposerState', JSON.stringify(state));
		},
		loadState() {
			const savedState = localStorage.getItem('epicDecomposerState');
			if (savedState) {
				const state = JSON.parse(savedState);
				this.tasks = state.tasks;
				this.epicName = state.epicName;
			}
			},
		resetData() {
			this.tasks = this.tasks.map(task => ({
			...task,
			checked: false,
			time: 0
			}));
			this.epicName = '';
			this.saveState();
		}

	},
	// mounted() {
	//   this.updateTotalTime();
	// }
  }
  </script>