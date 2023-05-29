const Koa = require('koa');
const cors = require('@koa/cors');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const app = new Koa();
app.use(cors({
    origin: '*',
    credentials: true
}));
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
});
const filePath = path.join(__dirname, 'public/content.txt')
io.on('connection', socket => {
    socket.on('start', () => {
        console.log('A user connected');
    })
    socket.on('message', (data) => {
        if (data === '/send-document') {
            // const stream = fs.createReadStream(filePath, { highWaterMark: 1048 })
            const stream = fs.createReadStream(filePath)
            let i = 0;
            let j = 0;
            let chunkList = []
            let dataChunk = []
            stream.on('data', async chunk => {
                i++;
                console.log(`data-${i}`);
                const str = chunk.toString()
                const lines = str.split('\n');
                if (i === 1) {
                    dataChunk = lines
                    for (const line of dataChunk) {
                        j++
                        console.log('line', line);
                        const list = line.split(' ')
                        socket.emit('document', `${line}\n`)
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                } else {
                    chunkList.push(str)
                    if (dataChunk.length && dataChunk.length === j && chunkList.length) {
                        dataChunk = chunkList.shift().split('\n')
                        j = 0
                    }
                }


            })
            stream.on('end', async () => {
                console.log('i-end', i);
                console.log('dataChunk.length', dataChunk.length);
                console.log('chunkList', chunkList);
                setTimeout(async () => {
                    console.log('chunkList', chunkList);
                    for (const item of chunkList) {
                        const itemLines = item.split('\n')
                        for (const itemL of itemLines) {
                            socket.emit('document', `${line}\n`)
                            await new Promise(resolve => setTimeout(resolve, 200));
                        }

                    }
                }, dataChunk.length * 200)
            })
        }
    });

    socket.on('disconnect', () => {
        console.log('链接断开');
    });
});
server.listen(3004);

console.log('\x1b[32m%s\x1b[0m', 'Websocket server started on port 3004');