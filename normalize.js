import util from 'util';
import fs from 'fs';
let data = JSON.parse(fs.readFileSync('normalizedData.json', 'utf-8'))
const component = {
    lists: {},
    inputs: {}
}

const changeComponent = (type, payload) => {
    component[type][payload.id] = payload 
}
const mapComponent = (data, component) => {
     Object.entries(data).map(([key, value]) => {
      if (value.type == "list") {
        handleList(value,null, component);
      }
      if (value.type == "input") {
        changeComponent("inputs", value)
      }
    })
    console.log(util.inspect(component, {showHidden: false, depth: null, colors: true}))
  }
  const handleList = (data, parentId = null, result) => {
    let list = {
      id: data.id,
      name: data.name,
      parentId: parentId,
      type: data.type,
      hidden: data.hidden,
      limit: data.limit || null,
      lists: null, 
      inputs: null
    }
    const lists = [];
    const inputs = []
    data.children.map((child) => {
        if (child.type === 'list') {
            handleList(child, data.id, result);
            lists.push(child.id)
        } 
        if (child.type === 'input') {
            changeComponent("inputs", child)
            inputs.push(child.id)
        }
    })
    list.lists = lists;
    list.inputs = inputs;
    changeComponent("lists", list)
  }
  
  const handleInput = (data)=> {
    return data;
  }
  
  mapComponent(data,component)