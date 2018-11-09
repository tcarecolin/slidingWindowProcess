'use strict'

const fs = require('fs')
const readline = require('readline')
const stream = require('stream')

const INPUT_FILE = './data.txt'

const instream = fs.createReadStream(INPUT_FILE)
const outstream = new stream()
const rl = readline.createInterface(instream, outstream);

const records = []
const output = []

const getMinValue = (elements) => {
  return Math.min(...elements.map(elt => elt.value))
}

const getMaxValue = (elements) => {
  return Math.max(...elements.map(elt => elt.value))
}

const getSum = (elements) => {
  let sum = 0
  elements.map((elt) => sum+=elt.value)
  return sum.toFixed(5)
}

const prettyPrintResult = () => {
  console.log(`   Time      Value  N_O Roll_Sum Min_Value Max_Value
---------------------------------------------------`)
  output.forEach((line) => {
    console.log(`${line.Time}  ${line.Value}  ${line.N_O}  ${line.Roll_Sum}  ${line.Min_Value}  ${line.Max_Value}`)
  })
}

const processSlidingValues = (window) => {
  const newLine = {
    Time: window.slice(-1)[0].timestamp,
    Value: window.slice(-1)[0].value,
    N_O: window.length,
    Roll_Sum: getSum(window),
    Min_Value: getMinValue(window),
    Max_Value: getMaxValue(window)
  }
  output.push(newLine)
}

const getCurrentWindow = (currentIndex) => {
  return records.filter((elt) => {
    return elt.timestamp >= records[currentIndex].timestamp-60
  })
}

const processLine = (line) => {
  const record = {
    timestamp: parseInt(line.split('\t')[0]),
    value: parseFloat(line.split('\t')[1])
  }
  records.push(record)
  const newWindow = getCurrentWindow(records.indexOf(record))
  const newRecord = processSlidingValues(newWindow)
}
const closeStream = () => {
  prettyPrintResult()
}

rl.on('line', line => processLine(line));

rl.on('close', close => closeStream());

