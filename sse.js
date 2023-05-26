const http = require('http');
const fs = require('fs');
const path = require('path')

http.createServer((req, res) => {
if (req.method === 'GET' && req.url === '/sse') {
     res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  const filePath = path.join(__dirname, 'public/content.txt')
//   const stream = fs.createReadStream(filePath)
  const stream = fs.createReadStream(filePath, { highWaterMark: 1048 })
  let i = 0;
  let j = 0;
  let chunkList = []
  let dataChunk = []
  stream.on('data', async chunk => {
    i++;
    // console.log(`data-${i}`, chunk.toString());
    console.log(`data-${i}`);
    const str = chunk.toString()
    const lines = str.split('\n'); 
    if (i === 1) {
        dataChunk = lines
        for (const line of dataChunk) {
            j++
              console.log('line', line);
              const list = line.split(' ')
              res.write(`${line}\n`);
              await new Promise(resolve => setTimeout(resolve, 200));
          }
    } else {
        chunkList.push(str)
        if ( dataChunk.length && dataChunk.length === j && chunkList.length) {
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
                res.write(`${itemL}\n`);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
             
          }
          res.end()
    }, dataChunk.length * 200)
  })
 
}

 
}).listen(3003);

console.log('SSE server started on port 3003');