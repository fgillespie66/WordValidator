<template>
  <div>
      <DefinitionSection :word="upperCaseWord" :isWord="isWord" :definition="definition" />
      <div id="input-section">
        <input class="input" :value="word" type="text" @input="handleInput" placeholder="Please enter your word...">
    </div>
    <div class="completions-contain">
    <ul class="completions">
      <li class="completion" v-for="completion in completionsPreview" :key="completion">
        <router-link :to=completion>{{completion}}</router-link>
      </li>
      <li class="completion" v-if="completions.length != completionsPreview.length">
        +{{completions.length-completionsPreview.length}} more
      </li>
    </ul>
    </div>
  </div>
</template>

<script>
import DefinitionSection from "./DefinitionSection.vue";
//import "https://unpkg.com/tiny-trie@0.2.6/dist/tiny-trie.min.js";
import "../../public/resources/tiny-trie.min.js"
//import { PackedPrefixTinyTrie } from "../../public/resources/fast_packed_trie.js";
import { PackedTrie } from "../../public/resources/packed-trie.js"

// Compute width of a string (calibrated to Helvetica)
// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
function measureTextWidth(str) {
    const widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,0.3546875,0.259375,0.353125,0.5890625];
    const avg = 0.5279276315789471;
  return str
    .split('')
    .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
        .reduce((cur, acc) => acc + cur);
}

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
        completions: [],
        completionsPreview: [],
    };
  },
  created: function() {},
  mounted: function() {
    if (this.$route.params.queryWord) {
      this.word = this.$route.params.queryWord;
      this.checkWord();
    }
  },
  methods: {
    handleInput(evt) {
        this.word = evt.target.value;
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
        this.completionsPreview = this.completions.slice(0, 15);
        let completionsWidth = measureTextWidth("+" + (this.completions.length - this.completionsPreview.length) + " more");
        this.completionsPreview.forEach(completion => completionsWidth = Math.max(completionsWidth, measureTextWidth(completion)))
        // Get the root element
        const r = document.querySelector(':root');
        r.style.setProperty('--completion-column-width', (completionsWidth + 1) + 'em');
    }
  },
  watch: {
    '$route.params.queryWord': function(queryWord) {
      this.word = queryWord;
      this.checkWord();
    }
  }

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
  box-shadow: 0.0 0.05em 0.25em rgba(0, 0, 0, 0.432);
}

/* Hack to allow vertical scrolling in columnar layout */
/* https://stackoverflow.com/questions/36503329/css-columns-overflow-y-scroll-issue/36503666 */
.completions-contain {
  overflow-y: auto;
  max-height: 10em;
  padding: 1em;
  margin: 0em;
  font-size: large;
  background-color: var(--page-background-color-darker);
  border-radius: 0.5em;
  box-shadow: 0.0 0.05em 0.25em rgba(0, 0, 0, 0.432);
}

.completions {
  padding: 0;
  margin: 0;
  max-height: 1000em;
  min-height: 5em;
  list-style-type: none; /* Remove bullets */
  column-width: var(--completion-column-width);
}

.completion {
}

.completion > a {
  padding: 0.25em;
  text-decoration: none;
  color: var(--theme-color);
  border-radius: 0.5em;
}

.completion > a:hover {
  background-color: var(--page-background-color);
  /* color: white; */
}

</style>
