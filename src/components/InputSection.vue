<template>
  <div id="input-section">
    <input
      class="input"
      :value="word"
      type="text"
      @input="handleInput"
      placeholder="Please enter your word..."
    />
  </div>
</template>

<script>
export default {
  name: "InputSection",
  components: {},
  props: [],
  data() {
    return { word: "" };
  },
  mounted: function () {
    if (this.$route.params.queryWord) {
      this.word = this.$route.params.queryWord;
      this.$emit("textInput", this.word);
    }
  },
  methods: {
    handleInput(evt) {
      this.word = evt.target.value;
      this.$emit("textInput", this.word);
    },
  },
  watch: {
    "$route.params.queryWord": function (queryWord) {
      this.word = queryWord;
      this.$emit("textInput", this.word);
    },
  },

  /*  grid-auto-columns: repeat( auto-fit, minmax(var(--completion-column-width), 1fr) ); */
};
</script>

<style>
.input {
  margin: 1em 0em;
  padding: 0.3em;
  font-size: large;
  width: 100%;
  border-radius: 0.5em;
  border: 0px;
  box-shadow: 0 0.05em 0.25em rgba(0, 0, 0, 0.432);
}
</style>
