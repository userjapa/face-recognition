import 'babel-polyfill'

import fs from 'fs'
import fr from 'face-recognition'
import path from 'path'

const dataPath = path.resolve(__dirname + '/data/faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const allFiles = fs.readdirSync(dataPath)
const imagesByClass = classNames.map(c =>
  allFiles
    .filter(f => f.includes(c))
    .map(f => path.join(dataPath, f))
    .map(fp => fr.loadImage(fp))
)

const numTrainingFaces = 10
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))
