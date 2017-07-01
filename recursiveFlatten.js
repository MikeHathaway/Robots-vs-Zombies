function flattenRecursive(array){
  return array.reduce(reducer,[])
}

function reducer(acc,el){
  if(Array.isArray(el[0])) return reducer(acc,el[0])
  //if(el[0].length > 1 &&)
  return acc.concat(el)
}

function checkType(data){
  return data.map(val => Array.isArray(val[0]))
}

const testArray = [[1],[2],[3],[4],[[3]],[[[[[[4,[[11,[1]]]]]]]]]]

console.log(flattenRecursive(testArray))
