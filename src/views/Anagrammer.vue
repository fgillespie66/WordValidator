<template>
  <div>
    <header>
      <h1 class="title">Anagrammer</h1>
    </header>
    <InputSection @textInput="checkInputWord" />
    <CompletionSection :completions="completions" />
  </div>
</template>

<script>
import InputSection from "../components/InputSection.vue";
import CompletionSection from "../components/CompletionSection.vue";

export default {
  name: "Anagrammer",
  props: [],
  components: {
    InputSection,
    CompletionSection,
  },
  data() {
    return {
      dictionary: this.dictionary,
      completions: [],
      word: "",
      upperCaseWord: "",
    };
  },
  mounted: function () {
    if (this.$route.params.queryWord) {
      this.word = this.$route.params.queryWord;
      this.checkWord();
    }
  },
  methods: {
    checkInputWord(word) {
      this.word = word;
      this.checkWord();
    },
    checkWord() {
      this.upperCaseWord = this.word.toUpperCase();
      this.completions = [];

      let checkPlainText = /^([A-Z]|\.)*$/;
      if (checkPlainText.test(this.upperCaseWord)) {
        const sortedWord = this.upperCaseWord.split("").sort().join("");
        const wordLen = sortedWord.length;

        for (const key in this.dictionary) {
          if (
            key.length === wordLen &&
            key.split("").sort().join("") === sortedWord
          ) {
            this.completions.push(key);
          }
        }
      }
    },
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
