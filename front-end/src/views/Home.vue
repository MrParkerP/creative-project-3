<template>
  <div class="home">
    <div class="explanation">
      <h1 class="home-explanation" v-if="this.$root.$data.user!==''"> Press the button to generate a random To-Do item! </h1>
    </div>
    <div class="button-container">
      <button class="generate-button" v-on:click="randomToDo" v-if="this.$root.$data.user!==''">Generate</button>
    </div>
    <div v-if="this.$root.$data.generating" class="randomToDo">
      <p>Your random To-Do item is:</p>
      <h2>{{this.$root.$data.possible[currentID].description}}</h2>
      <h3 class="task-info">Difficulty: {{this.$root.$data.possible[currentID].difficulty}}</h3>
      <h3 class="task-info">Time required: {{this.$root.$data.possible[currentID].time}}</h3>
      <div class="button-container">
        <button class="addButton" v-on:click="showCategories">Add</button>
      </div>
      <div class="newCategoryContainer" v-if="this.visibleCategories===true">
        <form v-on:submit.prevent="addCategory">
          <input type="text" v-model="newCategory">
          <button class="addCategoryButton" type="submit">Add Category</button>
        </form>
      </div>
      <div class="categoriesContainer" v-if="this.visibleCategories===true">
        <button class="selectCategory" v-on:click="addToList(category)" v-for="category in this.categories" :key=category.id>{{category.title}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  created() {
    this.getCategories();
  },

  methods: {
    async  randomToDo() {
      this.$root.$data.generating = true;
      this.currentID = Math.floor(Math.random() * 21);

      this.description = this.$root.$data.possible[this.currentID].description;
      this.difficulty = this.$root.$data.possible[this.currentID].difficulty;
      this.time = this.$root.$data.possible[this.currentID].time;
      this.user = this.$root.$data.user;

      try {
        await axios.post (`/api/user/${this.user._id}/previousTasks`, {
          description: this.description,
          difficulty: this.difficulty,
          time: this.time,
        });

      } catch(error) {
        console.log(error);
      }

    },
    async addToList(category) {
      this.generating = true;
      this.currentID = Math.floor(Math.random() * 21);

      this.description = this.$root.$data.possible[this.currentID].description;
      this.difficulty = this.$root.$data.possible[this.currentID].difficulty;
      this.time = this.$root.$data.possible[this.currentID].time;
      this.category = category;
      this.user = this.$root.$data.user;

      try {
        await axios.post (`/api/categories/${this.category._id}/currentTasks`, {
          description: this.description,
          difficulty: this.difficulty,
          time: this.time,
        });

        await axios.post (`/api/user/${this.user._id}/previousTasks`, {
          description: this.description,
          difficulty: this.difficulty,
          time: this.time,
        });

      } catch (error) {
        console.log(error);
      }
      this.visibleCategories = false;
    },
    async getCategories() {
      this.user = this.$root.$data.user;
      if (this.user !== ''){
        try {
          let response = await axios.get(`/api/user/${this.user._id}/categories`);
          this.categories = response.data;
          return true;
        } catch(error) {
          console.log(error);
        }
      }
    },
    showCategories() {
    this.getCategories();
      this.visibleCategories = true;
    },
    async addCategory() {
      try {
        await axios.post(`/api/user/${this.user._id}/categories`, {
          title: this.newCategory,
        });
      } catch(error) {
        console.log(error);
      }
      this.getCategories();
      this.newCategory = '';
    },

  },
  data() {
    return {
      currentID: 0,
      description: '',
      difficulty: '',
      time: '',
      category: '',
      customUser: '',
      categories: [],
      visibleCategories: false,
      newCategory: '',
      user: '',
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
  margin-bottom: 20px;
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

.user-selection {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#user-explanation {
  width: 75%;
  text-align: center;
}

.users-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 15px;
}

.user-button {
  margin-left: 5px;
  margin-right: 5px;
}

.categoriesContainer {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 50px;
}

.selectCategory {
  margin-left: 5px;
  margin-right: 5px;
}

.newCategoryContainer {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

.user-greeting {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.logoutButton {
  margin-left: 5px;
  background-color: white;
  border: none;
  color: blue;
  padding-top: 5px;
}

</style>
