var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var moment = require('moment')
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

////引入arttemplate模板
var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var fs = require('fs');
var db = require('./db')


function getPages(page, pageCount) {
    var pages = [page]
    var left = page - 1
    var right = page + 1

    while (pages.length < 11 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--)
        if (right <= pageCount) pages.push(right++)
    }
    return pages
}
// app.get('/',(req,res)=>{

// })
// app.get('/form', (req, res) => {
//     res.render('form')
// })
// app.post('/form', (req, res) => {
//     var blog = new db.Blog(req.body)
//     console.log(req.body)
//     blog.index = 1
//     blog.save(err => {
//         if (err) {
//             console.log(err)
//         }
//         res.redirect('/formList')
//     })


// })

// app.get('/formList', (req, res) => {
//     db.Blog.find().exec((err, data) => {
//         if (err) {
//             console.log(err)

//         }
//         data.forEach(function (item) {

//             item.birthdayforshow = moment(new Date(item.birthday)).format('YYYY/MM/DD')
//             console.log(item.birthday)
//         })
//         res.render('formList', { data: data })
//     })

// })

app.get('/form/:id', function (req, res, next) {
    var id = req.params.id
    db.Blog.findById(id, (err, data) => {


        if (data) {

            data.birthdayforshow = moment(data.birthday).format('YYYY-MM-DD')
            console.log(data.birthdayforshow)
            console.log('修改')
        }
        else {
            data = new db.Blog()
            console.log('新增')
        }
        res.render('form', { data: data })
    })
})
app.post('/form/:id', function (req, res, next) {
    var id = req.params.id
    var stude = req.body
    stude.age = ((new Date()).getFullYear()) - (new Date(req.body.birthday)).getFullYear()
    db.Blog.findByIdAndUpdate(id, stude, {
        upsert: true
    }, (err) => {
        if (err) {
            console.log(err)
        }
        res.redirect('/')
    })

})
app.get('/list', (req, res) => {
    res.render('list');
})
// app.get('/', (req, res) => {
app.get('/listData/:page', function (req, res, next) {

    var filter = {}
    var name = req.query.yourname
    var mobile = req.query.yournumber
    var gender = req.query.yourgender
    console.log(name)
    if (!!name) {
        filter.name = { '$regex': `.*?${name}.*?` }

    }

    if (!!mobile) {
        filter.mobile = mobile
    }
    if (!!gender) {
        filter.gender = gender
    }
    // console.log(filter)
    var page = req.params.page
    page = page || 1
    page = parseInt(page)
    var pageSize = 2


    db.Blog.find(filter).count((err, total) => {
        if (err) {
            console.log(err)
        }
        var pageCount = Math.ceil(total / pageSize)

        if (page > pageCount) {
            page = pageCount
        }
        if (page < 1) {
            page = 1
        }

        /*****
         * skip跳过当前页码-1的页数的数据
         * limit取当前需要的一页显示数量
         */

        db.Blog.find(filter).skip((page - 1) * pageSize)
            .limit(pageSize).sort({ 'age': -1 }).exec((err, data) => {


                var data = data.map(function (item) {

                    item = item.toObject()
                    item.id = item._id.toString()
                    delete item._id


                    item.birthdayforshow = moment(item.birthday).format('YYYY-MM-DD')
                    return item
                })

                res.json({ data: data, pages: getPages(page, pageCount), page: page, pageCount: pageCount })
            })
    })
})







app.post('/delete', function (req, res) {
    if (req.body.id) {
        db.Blog.findByIdAndRemove(req.body.id, (err) => {
            if (err) {
                console.log(err)
                res.json({ status: "n", msg: "参数错误" })
            }
            res.json({ status: "y", msg: "删除成功" })
        })

    }
    else {
        res.json({ status: "n", msg: "参数错误" })
    }

})

//     //  var cat = new Cat()
//     // cat.name = 'Cat_'+(i+1)
//     // cat.age = Math.floor(Math.random()*10)+10
//     // cat.save()
//     // //查询cats集合所有的数据exec执行后调用回调函数
//     //function(err,data)//err表示错误信息data表示查询结果
//     //如果不报错，那么err值为null
//     // for (var i = 0; i < 10;i++) {
//     //     var cat = new Cat()
//     //     cat.name = 'Cat_'+(i+1)
//     //     cat.age = Math.floor(Math.random()*10)+10
//     //     cat.save()
//     // }

//     db.Cat.find().exec((err, data) => {
//         res.json(data)
//     })
//     // res.send('express项目启动')
// })

// app.get('/getDogs', (req, res) => {
//     db.Dog.find().exec((err, data) => {
//         res.json(data)
//     })

// })
//   app.get('/createDog', (req, res) => {
//         var dog = new db.Dog()
//         dog.name = req.query.name
//         dog.age = req.query.age
//         if (req.query.friends) {
//             dog.friends = req.query.friends.split('|')
//         }
//         dog.save()
//         console.log('保存完成')
//         res.send("end!")
//     })
function initApp(req, res, next) {
    /////判断目录是否存在
    fs.exists('./public/uploads', function (d) {
        if (d) {
            console.log('上传目录已存在');
            next();
        }
        else {
            /////创建一个在项目根目录中创建一个notes目录
            fs.mkdirSync('./public/uploads');
            console.log('初始化上传目录完成');
            next();
        }
    })
}

app.use('/comms', require("./comms/comms"))
// app.use('/student',require('./routes/studens'));
app.get('/', initApp, (req, res) => {
    // res.send('app启动');
    res.redirect('/list');
})
app.listen(3000, (req, res) => {
    console.log('服务器运行成功')
})
