const express = require('express')
const app = express()
const cors = require('cors');

const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors())

const foldersActions = require('./foldersWords/foldersWordsActions')
app.get('/folders', foldersActions.getAllFolders)
app.post('/folders', foldersActions.createNewFolder)
app.post('/folders-copy', foldersActions.copyFolderById)
app.delete('/folders', foldersActions.deleteFolderById)
app.put('/folders', foldersActions.renameFolderById)

// app.get('/words', wordsActions.getAllWords)
// app.post('/words', wordsActions.addWord)
// app.delete('/words', wordsActions.deleteWord)

const wordsActions = require('./words/wordsActions')
app.get('/words', wordsActions.getWordsByFolderId)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
