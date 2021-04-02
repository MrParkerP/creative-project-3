<template>
<div id="app">
  <div class="header">
    <router-link to="/previous-surprises" class="logo-link" v-if="userSelected">
      <p>Previous Surprises</p>
    </router-link>
    <div class="logos">
      <router-link to="/">
        <h1 id="header-title">Surprise To-Do</h1>
      </router-link>
      <img src="../public/images/present-logo.png" class="picture">
    </div>
    <router-link to="/to-do-list" class="logo-link" v-if="userSelected">
      <p>To-Do List</p>
    </router-link>
  </div>
  <div class="user-selection" v-if="this.$root.$data.user===''">
    <div class="explanation" id="user-explanation">
      <h1>Looks like you do not have a user selected. Please select one below or create a new one!</h1>
    </div>
    <div class="form-container">
      <form v-on:submit.prevent="addUser">
        <input type="text" v-model="customUser" placeholder="Last, First">
        <button type="submit" class="customUserButton">Add User</button>
      </form>
    </div>
    <div class="users-container">
      <div class="user-button-container" v-for="user in this.users" :key="user.id">
        <button class="user-button" v-on:click="selectUser(user)">{{user.name}}</button>
        <button class="delete-user-button" v-on:click="deleteUser(user)">X</button>
        <button class="edit-user-button" v-on:click="openEdit(user)">Edit</button>
      </div>
    </div>
    <div class="user-edit-container" v-if="userEdit">
      <input type="text" v-model="newUserName">
      <button class="submitEditButton" v-on:click="editUser">Submit</button>
    </div>
  </div>
  <div class="user-greeting" v-if="this.$root.$data.user!==''">
    <h3>Welcome {{this.$root.$data.user.name}}!</h3>
    <router-link to="/">
      <button class="logoutButton" v-on:click="logout" router-link>Logout</button>
    </router-link>
  </div>
    <router-view />
  <div class="footer">
    <a href="https://github.com/MrParkerP/creative-project-3">Github</a>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      customUser: '',
      users: [],
      user: '',
      categories: [],
      userSelected: false,
      userEdit: false,
      newUserName: '',
    }
  },
  created() {
    this.getUsers();
  },
  methods: {
    logout() {
      this.$root.$data.user = '';
      this.$root.$data.generating = false;
      this.userSelected = false;
    },
    openEdit(user) {
      this.user = user;
      this.userEdit = true;
    },
    async addUser() {
      try {
        await axios.post('/api/user', {
          name: this.customUser
        });
      } catch(error) {
        console.log(error);
      }

      this.getUsers();
      this.customUser = '';
    },
    async getUsers() {
      try {
        let response = await axios.get("/api/user");
        this.users = response.data;
        return true;
      } catch(error) {
        console.log(error);
      }
    },
    selectUser(user) {
      this.$root.$data.user = user;
      this.user = user;
      this.userSelected = true;
    },
    async deleteUser(user) {
      try {
        await axios.delete("/api/user/" + user._id);
        this.getUsers();
        return true;
      } catch(error) {
        console.log(error);
      }
    },
    async editUser(){
      try {
        await axios.put("/api/user/" + this.user._id, {
          name: this.newUserName
        });
        this.getUsers();
        this.userEdit = false;
        return true;
      } catch(error){
        console.log(error);
      }
    },
  },
}

</script>

<style>

#app {
  min-height: 100vh;
}

.header {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  background-color: #abcca9;
}

#header-title {
  text-align: center;
  font-family: "Garamond", serif;
  font-size: 3em;
  color: #a83d36;
}

.picture {
  height: 75px;
  width: 75px;
  margin-left: 20px;
}

.logos {
  display: flex;
  align-items: center;
}

.footer {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #abcca9;
  position: fixed;
  bottom: 0;

}

a {
  text-align: center;
  text-decoration: none;
}

.logo-link {
  display: flex;
  color: black;
  padding-top: 10;
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

.edit-user-button {
  margin-right: 20px;
}

.delete-user-button {
  background-color: red;
}

.edit-user-button {
  background-color: #f5e967;
}

.user-edit-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
