// arrays of words for terminal symbols
var verb = ["climb", "imagine", "jump", "think", "see", "eat", "sit", "walk", "sleep", "cradle", "fall", "create", "answer", "leap", "sneeze"]
var adj = ["soggy", "plump", "hairy", "purple", "bruised", "charming", "funky", "silly", "pretty", "computational", "annoying", "merciful", "intelligent", "sloppy", "dapper", "loquacious"]
var aux = ["can", "may", "might", "will", "would"]
var noun = ["dragon", "charity", "ambition", "Josephine", "chocolate", "king", "stranger", "Carl","Kevin", "Hillary", "Winnie the Pooh", "Voldemort", "lunch box", "sandcastle"]
var prep = ["in", "of", "to"]
var det = ["a", "the", "another", "this", "that"]
var wp = ["who", "which", "that", "whose"]

// objects for FSAs of non-terminal symbols
var fsaS = {
  startState: "S",
  transitions: [
    { state: "S", sym: "NP", dest: "q1" },
    { state: "S", sym: "aux", dest: "q2" },
    { state: "q1", sym: "aux", dest: "q3" },
    { state: "q1", sym: "VP", dest: "q4"},
    { state: "q3", sym: "VP", dest: "q4"},
    { state: "q4", sym: ".", dest: "q5"},
    { state: "q2", sym: "NP", dest: "q6"},
    { state: "q6", sym: "VP", dest: "q7"},
    { state: "q7", sym: "?", dest: "q8"}],
  acceptStates: ["q5", "q8"]
}
var fsaNP = {
  startState: "NP",
  transitions: [
    { state: "NP", sym: "det", dest: "q1" },
    { state: "NP", sym: "adj", dest: "q1" },
    { state: "q1", sym: "adj", dest: "q1" },
    { state: "q1", sym: "noun", dest: "q2" },
    { state: "NP", sym: "noun", dest: "q2" },
    { state: "q2", sym: "PP", dest: "q3" },
    { state: "q3", sym: "WHNP", dest: "q4" },
    { state: "q2", sym: "WHNP", dest: "q4" }],
  acceptStates: ["q2", "q3", "q4"]
}
var fsaPP = {
  startState: "PP",
  transitions: [
    { state: "PP", sym: "prep", dest: "q1" },
    { state: "q1", sym: "NP", dest: "q2" }],
  acceptStates: ["q2"]
}
var fsaVP = {
  startState: "VP",
  transitions: [
    { state: "VP", sym: "verb", dest: "q1" },
    { state: "q1", sym: "NP", dest: "q2" },
    { state: "q1", sym: "PP", dest: "q2" },
    { state: "q1", sym: "adj", dest: "q3" },
    { state: "q2", sym: "PP", dest: "q2" }],
  acceptStates: ["q1", "q2","q3"]
}
var fsaWHNP = {
  startState: "WHNP",
  transitions: [
    { state: "WHNP", sym: ",", dest: "q1" },
    { state: "q1", sym: "wp", dest: "q2" },
    { state: "q2", sym: "NP", dest: "q3" },
    { state: "q2", sym: "aux", dest: "q4" },
    { state: "q3", sym: "aux", dest: "q4" },
    { state: "q4", sym: "VP", dest: "q5" },
    { state: "q5", sym: ",", dest: "q6" }],
  acceptStates: ["q6"]
}

// sentence to be generated
var sentence = [];

// hash tables for symbols 
var nonterminals = {
  "S": fsaS,
  "NP": fsaNP,
  "VP": fsaVP,
  "PP": fsaPP,
  "WHNP": fsaWHNP
}
var terminals = {
  "verb": verb,
  "adj": adj,
  "aux": aux,
  "noun": noun,
  "prep": prep,
  "det": det,
  "wp": wp
}

// Gets a random item from list of English words for appropriate part of speech
function getword(partOfSpeech) {
  return partOfSpeech[Math.floor(Math.random() * partOfSpeech.length)];
}

// Generates words in an FSA
function generate(fsa) {
  var currentState = fsa.startState; // track our current state
  var accept = false; // boolean that lets us continue or exit loop

  do {
    // 0. If current state is accept state, decide if we should accept
    if (fsa.acceptStates.includes(currentState)) { // ask if current state is accept state
      randomAccept = Math.floor(Math.random() * 11) // random number between 0-10
      if (randomAccept > 5) { // random probability for accepting
        accept = true;
        break; // if decide to accept, don't need to determine transitions, so we can exit loop
      }
    }

    // 1. Get transitions for current state
    var currentTransitions = []; // array of possible transitions for current state
    for (transition of fsa.transitions) { // loop through all transitions in the FSA
      if (transition.state == currentState) { // check state property in each transition
        currentTransitions.push(transition); // add transition to the array
      }
    }

    // 2. Choose a transition randomly
    var numTransitions = currentTransitions.length; // gets length of the array of transitions 
    // First check to see if there are any available transitions to take; if not, then break
    if (numTransitions < 1 || currentTransitions == undefined) {
      accept = true;
      break; // 
    }
    // If there are available transitions, then let's randomize an int to index the list
    var randomTransition = Math.floor(Math.random() * numTransitions); // range from 0 to the number of transitions 
    var transition = currentTransitions[randomTransition]; // index the list of current transitions using our random number to choose a transition randomly

    // 3. Emit the letter/symbol on that transition 
    var sym = transition.sym;
    if (nonterminals.hasOwnProperty(sym)) { 
      // If non-terminal symbol, call function recursively.
      generate(nonterminals[sym])
    } else if (terminals.hasOwnProperty(sym)) { 
      // If terminal symbol, get English word and append it to the sentence array variable.
      sentence.push(getword(terminals[sym]))
    } else {
      // If punctuation, just append to the sentence.
      sentence.push(sym)
    }

    // 4. Change current state to new state
    currentState = transition.dest;
  }
  while (accept == false); // keep looping if we haven't accepted
}

// Run program
generate(fsaS);
// Join sentence array into a string and print
console.log(sentence.join(' '));