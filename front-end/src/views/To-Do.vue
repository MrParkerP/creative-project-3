<template>
  <div class="To-Do">
    <div v-if="this.$root.$data.user!==''">
      <div class="to-do-header-container">
        <h1> Your Current To-Do List</h1>
      </div>
      <div class="conditional-to-do-header" v-if="this.categories.length===0">
        <h3>Looks like you have no tasks here! Try adding some and creating a category to put them in!</h3>
      </div>
      <div class="categoriesContainer">
        <div class="category-explanation-container">
          <h3>Please select a category:</h3>
        </div>
        <div class="select-category=container" v-for="category in this.categories" :key=category.id>
          <button class="selectCategory" v-on:click="getTasks(category)">{{category.title}}</button>
          <button class="deleteCategoryButton" v-on:click="deleteCategory(category)">X</button>
        </div>
      </div>
      <div class="newCategoryContainer">
        <form v-on:submit.prevent="addCategory">
          <input type="text" v-model="newCategory">
          <button class="addCategoryButton" type="submit">Add Category</button>
        </form>
      </div>
      <div class="form-container" v-if="categorySelected">
        <div class="make-own-container">
          <h3>Make your own!</h3>
        </div>
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
        <div class="category-header-container">
          <h1>Category: {{category.title}}</h1>
        </div>
        <div class="to-do-item" v-for="task in this.tasks" :key=task.id>
          <div class="to-do-info-container">
            <p class="to-do-info">{{task.description}}</p>
          </div>
          <div class="to-do-info-container">
            <p class="to-do-info"><strong>Difficulty: </strong>{{task.difficulty}}</p>
          </div>
          <div class="to-do-info-container">
            <p class="to-do-info"><strong>Time: </strong>{{task.time}}</p>
          </div>
          <div class="remove-button-container">
            <button class="removeButton" v-on:click="deleteTask(task)">X</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'To-Do',
  created () {
    this.getUsers();
    this.getCategories();
  },
  data () {
    return {
      tasks: [],
      users: [],
      categories: [],
      customDifficulty: '',
      message: '',
      customTime: '',
      categorySelected: false,
      category: '',
      user: '',
      newCategory: '',
    }
  },

  methods: {
    async getUsers() {
      this.user = this.$root.$data.user;
      try {
        let response = await axios.get("/api/user");
        this.users = response.data;
        return true;
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
    async getTasks(category) {
      this.category = category;
      this.categorySelected = true;
      try {
        let response = await axios.get(`/api/categories/${this.category._id}/currentTasks`);
        this.tasks = response.data;
      } catch(error) {
        console.log(error);
      }
    },
    async addTask() {
      try {
        await axios.post(`/api/categories/${this.category._id}/currentTasks`, {
          description: this.message,
          difficulty: this.customDifficulty,
          time: this.customTime,
        });
        this.customTime = '';
        this.customDifficulty = '';
        this.message = '';
        this.getTasks(this.category);
      } catch(error) {
        console.log(error);
      }
    },
    async deleteTask(task) {
      try {
        await axios.delete(`/api/categories/${this.category._id}/currentTasks/${task._id}`);
        this.getTasks(this.category);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteCategory(category){
      try {
        await axios.delete(`/api/user/${this.user._id}/categories/${category._id}`);
        this.getCategories();
      } catch(error) {
        console.log(error);
      }
    },

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
  display: flex;
  width: 25%;
  justify-content: center;
}

.to-do-info {
  margin-top: 5px;
  margin-bottom: 5px;
}

.remove-button-container {
  display: flex;
  width: 25%;
}

.removeButton {
  background-color: red;
}

.form-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

.categoriesContainer {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 15px;
  margin-bottom: 50px;
}

.selectCategory {
  margin-left: 10px;
  margin-right: 0px;
}

.category-explanation-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;

}

.make-own-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
}

.deleteCategoryButton {
  background-color: red;
}

.category-header-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
