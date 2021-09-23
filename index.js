import util from 'util';
import fs from 'fs';
let component = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
import fields from "./componentConfig.js"
const {lists, inputs} = component
const mapConfig = (fields) => {
  const result = fields.map(field => {
    if (field.type == "list") {
      return handleList(lists[Object.values(lists).find(list => list.name == field.name && list.parentId == null).id]);
    }
    if (field.type == "input") {
    return handleInput(inputs[Object.values(inputs).find(input => input.name == field.name).id]);
    }
  })
  console.log(util.inspect(result, {showHidden: false, depth: null, colors: true}))
}
const handleList = (data) => {  
  let result = []
  if (data.lists){
     data.lists.map(list => {
      result.push(handleList(lists[list]))
    })
  }
  if (data["inputs"].length > 0) {
       data.inputs.map(inputId => {
        result.push(handleInput(inputs[inputId]))
      })
  }
  return result
}

const handleInput = (data)=> {
  return data;
}

mapConfig(fields)