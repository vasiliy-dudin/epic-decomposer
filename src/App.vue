<template>
	<div class="container">
		<header>
			<h1 class="logo">✨ Epic Decomposer</h1>
			<button class="btn btn-sm btn-outline-secondary" @click="resetData">
				Reset
			</button>
		</header>
	</div>
	<div id="app" class="container">
		<div class="row">
			<div class="col-md-6">
				<div class="tasks">
					<div class="row">
						<div class="col-md-12">
							<label for="epicName">Epic name:</label>
							<input
								id="epicName"
								type="text"
								class="form-control mb-5"
								v-model="epicName"
								@input="saveState"
								placeholder="Build a spaceship"
							/>
						</div>
					</div>

					<div
						class="stage"
						v-for="(stage, stageIndex) in stages"
						:key="'stage' + stageIndex"
					>
						<h4>
							{{ stage.name }}: {{ stageTotalTime(stage) }} h.
						</h4>
						<div
							class="task-item"
							v-for="(task, taskIndex) in tasksByStage(stage)"
							:key="'task' + taskIndex"
						>
							<task-item
								:task="task"
								@toggleCheck="toggleCheck"
								@timeChange="timeChange"
							>
							</task-item>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-6 results">
				<h4>For Jira</h4>
				<div
					v-for="(stage, index) in stages"
					:key="'result' + index"
					class="output-stage"
				>
					<h6>
						[{{ stage.name }}] {{ epicName }} ..................
						{{ stageTotalTime(stage) }} h.
					</h6>
					<button
						class="btn btn-sm btn-outline-dark"
						@click="copyToClipboard(stage)"
					>
						Copy
					</button>
					<div class="highlight">
						<pre
							class="pre-scrollable"
						><code>{{ filteredTasks(stage).map(task => `* ${task.name} - ${task.time}`).join('\n') }}
						  </code></pre>
					</div>
				</div>
				<h6>Total time: {{ totalTime }} h.</h6>
			</div>
		</div>
	</div>
</template>

<script>
	import TaskItem from "./components/TaskItem.vue";
	import data from "./data.json";

	export default {
		name: "App",
		components: {
			TaskItem,
		},

		data() {
			return {
				tasks: [],
				stages: [],
				epicName: "",
				defaultTasks: [],
			};
		},
		async mounted() {
			this.tasks = data.tasks;
			this.stages = data.stages;
			this.defaultTasks = this.tasks.map((task) => ({ ...task }));
			this.loadState();
			this.updateTotalTime();
		},

		methods: {
			tasksByStage(stage) {
				return this.tasks.filter((task) => task.stage === stage.name);
			},
			toggleCheck(task) {
				task.checked = !task.checked;
				this.updateTotalTime();
				this.saveState();
			},

			updateTotalTime() {
				this.totalTime = this.tasks.reduce(
					(sum, task) =>
						sum + (task.checked ? parseFloat(task.time) : 0),
					0
				);
			},

			filteredTasks(stage) {
				return this.tasks.filter(
					(task) => task.stage === stage.name && task.checked
				);
			},
			timeChange(task, newValue) {
				task.time = parseFloat(newValue) || 0;
				this.updateTotalTime();
				this.saveState();
			},
			stageTotalTime(stage) {
				const totalTime = this.filteredTasks(stage)
					.map((task) => parseFloat(task.time))
					.reduce((acc, time) => acc + time, 0);

				return totalTime % 1 === 0
					? totalTime.toFixed(0)
					: totalTime.toFixed(1);
			},

			totalTime() {
				const totalTime = this.tasks
					.filter((task) => task.checked)
					.map((task) => parseFloat(task.time))
					.reduce((acc, time) => acc + time, 0);

				return totalTime % 1 === 0
					? totalTime.toFixed(0)
					: totalTime.toFixed(1);
			},
			copyToClipboard(stage) {
				const content =
					"План \n" +
					this.filteredTasks(stage)
						.map((task) => `* ${task.name} - ${task.time}`)
						.join("\n");
				navigator.clipboard.writeText(content);
			},

			saveState() {
				const state = {
					tasks: this.tasks.map((task) => ({
						name: task.name,
						checked: task.checked,
						time: task.time,
					})),
					epicName: this.epicName,
				};
				localStorage.setItem(
					"epicDecomposerState",
					JSON.stringify(state)
				);
			},
			loadState() {
				const savedState = localStorage.getItem("epicDecomposerState");
				if (savedState) {
					const state = JSON.parse(savedState);
					this.tasks = this.tasks.map((task) => {
						const savedTask = state.tasks.find(
							(t) => t.name === task.name
						);
						return savedTask ? { ...task, ...savedTask } : task;
					});
					this.epicName = state.epicName;
				}
			},
			resetData() {
				this.tasks = this.tasks.map((task, index) => ({
					...task,
					checked: false,
					time: this.defaultTasks[index].time,
				}));
				this.epicName = "";
				this.saveState();
			},
		},
	};
</script>
