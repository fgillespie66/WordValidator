<template>
  <div>
    <header>
      <h1 class="title">Anagrammer</h1>
    </header>
    <InputSection @textInput="checkInputWord" />
    <CompletionSection :completions="completions" />
    <Navigation />
  </div>
</template>

<script>
import InputSection from "../components/InputSection.vue";
import CompletionSection from "../components/CompletionSection.vue";
import Navigation from "../components/Navigation.vue";

export default {
  name: "Anagrammer",
  props: [],
  components: {
    InputSection,
    CompletionSection,
    Navigation,
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
        const wordLen = this.upperCaseWord.length;
        const sortedChars = this.upperCaseWord.split("").sort();
        let queryRegexp;
        if (sortedChars[0] === ".") {
          while (sortedChars[0] === ".") {
            sortedChars.shift();
          }
          const sortedWord = sortedChars.join(".*");
          queryRegexp = new RegExp("^.*" + sortedWord + ".*$");
        } else {
          const sortedWord = sortedChars.join("");
          queryRegexp = new RegExp("^" + sortedWord + "$");
        }

        for (const key in this.dictionary) {
          if (
            key.length === wordLen &&
            queryRegexp.test(key.split("").sort().join(""))
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
