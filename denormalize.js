import util from 'util';
import fs from 'fs';
let component = JSON.parse(fs.readFileSync('denormailzedData.json', 'utf-8'))

const lists = component.lists;
const inputs = component.inputs;
const fields = component.metadata.componentStructure
const mapConfig = (fields) => {
  const result = {}
   fields.map(field => {
    if (field.type == "list") {
      result[field.name] = handleList(lists[field.id]);
    }
    if (field.type == "input") {
      result[field.name] = handleInput(inputs[field.id]);
    }
  })
  console.log(util.inspect(result, {showHidden: false, depth: null, colors: true}))
}
const handleList = (data) => {  
  let result = {
    id: data.id,
    name: data.name,
    hidden: data.hidden,
    limit: data.limit || null,
    parentId: data.parentId,
    type: "list",
    children: []
  }
  if (data.lists){
     data.lists.map(list => {
      result.children.push(handleList(lists[list]))
    })
  }
  if (data.inputs) {
       data.inputs.map(inputId => {
        result.children.push(handleInput(inputs[inputId]))
      })
  }
  return result
}

const handleInput = (data)=> {
  return data;
}

mapConfig(fields)