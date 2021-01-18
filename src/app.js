const http = require('http')
const fs = require('fs')

const filePath = './src/db/data.json'


const getData = () => {
    try {
        return JSON.parse(fs.readFileSync(filePath))
    } catch (error) {
        return []
    }
}
const addData = (todo) => {
    const data = []
    if(getData().length===0) {
        const newTodo = {
            id: 1,
            description: todo.description
        }
        data.push(newTodo)
    } else {
        
        oldData = getData()
        for(let i = 0;i<oldData.length;i++){
            data.push(oldData[i])
        }
        const newTodo = {
            id: oldData[oldData.length-1].id+1,
            description: todo.description
        }
        data.push(newTodo)
    }
    fs.writeFileSync(filePath, JSON.stringify(data));
}

const deleteTodo = (id) => {
    const allData = getData()
    const newData = allData.filter( todo => {return id != todo.id })
    fs.writeFileSync(filePath, JSON.stringify(newData));
}
const app = ((req, res) => {
    if(req.url === '/getTodo'){
            res.writeHead(200, { 'Content-Type' : 'application/json' })
            res.write(JSON.stringify(getData()))
            res.end()
    } else if(req.url === '/addTodo') {
        let allData = ''
            req.on('data', packet => {
                allData += packet
            })
            req.on('end', () => {
                // console.log(JSON.parse(allData))
                addData(JSON.parse(allData))
            })
    } else if(req.url === '/deleteTodo') {
        let allData = ''
            req.on('data', packet => {
                allData += packet
            })
            req.on('end', () => {
                // console.log(JSON.parse(allData))
                deleteTodo(JSON.parse(allData))
            })
    } else {
        try {
            const file = fs.readFileSync('./client/index.html')
            res.writeHead(200, { 'Content-Type' : 'text/html' })
            res.write(file)
            res.end()
        } catch (error) {
            res.writeHead(404)
            res.write('page not found!')
            res.end()
        }
    }
    
})

const server = http.createServer(app)

server.listen(1212, () => {
    console.log('server on')
})