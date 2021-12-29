<template>
<div class="definition-section">
  <div class="word">
      {{word}}
  </div>
  <div class="def" v-if="isWord">
      {{definition}}
</div>
<div class="def" id="notword" v-else-if="word.length>0">
       not a word :(
    </div>
    </div>
</template>

<script>

export default {
  name: "DefinitionSection",
  props: [
      "word", 
      "isWord", 
      "definition"
  ],
  data() {
    return {
    };
  }
};
</script>

<style>
.definition-section {
    padding: 1em;
    font-size: large;
    background-color: var(--box-background-color);
    border-radius: 0.5em;
    box-shadow: 0.0 0.05em 0.25em rgba(0, 0, 0, 0.432);
    min-height: 10em;
}

.word {
    font-size: x-large;
    font-weight: bold;
    color: rgb(146, 32, 32);
}

.def{
    color: black;
}

</style>
