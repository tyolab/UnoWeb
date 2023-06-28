# UnoWeb


## Usage

### Converting Template To a Jekyll Project

We can get some template from any web(theme) designer, which normally contains a set of html files with also js, css files inside it

```bash
node convert.js --from /data/tyolab/themes/boilerplates/vex --to /data/tyolab/mynewweb/client --dry-run true index.html
```

### Converting Temlate to a NextJS Project

#### Step 1

```bash
node convert.js --from /data/tyolab/themes/boilerplates/vex --to /data/tyolab/mynewweb/client --dry-run true --engine nextjs --strip_layout false index.html
```

#### Step 2

```
# Replace All Strings
"\{(.*)\}" -> {$1}
```


### Creating language