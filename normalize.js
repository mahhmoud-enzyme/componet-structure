import util from 'util';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
let data = JSON.parse(fs.readFileSync('denormalizedData.json', 'utf-8'))
const component = {
    lists: {},
    inputs: {},
    metadata: {
      componentStructure: []
    }, 
}

const changeComponent = (type, payload) => {
    component[type][payload.id] = payload 
}
const mapComponent = (data, component) => {
     Object.entries(data).map(([key, value]) => {
      if (value.type == "list") {
        const listId = handleList(value, null, component);
        component.metadata.componentStructure.push({
          id: listId,
          type: "list",
          name: value.name
        })
      }
      if (value.type == "input") {
        if (!value.id){
          value.id = uuidv4().substring(0, 8)
        }
        if (!value.parentId){
          value.parentId = null
        }
        changeComponent("inputs", value)
        component.metadata.componentStructure.push({
          id: value.id,
          type: "input",
          name: value.name
        })
      }
    })
    console.log(util.inspect(component, {showHidden: false, depth: null, colors: true}))
    return component
}
  const handleList = (data, parentId = null) => {
    const list = {}
    Object.keys(data).map(item => {
      if (item !== "children" ) {
        list[item] = data[item];
      }
    })
    if (!list.id){
      list.id = uuidv4().substring(0, 8)
    }
    if (!list.parentId){
      list.parentId = parentId
    }
    
    const lists = [];
    const inputs = []
    data.children.map((child) => {
        if (child.type === 'list') {
            lists.push(handleList(child, list.id))
        } 
        if (child.type === 'input') {
          if (!child.id){
            child.id = uuidv4().substring(0, 8)
          }
          if (!child.parentId){
            child.parentId = list.id
          }
          changeComponent("inputs", child)
          inputs.push(child.id)
        }
    })
    list.lists = lists;
    list.inputs = inputs;
    changeComponent("lists", list)
    return list.id
  }
  
  fs.writeFileSync("normalizedData.json", JSON.stringify(mapComponent(data,component), null, 2));