<template>
  <div>
      <DefinitionSection :word="upperCaseWord" :isWord="isWord" :definition="definition" />
      <div id="input-section">
        <input class="input" :value="word" type="text" @input="checkWord" placeholder="Please enter your word...">
      </div>
      {{ log }}
    </div>
</template>

<script>
import DefinitionSection from "./DefinitionSection.vue";
//import "https://unpkg.com/tiny-trie@0.2.6/dist/tiny-trie.min.js";
import "../../public/resources/tiny-trie.min.js"
//import { PackedPrefixTinyTrie } from "../../public/resources/fast_packed_trie.js";
import { PackedTrie } from "../../public/resources/packed-trie.js"

export default {
  name: "InputSection",
  components: {
      DefinitionSection,
  },
  props: [
      "dictionary"
  ],
  data() {
    return {
        word: "",
        upperCaseWord: "",
        isWord: false,
        definition: "",
        log: "",
        lex: new PackedTrie(window.packed_lexicon),
    };
  },
  created: function() {},
  methods: {
    checkWord(evt) {
        this.word = evt.target.value;
        this.upperCaseWord = this.word.toUpperCase();
        const query = this.word.length > 0 ? this.lex.search(this.upperCaseWord, {prefix:true}) : null;
        if (query && query.length > 0) {
          if (query[0] === this.upperCaseWord) {
            this.isWord = true;
            this.definition = this.dictionary ? this.dictionary[this.upperCaseWord] : "unknown definition";
          } else {
            this.isWord = false;
          }
          const words = query;
          this.log = "";
          words.forEach((word) => this.log += " " + word);
        } else {
          this.isWord = false;
          this.log = "";
        }
    }
  },
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
    box-shadow: 0.0 0.05em 0.25em rgba(0, 0, 0, 0.432);
}
</style>
