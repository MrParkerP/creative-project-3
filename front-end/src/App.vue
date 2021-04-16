<template>
<div id="app">
  <div class="header">
    <router-link to="/previous-surprises" class="logo-link" v-if="this.$root.$data.user !== null">
      <p>Previous Surprises</p>
    </router-link>
    <div class="logos">
      <router-link to="/">
        <h1 id="header-title">Surprise To-Do</h1>
      </router-link>
      <img src="../public/images/present-logo.png" class="picture">
    </div>
    <router-link to="/to-do-list" class="logo-link" v-if="this.$root.$data.user !== null">
      <p>To-Do List</p>
    </router-link>
  </div>
  <div class="user-selection" v-if="this.$root.$data.user===null">
    <div class="explanation" id="user-explanation">
      <h1>Looks like you are not logged in. Please login or register below!</h1>
    </div>
    <div class="form-container">
      <h1>Login</h1>
      <div class="input-container">
        <input type="text" v-model="usernameLogin" placeholder="Username">
      </div>
      <div class="input-container">
        <input type="password" v-model="passwordLogin" placeholder="Password">
      </div>
      <div class="input-container">
        <button class="customUserButton" v-on:click="login">Login</button>
      </div>
    </div>
    <div class="form-container">
      <h1>Register</h1>
      <div class="input-container">
        <input type="text" v-model="firstName" placeholder="First Name">
      </div>
      <div class="input-container">
        <input type="text" v-model="lastName" placeholder="Last Name">
      </div>
      <div class="input-container">
        <input type="text" v-model="username" placeholder="Username">
      </div>
      <div class="input-container">
        <input type="password" v-model="password" placeholder="Password">
      </div>
      <div class="input-container">
        <button class="customUserButton" v-on:click="register">Register</button>
      </div>
    </div>
  </div>
  <div class="user-greeting" v-if="this.$root.$data.user!==null">
    <h3>Welcome, {{this.$root.$data.user.firstName}} {{this.$root.$data.user.lastName}}!</h3>
    <router-link to="/">
      <button class="logoutButton" v-on:click="logout" router-link>Logout</button>
    </router-link>
    <button class="editUserButton" v-on:click="openEdit">Edit</button>
  </div>
  <div class="edit-user-container" v-if="userEdit">
      <div class="input-container">
        <input v-model="newFirstName" placeholder="New First Name">
      </div>
      <div class="input-container">
        <input v-model="newLastName" placeholder="New Last Name">
      </div>
      <div class="input-container">
        <button class="submitEditButton" v-on:click="editUser">Submit</button>
      </div>
    <div class="buttons-container">
      <div class="input-container">
        <button class="deleteUserButton" v-on:click="deleteUser(user)">Delete User</button>
      </div>
      <div class="input-container">
        <button class="closeUserEdit" v-on:click="closeUserEdit">Close</button>
      </div>
    </div>
  </div>
    <router-view />
  <div class="footer">
    <a href="https://github.com/MrParkerP/creative-project-3">Github</a>
    <div>Hours: 7</div>
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
      user: '',
      categories: [],
      userEdit: false,
      newFirstName: '',
      newLastName: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
    }
  },
  async created() {
    try {
      let response = await axios.get('/api/user');
      this.$root.$data.user = response.data.user;
      this.user = this.$root.$data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/user");
        this.$root.$data.user = null;
        this.$root.$data.generating = false;
        this.userEdit = false;
      } catch (error) {
        this.$root.$data.user = null;
        this.$root.$data.generating = false;
        }
    },
    closeUserEdit() {
      this.userEdit = false;
      this.newLastName = '';
      this.newFirstName = '';
    },
    openEdit() {
      this.userEdit = true;
    },
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/user', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        this.user = this.$root.$data.user;
        this.firstName = '';
        this.lastName = '';
        this.username = '';
        this.password = '';
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
       this.error = '';
       this.errorLogin = '';
       if (!this.usernameLogin || !this.passwordLogin)
         return;
       try {
         let response = await axios.post('/api/user/login', {
           username: this.usernameLogin,
           password: this.passwordLogin,
         });
         this.$root.$data.user = response.data.user;
         this.usernameLogin = '';
         this.passwordLogin = '';
       } catch (error) {
         this.errorLogin = "Error: " + error.response.data.message;
         this.$root.$data.user = null;
       }
    },
    async deleteUser(user) {
      try {
        this.logout();
        await axios.delete("/api/user/" + user._id);
        return true;
      } catch(error) {
        console.log(error);
      }
    },
    async editUser(){
      if ((this.newFirstName!=='') && (this.newLastName!=='')) {
        try {
          await axios.put(`/api/user/${this.user._id}`, {
            firstName: this.newFirstName,
            lastName: this.newLastName,
          });
          this.userEdit = false;
          this.$root.$data.user.firstName = this.newFirstName;
          this.$root.$data.user.lastName = this.newLastName;
          this.newLastName = '';
          this.newFirstName = '';
          this.user = this.$root.$data.user;
          return true;
        } catch(error){
          console.log(error);
        }
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
  justify-content: space-around;
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


.user-edit-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.form-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.user-selection {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.input-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
}

.editUserButton {
  background-color: white;
  border: none;
  padding-top: 5px;
  color: blue;
}

.deleteUserButton {
  background-color: #fa7575;
}

.submitEditButton {
  background-color: #abcca9;
}
</style>
