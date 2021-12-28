<template>
  <div>
      <DefinitionSection :word="upperCaseWord" :isWord="isWord" :definition="definition" />
      <div id="input-section">
        <input class="input" :value="word" type="text" @input="checkWord" placeholder="Please enter your word...">
      </div>
    </div>
</template>

<script>
import DefinitionSection from "./DefinitionSection.vue";

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
    };
  },
  created: function() {},
  methods: {
    checkWord(evt) {
        this.word = evt.target.value;
        this.upperCaseWord = this.word.toUpperCase();
        if (this.upperCaseWord in this.dictionary) {
           this.isWord = true;
           this.definition = this.dictionary[this.upperCaseWord];
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
</style>
