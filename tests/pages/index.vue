<template>
  <div>
    <h1>FormKit Drag and Drop Tests</h1>
    <div class="test-suite-wrapper">
      <div>
        <h2>Sort</h2>
        <div>
          <h4>Vertical</h4>
          <ul>
            <li>
              <nuxt-link to="/sort/vertical">Vertical</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 2em;
}

.test-suite-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2em;
}

ul {
  list-style-type: none;
  padding: 0;
  font-size: 1em;
}

li {
  border-radius: 5px;
  margin: 5px;
  display: flex;
  cursor: pointer;
}

li:hover {
  text-decoration: underline;
}

a {
  text-decoration: none;
  color: black;
}
</style>
