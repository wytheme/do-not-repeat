
# 自动化的小工具集合

业务高度定制，但是思路是可以借鉴，我们讨厌增删改查！GO!

## Run

`npm start`


```
15:39:34] Using gulpfile ~/gulpfile.js
[15:39:34] Starting 'default'...
2017-06-30T07:39:35.477Z - info: argv _=[], $0=crud/run.js
mkdir: path already exists: ~/crud/Test

2017-06-30T07:39:35.512Z - error:
2017-06-30T07:39:35.520Z - info: --------------- saved! ----------------
2017-06-30T07:39:35.521Z - info: tpl   : ~/crud/View.ejs
2017-06-30T07:39:35.521Z - info: output: ~/crud/Test/Test.jsx
2017-06-30T07:39:35.521Z - info: copy to
2017-06-30T07:39:35.526Z - info: targetPath: xxx
2017-06-30T07:39:35.526Z - info: --------------- saved! ----------------
2017-06-30T07:39:35.527Z - info: tpl   : ~/crud/View.model.ejs
2017-06-30T07:39:35.527Z - info: output: ~/crud/Test/Test.model.js
2017-06-30T07:39:35.527Z - info: copy to
2017-06-30T07:39:35.529Z - info: targetPath: xxx
2017-06-30T07:39:35.529Z - info: --------------- saved! ----------------
2017-06-30T07:39:35.529Z - info: tpl   : ~/crud/ViewEditModal.ejs
2017-06-30T07:39:35.529Z - info: output: ~/crud/Test/TestEditModal.jsx
2017-06-30T07:39:35.529Z - info: copy to
2017-06-30T07:39:35.530Z - info: targetPath: xxx
```

## CRUD 增删改查
> 业务场景：管理后台等 重复性工作比较多的场景

工具集合

- js-yaml 配置文件
- ejs 解析模板
- shelljs 执行shell脚本
- gulp 监听

### 1. gulp监听文件修改

```javascript
shell.exec('node crud/run.js')
```

### 2. run.js 入口

1. 读取配置run.yml配置信息

```yml
# --------基础配置-------
# 编译后文件复制的目标地址
targetPath: ...
# 父级模块名称
parentName: Test
# 当前模块名称
modelName: Test

# --------功能相关-------
feature:
  # 是否需要引入集群模块
  isCluster: true

# --------table相关-------
table:
  # 表名
  title: 异常列表
  # 表头
  th: ["编号", "异常时间", "更多操作"]
  # 关联域（需要和表头对应）
  fields: ["Id", "ErrorDate", ""]
  # 编辑的时候不需要编辑的字段
  editFields: 
    - 
      field: ErrorDate
      label: 异常日期
      placeholder: 20170606
      validators:
        notEmpty: 异常日期不能为空
```

2. 读取p模板信息并通过ejs解析输出

```javascript 
const url = {
	config: path.resolve(__dirname, './run.yml'),
  output: [
    {
      tpl: path.resolve(__dirname, './View.ejs'),
      ext: '.jsx'
    },
    {
      tpl: path.resolve(__dirname, './View.model.ejs'),
      ext: '.model.js'
    },
    {
      tpl: path.resolve(__dirname, './ViewEditModal.ejs'),
      ext: 'EditModal.jsx'
    }
  ],
  targetPath: ''
}
``` 

3. 默认输出到当前目录，并可以通过shell同步到开发目录




