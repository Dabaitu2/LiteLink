//创建webpack.config.js
//导入webpack的两个插件
var webpack = require('webpack');
var ExtractText = require('extract-text-webpack-plugin');
var HtmlWebPack = require('html-webpack-plugin');
var HtmlWebpackPlugin = require('html-withimg-loader');


//环境变量配置 dev | online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV);


//获取html-webpack-plugin的通用方法
//trunks 是指使用的 css 是哪些

var getHtmlConfig = function (name,title) {
    return{
        template : './src/view/'+ name +'.html',
        filename : 'view/' + name +'.html',
        title    : title,
        inject   : true,
        hash     : true,
        chunks   : ['common','Bootstrap',name]
    };
};

//webpack config
var config;
config = {
    //入口文件设置，这里导入的文件会被所有的引用,将其看作模块更好
    // 可以看出，在index模块下的index中,引入的其他js模块并没有单独成为新的js文件，而是作为function被index包含了
    entry: {
        // 'util'  : ['./node_modules/util/util.js'],
        'jquery': ['./src/page/common/jquery-3.2.1.min.js'],
        'common': ['./src/page/common/common.js'],
        'Home': ['./src/page/Home/Home.js'],
        'AccountConfirm': ['./src/page/AccountConfirm/AccountConfirm.js'],
        'ApplyDns': ['./src/page/ApplyDns/ApplyDns.js'],
        'ChildDns': ['./src/page/ChildDns/ChildDns.js'],
        'MyAccount': ['./src/page/MyAccount/MyAccount.js'],
        'MyMail': ['./src/page/MyMail/MyMail.js'],
        'MySpace': ['./src/page/MySpace/MySpace.js'],
        'Bootstrap': ['./src/page/common/bootstrap.min.css'],
        'forHome': ['./src/util/forHome.js'],
        'MyOrder': ['./src/page/MyOrder/index.js'],
        'MyManager': ['./src/page/MyManager/index.js'],
        'RSA': ['./src/page/RSA/index.js'],
        'JSEncrypt':['./node_modules/jsencrypt/src/jsencrypt.js']
    },
    output: {
        //node.js中__dirname变量获取当前模块文件所在目录的完整绝对路径
        path: __dirname + '/dist/', //输出位置
        // path:__dirname, //输出位置
        // publicPath: 'http://www.litelink.net/',   //在浏览器端的相对路径
        publicPath: '/dist/',   //在浏览器端的相对路径
        filename: 'js/[name].js' //输出文件，文件名为entry指定的文件名
    },
    //指定外部变量，以script形式引入的文件中的变量可以在这里被指定，然后在所有js文件中以require引用
    // externals: {
    //     'jquery': 'window.jQuery'
    // },
    // externals: {
    //     "echarts": "echarts"
    // },
    module: {
        loaders: [
            {
                test: /\.css$/,//支持正则
                //cssloader使css可以以require形式引入
                //使用extract-webpack-plugin使被索引化的css被抽成css文件
                //还是只会打包成entry指定的模块，且每个页面都包含
                use: ExtractText.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })

            },
            {
                //使所有在css中使用的文件被提取出来进resource文件夹
                test: /\.(gif|png|jpg|jpeg|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=100&name=resource/[name].[ext]'
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    'presets': ['latest'],
                }
            }
        ]
    },
//其他解决方案配置
    resolve: {
        // extensions: ['', '.js', '.json', '.css', '.scss']//添加在此的后缀所对应的文件可以省略后缀
        //为复杂文件夹指定别名，方便require
        alias: {
            node_modules: __dirname + '/node_modules',
            util: __dirname + '/src/util',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            img: __dirname + '/src/img',
            'jquery': __dirname + '/src/page/common/jquery-3.2.1.min.js',
            'Vue': __dirname + '/src/page/common/vue.min.js',
            echarts$: __dirname + "/node_modules/echarts/src/echarts.js",
            echarts: __dirname + "/node_modules/echarts/src",
            zrender$: __dirname + "/node_modules/zrender/src/zrender.js",
            zrender: __dirname + "/node_modules/zrender/src",
            "JSEncrypt": __dirname + "/node_modules/jsencrypt/bin/jsencrypt.js",
            // 'ASN1':__dirname + "/node_modules/jsencrypt/lib/asn1js/asn1.js"
        }
    },
    //插件
    plugins: [
        //指定全局jquery和Vue
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery : 'jquery',
            'window.jQuery': 'jquery',
            Vue : 'Vue',
            JSEncrypt: "JSEncrypt",
            // ASN1:"ASN1"
            // echarts : 'echarts'
        }),
        // new HtmlWebpackPlugin({
        //     template: 'html-withimg-loader!' + path.resolve(__dirname+'/src/view', filename),
        //     filename: filename
        // }),
        //独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            //指向entry的common模块
            //原来指定的common名称就不算数了
            name: 'common',
            filename: 'js/base.js'
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     //指向entry的common模块
        //     //原来指定的common名称就不算数了
        //     name: 'forHome',
        //     filename: 'js/baseHome.js'
        // }),
        //css 单独打包到文件中
        new ExtractText('css/[name].css'),

        //html模板的处理
        new HtmlWebPack(getHtmlConfig('Home', "首页")),
        // new HtmlWebPack({
        //     template : './src/view/Home.html',
        //     filename : 'view/Home.html',
        //     inject   : true,
        //     hash     : true,
        //     chunks   : ['common','Bootstrap','echarts','Home']
        // }),
        new HtmlWebPack(getHtmlConfig('AccountConfirm', "确认页")),
        // new HtmlWebPack(getHtmlConfig('ApplyDns', '申请页')),
        new HtmlWebPack(getHtmlConfig('MyAccount', '申请页')),
        new HtmlWebPack(getHtmlConfig('MyMail', '我的邮箱')),
        new HtmlWebPack(getHtmlConfig('MySpace', '个人中心')),
        new HtmlWebPack(getHtmlConfig('ChildDns', '子域名')),
        new HtmlWebPack(getHtmlConfig('MyOrder', '我的订单')),
        new HtmlWebPack(getHtmlConfig('MyManager', '域名管理')),
        new HtmlWebPack(getHtmlConfig('RSA', '公私钥生成')),
        // new HtmlWebPack(getHtmlConfig('test', '测试'))
    ]

};



//各个页面下的css被同文件夹下的js以require引用，他们又被公共的entry引用


module.exports = config;


