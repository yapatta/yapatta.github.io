# SECD Machine Implemented in TypeScript

Forked from https://github.com/novogeek/SECD-JS

This Implementation is derived from "https://www.cs.cmu.edu/afs/cs/user/crary/www/819-f09/Landin64.pdf" and rewrote original code according to this paper.

Thanks a lot.

Exec below command before opening index.html.

```
tsc secd.ts --lib dom,es6
```

## Example

### 1. (λx.x)a := a

Input 

```
app:[{func:{arg:'x',body:'x'}},{var:{name:'a',val:3}}]
```

Output

```
{"var":{"name":"a","val":3}}
```

### 2. (λxy.x)ab := a

Input

```
app:[{app:[{func:{arg:'x',body:{func:{arg:'y',body:'x'}}}},{var:{name:'a',val:1}}]},{var:{name:'b',val:4}}]
```

Output

```
{"var":{"name":"a","val":1}}
```

### 3. (λxy.y)ab := b

Input

```
app:[{app:[{func:{arg:'x',body:{func:{arg:'y',body:'y'}}}},{var:{name:'a',val:4}}]},{var:{name:'b',val:5}}]
```

Output

```
{"var":{"name":"b","val":5}}
```

### 4. (λy.y)((λx.x)a) := a

Input

```
app:[{func:{arg:'y',body:'y'}},{app:[{func:{arg:'x',body:'x'}},{var:{name:'a',val:2}}]}]
```

Output

```
{"var":{"name":"a","val":2}}
```
