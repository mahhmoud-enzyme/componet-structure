import util from 'util';
import fs from 'fs';
let component = JSON.parse(fs.readFileSync('normalizedData.json', 'utf-8'))

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
  return result;
}
const handleList = (data) => {  
  let result = {children: []};
  Object.keys(data).map(item => {
    if (item !== "lists" && item !== "inputs") {
      result[item] = data[item];
    }
  })

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


fs.writeFileSync("denormalizedData.json", JSON.stringify(mapConfig(fields), null, 2));