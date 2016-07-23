var db = require('mongoose')
///链接数据库moogodb协议，localhost主机ip，first_db数据库名称
db.connect('mongodb://localhost/db_studens')
// var Cat = db.model('Cat',{name:String,age:Number,friends:String})
// // var Dog = db.model('Dog',{name:String,age:Number,friends:[String],birthday:Data})
// var Dog=db.model('Dog',{
//     name:{
//         type:String,
//         default:"gogogo"
//     },
//     age:{
//    type:Number,
//    default:10
//     },
//     friends:{
//         type:[String],
//         default:[]
//     },
//     birthday:{
//         type:Date,
//         default:Date.now
//     }
// })

// module.exports = {
//     Cat:Cat,
//     Dog:Dog
// }

var Blog = db.model('Blog', {
    avatar:{type:String,default:""},
    name: { type: String, default: "" },
    mobile: { type: Number, default: "" },
    birthday: { type: Date, default: Date.now },
    age: { type: Number, default: "" },
    address: { type: String, default: "" },
    email: { type: String, default: "" },
    gender: { type: String, default: "" },
    hobby: { type: String, default: "" },
    remark: { type: String, default: "" }
})
module.exports = {
    Blog: Blog
}
