const fs = require('fs');
const path = require('path');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const FileCtrl = require('./fileCtrl.js');
const config = require('./config.js');

const app = new Koa();
const fc = new FileCtrl(config.root);

const ext2typeJson = fs.readFileSync(path.join(__dirname, './content-type.json'), 'utf8');

const ext2type = (ext) => {
    ext = ext[0] === '.' ? ext : '.' + ext;
    
    const dict = JSON.parse(ext2typeJson);
    let contentType = dict[ext];
    return contentType || "application/octet-stream";
}

app.use(bodyParser());

app.use(async ctx => {
    const { request } = ctx;

    let ext = path.extname(ctx.path);
    ctx.type = ext2type(ext);

    switch (ctx.path) {
        case '/':
            ctx.type = 'text/html';
            ctx.body = fs.readFileSync(path.join(__dirname ,'../build/index.html'), 'utf8');
            break;
        case '/get_root':
            if (request.method === 'GET') {

                ctx.type = 'text/json';
                ctx.body = JSON.stringify({
                    root: config.root,
                });
            }
            break;
        case '/path':
            if (request.method === 'POST') {
                let { body } = request;

                if (body.path) {
                    ctx.type = 'text/json';
                    ctx.body = JSON.stringify(fc.ls(body.path));
                }
            }
            break;
        case '/file':
            if (request.method === 'GET') {
                let { query } = request;

                if (query.path) {
                    let ext = path.extname(query.path);

                    ctx.type = ext2type(ext);
                    ctx.body = fc.send(query.path);
                }
            }
            break;

        default:
            let filepath = path.join(__dirname, '../build', ctx.path);
            ctx.body = fs.readFileSync(filepath);
    }
    
})


app.listen(3000, () => console.log('Listen on 3000'));

