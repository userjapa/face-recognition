import 'babel-polyfill'

import fs from 'fs'
import fr from 'face-recognition'
import path from 'path'

const dataPath = path.resolve(__dirname + '/../data/test')
let modelJSON = require('../model.json')

// const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']
const targetSize = 150
const numTrainingFaces = 10

const recognizer = fr.FaceRecognizer()

const detectFace = (path, name) => {
  const image = fr.loadImage(path)
  const detector = fr.FaceDetector()
  const faceImages = detector.detectFaces(image, targetSize)
  faceImages.forEach((img, index) => fr.saveImage(`data/test/${name}_${index}.png`, img))
}

const trainFaces = name => {
  const allFiles = fs.readdirSync(dataPath)
  const imagesByClass = [name].map(c =>
    allFiles
      .filter(f => f.includes(c))
      .map(f => path.join(dataPath, f))
      .map(fp => fr.loadImage(fp))
  )
  const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
  const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))
  trainDataByClass.forEach((faces, index) => {
    recognizer.addFaces(faces, name)
  })
  fs.writeFileSync('model.json', JSON.stringify(recognizer.serialize()))
}

trainFaces('test')

// detectFace(path.join(__dirname, '..', 'test-1.jpg'), 'test')

// const allFiles = fs.readdirSync(dataPath)
// const imagesByClass = classNames.map(c =>
//   allFiles
//     .filter(f => f.includes(c))
//     .map(f => path.join(dataPath, f))
//     .map(fp => fr.loadImage(fp))
// )
//
// const numTrainingFaces = 10
// const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
// const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))
//
// const recognizer = fr.FaceRecognizer()
//
// trainDataByClass.forEach((faces, label) => {
//   const name = classNames[label]
//   recognizer.addFaces(faces, name)
// })
//
// fs.writeFileSync(path.join(__dirname, '..', 'model.json'), JSON.stringify(modelState))

// const errors = classNames.map(_ => [])
// testDataByClass.forEach((faces, label) => {
//   const name = classNames[label]
//   console.log()
//   console.log('testing %s', name)
//   faces.forEach((face, i) => {
//     const prediction = recognizer.predictBest(face)
//     console.log('%s (%s)', prediction.className, prediction.distance)
//     // count number of wrong classifications
//     if (prediction.className !== name) {
//       errors[label] = errors[label] + 1
//     }
//   })
// })
//
// // print the result
// const result = classNames.map((className, label) => {
//   const numTestFaces = testDataByClass[label].length
//   const numCorrect = numTestFaces - errors[label].length
//   const accuracy = parseInt((numCorrect / numTestFaces) * 10000) / 100
//   return `${className} ( ${accuracy}% ) : ${numCorrect} of ${numTestFaces} faces have been recognized correctly`
// })
// console.log('result:')
// console.log(result)
