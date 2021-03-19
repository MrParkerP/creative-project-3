<template>
  <div id="previous">
    <div class="previous-header">
      <h1>All your previous surprises</h1>
    </div>
    <div class="conditional-previous-header" v-if="this.$root.$data.previous.length===0">
      <h3>You have yet to open any surprises!</h3>
    </div>
    <div class="previous-surprises">
      <div class="surprise" v-for="surprise in this.$root.$data.previous" :key="surprise.id">
        <h3 class="surprise-info">{{surprise.task}}</h3>
        <div class="details-container">
          <p class="surprise-info"><strong>Difficulty: </strong>{{surprise.difficulty}}</p>
          <p class="surprise-info"><strong>Time: </strong>{{surprise.time}}</p>
        </div>
        <div class="button-container">
          <button class="previous-add-button" v-on:click="previousAdd(surprise)">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Previous',

  methods: {
    previousAdd(task) {
      this.$root.$data.current.push(task);
    }
  }
}
</script>


<style>

h3 {
  text-align: center;
  padding-top: 5px;
}

.previous-surprises {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 20px;
  justify-content: center;
}

.surprise {
  display: flex;
  flex-wrap: wrap;
  width: 30%;
  justify-content: center;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  border-radius: 10px;
  background-color: #f5e967;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.details-container {
  margin-top: 20px;
}

.surprise-info {
  width:100%;
  margin: 0;
}

.button-container {
  margin-top: 5px;
  margin-bottom: 5px;
}

.previous-add-button {
  background-color: #60f757;
}

@media only screen and (max-width: 400px) {

  .surprise {
    width: 100%;
  }
}

@media only screen and (min-width: 401px) and (max-width: 960px) {

  .surprise {
    width: 40%;
  }
}

</style>
