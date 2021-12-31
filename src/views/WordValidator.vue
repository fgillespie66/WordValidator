<template>
  <div>
      <header>
        <h1 class="title">Word Validator</h1>
      </header>
      <InputSection :dictionary="dictionary"/>
  </div>
</template>

<script>
import InputSection from "../components/InputSection.vue";

export default {
  name: "WordValidator",
  props: [],
  components: {
    InputSection
  },
  data() {
    return {
        dictionary: this.dictionary,
    };
  },
};
</script>

<style>
@media screen and (max-width: 500px) {
    .title {
        display: none;
    }
}
</style>
