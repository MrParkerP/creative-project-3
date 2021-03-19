<template>
  <div class="To-Do">
    <div class="to-do-header-container">
      <h1> Your Current To-Do List</h1>
    </div>
    <div class="conditional-to-do-header" v-if="this.$root.$data.current.length===0">
      <h3>Looks like there is nothing in your To-Do List, try adding some or making your own!</h3>
    </div>
    <div class="form-container">
      <form v-on:submit.prevent="addTask">
        <input type="text" id="taskEntry" v-model="message" placeholder="Task">
        <input type="text" v-model="customTime" placeholder="Allotted time">
        <br>
        <div class="lower-form-container">
          <div class="difficulty-container">
            <input type="radio" id="easy" value="easy" v-model="customDifficulty">
            <label for="easy">Easy</label>
            <input type="radio" id="medium" value="medium" v-model="customDifficulty">
            <label for="medium">Medium</label>
            <input type="radio" id="hard" value="hard" v-model="customDifficulty">
            <label for="hard">Hard</label>
          </div>
          <div class="custom-button-container">
            <button type="submit" class="customButton">Add</button>
          </div>
        </div>
      </form>
    </div>
    <div class="to-do-list">
      <div class="to-do-item" v-for="task in this.$root.$data.current" :key=task.id>
        <div class="to-do-info-container">
          <p class="to-do-info">{{task.task}}</p>
        </div>
        <div class="to-do-info-container">
          <p class="to-do-info"><strong>Difficulty: </strong>{{task.difficulty}}</p>
        </div>
        <div class="to-do-info-container">
          <p class="to-do-info"><strong>Time: </strong>{{task.time}}</p>
        </div>
        <div class="remove-button-container">
          <button class="removeButton" v-on:click="removeItem(task)">X</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'To-Do',

  methods: {
    removeItem(task) {
      this.$root.$data.current.splice(this.$root.$data.current.indexOf(task), 1);
    },
    addTask() {
      this.$root.$data.current.push({task: this.message, difficulty: this.customDifficulty, time: this.customTime});
      this.message = '';
      this.customTime = '';
  }
  },

}

</script>


<style scoped>


.to-do-header-container {
}

h3 {
  text-align: center;
}

.to-do-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
}

.to-do-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 75%;
  background-color: #f5e967;
  margin-top: 15px;
  border-radius: 10px;
  border-bottom: 2px solid black;
  border-right: 2px solid black;
}

.to-do-info-container {
  width: 25%;
}

.to-do-info {
  margin-top: 5px;
  margin-bottom: 5px;
}


.removeButton {
  background-color: red;
}

.form-container {
  display: flex;
  justify-content: center;
}

.lower-form-container {
  display: flex;
  flex-wrap: wrap;
}

.difficulty-container {
  display: flex;
  width: 70%;
}

.custom-button-container {
  display: flex;
  justify-content: flex-end;
  width: 28%;
}

.custom-button {
  margin-left: 20px;
}
</style>
