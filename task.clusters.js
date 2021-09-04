let getRandom = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

let copyArray = (array) => {
  return JSON.parse(JSON.stringify(array));
}

let compare = (arr1, arr2) => {
    return  arr1.every((ell, i)=>ell === arr2[i]);
}

let inArray = (initial, array) => {
  return initial.some((arrInit,inx)=>compare(arrInit,array));
}

let createField = (rows, cols) => {
  let field = [];
  for (let i=0;i<rows;i++){
    field[i] = [];
    for (let j=0;j<cols;j++){
      field[i][j] = getRandom(0,3);
    }
  }
  return field;
}

let adjacentNums = (field, i, j, curArr) => {
  let oldLength = curArr.length;
  let buf = [];
  if (j+1 < field[i].length && field[i][j+1] != -1 && !inArray(curArr, [i,j+1]) && field[i][j] == field[i][j+1]){
    curArr.push([i,j+1])
  };
  if (j-1 >= 0 && field[i][j-1] != -1 && !inArray(curArr, [i,j-1]) && field[i][j] == field[i][j-1]){
    curArr.push([i,j-1])
  };
  if (i+1 < field.length && field[i+1][j] != -1 && !inArray(curArr, [i+1,j]) &&  field[i][j] == field[i+1][j]){
    curArr.push([i+1,j])
  };
  if (i-1 >= 0 && field[i-1][j] != -1 && !inArray(curArr, [i-1,j]) && field[i][j] == field[i-1][j]){
    curArr.push([i-1,j])
  };

  if (curArr.length > oldLength){
    curArr.forEach(function(cur){
      buf.concat(adjacentNums(field,cur[0], cur[1], curArr));
    });
  }

  if (curArr.length > oldLength){
    return curArr;
  } else return [];
}

let deleteCluster = (field, cluster) => {
  field = copyArray(field);
  cluster.forEach((point)=>field[point[0]][point[1]]=-1);
  return field;
}

let dropNums = (field, cluster) => {
  field = copyArray(field);
  for (i=0;i<field.length;i++){
    for (j=0;j<field[0].length;j++){
      if (field[i][j]==-1){
        for (k=i;k>0;k--){
          if (k-1 >=0 && field[k-1][j] != -1){
            field[k][j] = field[k-1][j];
            field[k-1][j] = -1;
          }
        }
      }
    }
  }
  return field;
}

let fillEmpty = (field) => {
  for (i=0;i<field.length;i++){
    for (j=0;j<field[0].length;j++){
      if (field[i][j] == -1) field[i][j] = getRandom(0,3);
    }
  }
  return field;
}

let findCluster = (field, minClusterSize) => {
  field = copyArray(field);
  let cluster = [];
  if (minClusterSize < 2) return;
  for (let i=0;i<field.length;i++){
    for (let j=0;j<field[i].length;j++){
      cluster = adjacentNums(field,i,j, [[i,j]]);
      if (cluster.length >= minClusterSize) {
        return cluster;
      } else cluster = [];
    }
  }
  return cluster;
}

let findClusters = (field, minClusterSize) => {
  field = copyArray(field);
  let clusters = [];
  let cluster = findCluster(field, minClusterSize);

  while (cluster.length > 0){
    clusters.push(cluster);
    field = deleteCluster(field, cluster);
    cluster = findCluster(field, minClusterSize);
  }

  return clusters;
}

let findClustersLoop = (field, minClusterSize) => {
  field = copyArray(field);
  let clusters = [];
  let cluster = findCluster(field, minClusterSize);

  while (cluster.length > 0){
    clusters.push(cluster);
    field = deleteCluster(field, cluster);
    field = dropNums(field, cluster);
    field = fillEmpty(field);
    cluster = findCluster(field, minClusterSize);
  }

  return clusters;
}