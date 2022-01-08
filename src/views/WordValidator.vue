<template>
  <div>
      <header>
        <h1 class="title">Word Validator</h1>
      </header>
    <DefinitionSection :word="upperCaseWord" :isWord="isWord" :definition="definition" />
    <InputSection @textInput="checkInputWord" />
    <CompletionSection :completions="completions"/>
  </div>
</template>

<script>
import DefinitionSection from "../components/DefinitionSection.vue";
import InputSection from "../components/InputSection.vue";
import CompletionSection from "../components/CompletionSection.vue";
import { PackedTrie } from "../../public/resources/packed-trie.js"

export default {
  name: "WordValidator",
  props: [],
  components: {
      DefinitionSection,
      InputSection,
      CompletionSection,
  },
  data() {
    return {
        dictionary: this.dictionary,
        completions: [],
        word: "",
        upperCaseWord: "",
        isWord: false,
        definition: "",
        log: "",
        lex: new PackedTrie(window.packed_lexicon),
        completionsPreview: [],
    };
  },
  mounted: function() {
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

        let checkPlainText = /^([A-Z]|\.)*$/;
        if (checkPlainText.test(this.upperCaseWord)) {
            this.completions = this.word.length > 0 ? this.lex.search(this.upperCaseWord, {prefix:true, wildcard:"."}) : [];
        } else {
            this.completions = [];
            let queryRegexp = new RegExp("^"+this.word+"$");
            for (const key in this.dictionary) {
                if (queryRegexp.test(key) || queryRegexp.test(key.toLowerCase())){
                    this.completions.push(key);
                }
            }
        }

        if (this.completions.length > 0) {
          if (this.completions[0] === this.upperCaseWord) {
            this.isWord = true;
            this.definition = this.dictionary ? this.dictionary[this.upperCaseWord] : "unknown definition";
          } else {
            this.isWord = false;
          }
        } else {
          this.isWord = false;
        }

        if (this.isWord) this.completions.shift(); // drop word from the completions list
    }
  }
};
</script>

<style>
@media screen and (max-width: 500px) {
    .title {
        display: none;
    }
}
</style>
