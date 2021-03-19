<template>
<div id="app">
  <div class="header">
    <router-link to="/previous-surprises" class="logo-link">
      <p>Previous Surprises</p>
    </router-link>
    <div class="logos">
      <router-link to="/">
        <h1 id="header-title">Surprise To-Do</h1>
      </router-link>
      <img src="../public/images/present-logo.png" class="picture">
    </div>
    <router-link to="/to-do-list" class="logo-link">
      <p>To-Do List</p>
    </router-link>
  </div>
    <router-view />
  <div class="footer">
    <a href="https://github.com/MrParkerP/creative-project-3">Github</a>
  </div>
</div>
</template>

<style>

#app {
  position: relative;
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

  position: absolute;
  bottom: 0;

}

a {
  text-align: center;
  text-decoration: none;
}

.logo-link {
  display: flex;
  color: black;
  padding-top: 32px;
}


</style>
