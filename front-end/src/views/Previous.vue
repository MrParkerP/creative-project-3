<template>
  <div id="previous" v-if="this.$root.$data.user!==''">
    <div class="previous-header">
      <h1>All your previous surprises</h1>
    </div>
    <div class="conditional-previous-header" v-if="this.tasks.length===0">
      <h3>You have yet to open any surprises!</h3>
    </div>
    <div class="remove-button-container">
      <button class="remove-button" v-on:click="removeAllPrevious">Remove All</button>
    </div>
    <div class="previous-surprises">
      <div class="surprise" v-for="task in this.tasks" :key="task.id">
        <h3 class="surprise-info">{{task.description}}</h3>
        <div class="details-container">
          <p class="surprise-info"><strong>Difficulty: </strong>{{task.difficulty}}</p>
          <p class="surprise-info"><strong>Time: </strong>{{task.time}}</p>
        </div>
        <div class="button-container">
          <button class="previous-add-button" v-on:click="showCategories(task)">Add</button>
          <div class="categories-container" v-if="task.showCategories === true">
            <button class="categories" v-on:click="previousAdd(task, category)" v-for="category in categories" :key="category.id">{{category.title}}</button>
          </div>
          <div class="newCategoryContainer" v-if="customCategory">
            <form v-on:submit.prevent="addCategory" v-if="task.showCategories === true">
              <input type="text" v-model="newCategory" placeholder="Category Name">
              <button class="addCategoryButton" type="submit">Add Category</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Previous',
  created() {
    this.setUser();
    this.getTasks();
  },
  updated() {
    this.setUser();
    this.getTasks();
  },
  data () {
    return {
      tasks: [],
      user: '',
      categories: [],
      customCategory: false,
      newCategory: '',
      currentTask: '',
    }
  },
  methods: {
    async getCategories() {
      try {
        const response = await axios.get(`/api/user/${this.user._id}/categories`);
        this.categories = response.data;
      } catch(error) {
        console.log(error);
      }
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
    setUser() {
      this.user = this.$root.$data.user;
    },
    showCategories(task) {
      this.getCategories();
      this.customCategory = true;
      this.currentTask = task;
      this.previousEdit(task);
    },
    async previousEdit(task) {
      try {
        await axios.put(`/api/previousTasks/${task._id}`);
      } catch(error) {
        console.log(error);
      }
    },
    async previousAdd(task, category) {
      try {
        await axios.post (`/api/user/${this.user._id}/categories/${category._id}/currentTasks`, {
          description: task.description,
          difficulty: task.difficulty,
          time: task.time,
        });
        this.previousEdit(task);
        this.customCategory = false;
        this.currentTask = '';
      } catch (error) {
        console.log(error);
      }
    },
    async getTasks() {
      if (this.user !== ''){
        try {
          let response = await axios.get(`/api/user/${this.user._id}/previousTasks`);
          this.tasks = response.data;
          return true;
        } catch(error) {
          console.log(error);
        }
      }
    },
    async removeAllPrevious() {
      try {
        await axios.delete(`/api/user/${this.user._id}/previousTasks`);
        this.getTasks();
        return true;
      } catch(error) {
        console.log(error);
      }
    }
  },
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
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.previous-add-button {
  background-color: #60f757;
}

.remove-button-container {
  display: flex;
  width: 100%;
  justify-content: center;
}

.categories-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.categories {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.newCategoryContainer {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.addCategoryButton {
  margin-left: 5px;
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
