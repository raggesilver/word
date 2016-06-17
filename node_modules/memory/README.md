
memory
======

 *Node.js module to grab your current memory usage in various formats*
 
 ***Why? Pretty common helper function, easier to just require() than /lib/ it over & over***

```bash
$ npm install memory
```

**Example (basic)**

```javascript
var memory = require("memory");

var mb = memory();
console.log("Memory usage: ", mb);
```

**Example (with options)**

```javascript
var memory = require("memory");

var mb = memory(4, true);
console.log("Memory usage: ", mb);
```