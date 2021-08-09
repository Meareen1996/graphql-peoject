//使用express+graphql
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// console.log('graphqlHTTP',graphqlHTTP)
//构建schema，这里定义查询的语句和类型
var schema = buildSchema(`
    type Account{
        name:String
        age:Int
        sex:String
        department:String
        salary(city:String):Int
    }
    type Query {
       getClassMates(classNo:Int!):[String]
       account(username:String):Account
    }
`);

var root = {
  getClassMates({ classNo }) {
    const obj = {
      31: ["张大", "李四", "王五"],
      61: ["张大三", "李大四", "王大五"],
    };
    return obj[classNo];
  },
  account({ username }) {
    const name = username;
    const sex = "man";
    const age = 18;
    const department = "开发部";
    const salary = ({ city }) => {
      if (
        city === "北京" ||
        city == "上海" ||
        city == "广州" ||
        city == "深圳"
      ) {
        return 10000;
      }
      return 3000;
    };
    return {
      name,
      sex,
      age,
      department,
      salary,
    };
  },
};

var app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphql: true,
  })
);
app.use(express.static('public'))

app.listen(4000, () => {
  console.log("当前端口服务器已启动");
});
