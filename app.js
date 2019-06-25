const http = require('http');
const request = require("request");
const fs = require("fs");


const srcList = async () => {
    return new Promise((resolve, reject) => { //获取歌曲列表
        http.get('http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=%E5%AE%8B%E5%86%AC%E9%87%8E&pn=1&rn=30', function (res) {
            var str = '';
            console.log('Response is ' + res.statusCode);

            res.on('data', function (chunk) {
                str += chunk;
            });

            res.on('end', function () {
                resolve(JSON.parse(str).data.list);
            });

            res.on('error', function () {
                resolve({ code: 1, message: '失败' });
            })
        });
    })
}

const mp3Add = async function () { //获取歌曲的MP3地址信息
    let list = await srcList();

    list.forEach(element => {
        http.get('http://www.kuwo.cn/url?format=mp3&rid=' + element.rid + '&response=url&type=convert_url3&br=128kmp3&from=web&t=1561434365016', function (res) {
            var str = '';

            res.on('data', function (chunk) {
                str += chunk;
            });

            res.on('end', function () {

                downLoadMp3(JSON.parse(str).url, element.name, function () {

                });

            });
        });
    })
}



let downLoadMp3 = (url, fileName, callback) => {  //下载mp3文件到本地
    request.head(url, function (err, res, body) {
        if (err) {
            return false;
        }
        request(url)  //调用request的管道来下载到 images文件夹下
            .pipe(
                fs.createWriteStream('images/' + fileName + '.mp3')
            )
            .on('close', callback);
    })
}


mp3Add();
