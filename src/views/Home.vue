<template>
  <div class="home">
    <div class="explanation">
      <h1 class="home-explanation"> Press the button to generate a random To-Do item! </h1>
    </div>
    <div class="button-container">
      <button class="generate-button" v-on:click="randomToDo">Generate</button>
    </div>
    <div v-if="this.$root.$data.generating" class="randomToDo">
      <p>Your random To-Do item is:</p>
      <h2>{{this.$root.$data.possible[currentID].task}}</h2>
      <h3 class="task-info">Difficulty: {{this.$root.$data.possible[currentID].difficulty}}</h3>
      <h3 class="task-info">Time required: {{this.$root.$data.possible[currentID].time}}</h3>
      <div class="button-container">
        <button class="addButton" v-on:click="addToList">Add</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',

  methods: {
    randomToDo() {
      this.$root.$data.generating = true;
      this.currentID = Math.floor(Math.random() * 21);

      this.$root.$data.previous.push(this.$root.$data.possible[this.currentID]);
    },
    addToList() {
      this.$root.$data.current.push(this.$root.$data.possible[this.currentID]);

      this.$root.$data.generating = true;
      this.currentID = Math.floor(Math.random() * 21);

      this.$root.$data.previous.push(this.$root.$data.possible[this.currentID]);


    }
  },
  data() {
    return {
      currentID: 0
    }
  }
}
</script>

<style>

.home {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.explanation {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

h1 {
  text-align: center;
  font-size: 1.75em;
}

.generate-button {
  margin-top: 50px;
  margin-bottom: 5px;
}

.randomToDo {
  margin-bottom: 50px;
}

.button-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

p {
  text-align: center;
  margin-bottom: 50px;
}

.task-info {
  text-align: center;
  font-family: "Courier New", monospace;
  margin: 5px;
}

.addButton {
  margin-top: 10px;
  background-color: #60f757;
}

h2 {
  text-align: center;
  margin-top: 100px;
}
</style>
