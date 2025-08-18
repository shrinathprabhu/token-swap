<template>
  <header id="app-header">
    <div class="header-content">
      <img src="../assets/images/avail-logo.svg" />
      <button class="button primary">Disconnect</button>
    </div>
    <div class="section-bottom-separator"></div>
  </header>
</template>

<style lang="css" scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 2rem;
}

.header-content img {
  height: 2rem;
}

.header-content button {
  padding: 1rem 2rem;
}
</style>
