<template>
  <div>
      <DefinitionSection :word="upperCaseWord" :isWord="isWord" :definition="definition" />
      <div id="input-section">
        <input class="input" :value="word" type="text" @input="checkWord" placeholder="Please enter your word...">
      </div>
      <ul class="completions">
        <li class="completion" v-for="completion in completions.slice(0, 15)" :key="completion">
          {{completion}}
        </li>
        <li class="completion" v-if="completions.length > 15">
          ... and {{completions.length-15}} more
        </li>
      </ul>
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
        completions: []
    };
  },
  created: function() {},
  methods: {
    checkWord(evt) {
        this.word = evt.target.value;
        this.upperCaseWord = this.word.toUpperCase();
        this.completions = this.word.length > 0 ? this.lex.search(this.upperCaseWord, {prefix:true}) : [];
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

.completions {
  overflow-y: auto;
  max-height: 10em;
  min-height: 5em;
  padding: 1em;
  font-size: large;
  background-color: var(--page-background-color-darker);
  border-radius: 0.5em;
  box-shadow: 0.0 0.05em 0.25em rgba(0, 0, 0, 0.432);
  list-style-type: none; /* Remove bullets */

}

.completion {
}

</style>
