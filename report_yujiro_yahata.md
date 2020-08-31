# 計算モデル論レポート課題

<br>
<div style="text-align: right;">氏名: 八幡悠二郎</div>
<div style="text-align: right;">学籍番号: 61819922</div>
<br>
<br>

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
