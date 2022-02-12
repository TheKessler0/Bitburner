const https = require('https')
const fs = require('fs')
const path = require('path')
const { exit } = require("process")

// Type definitions
const urlDef = 'https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/ScriptEditor/NetscriptDefinitions.d.ts'
const pathDef = './NetscriptDefinitions.d.ts'
https.get(urlDef, (res) => {
    const file = fs.createWriteStream(pathDef)
    res.pipe(file)

    file.on('finish', () => {
        file.close
        console.log('Netscript type definitions updated')
    })
}).on("error", (err) => {
    console.log("Error: ", err.message)
})

// Constants
const urlConstants = 'https://raw.githubusercontent.com/danielyxie/bitburner/dev/src/Constants.ts'
const pathConstants = './src/lib/constants.ts'
https.get(urlConstants, (res) => {
    if (!fs.existsSync(pathConstants)) { fs.mkdirSync(path.dirname(pathConstants), { recursive: true }) }
    
    const file = fs.createWriteStream(pathConstants)
    res.pipe(file)

    file.on('finish', () => {
        file.close
        console.log('Bitburner constants updated')
    })
}).on("error", (err) => {
    console.log("Error: ", err.message)
})