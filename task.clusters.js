//-------------------------------------------------------------
//Вспомогательные функции
//-------------------------------------------------------------
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

//-------------------------------------------------------------
//Функция генератора поля
//-------------------------------------------------------------
let createField = (rows, cols, minNum=0, maxNum=3) => {
  let field = [];
  for (let i=0;i<rows;i++){
    field[i] = [];
    for (let j=0;j<cols;j++){
      field[i][j] = getRandom(minNum,maxNum);
    }
  }
  return field;
}

//-------------------------------------------------------------
//Функция поиска кластера в заданной точке
//-------------------------------------------------------------
let assembleCluster = (field, i, j, cluster) => {
  let oldLength = cluster.length;

  if (j+1 < field[i].length && field[i][j+1] != -1 && !inArray(cluster, [i,j+1]) && field[i][j] == field[i][j+1]){
    cluster.push([i,j+1])
  };
  if (j-1 >= 0 && field[i][j-1] != -1 && !inArray(cluster, [i,j-1]) && field[i][j] == field[i][j-1]){
    cluster.push([i,j-1])
  };
  if (i+1 < field.length && field[i+1][j] != -1 && !inArray(cluster, [i+1,j]) &&  field[i][j] == field[i+1][j]){
    cluster.push([i+1,j])
  };
  if (i-1 >= 0 && field[i-1][j] != -1 && !inArray(cluster, [i-1,j]) && field[i][j] == field[i-1][j]){
    cluster.push([i-1,j])
  };

  if (cluster.length > oldLength){
    cluster.forEach(function(cur){
      cluster.concat(assembleCluster(field,cur[0], cur[1], cluster));
    });
  }

  return cluster;
}

//-------------------------------------------------------------
// Функция 'Удаления' кластера
//-------------------------------------------------------------
let deleteCluster = (field, cluster) => {
  field = copyArray(field);
  cluster.forEach((point)=>field[point[0]][point[1]]=-1);
  return field;
}

//-------------------------------------------------------------
//Функция dropNums осыпает значения на ячейки со значением -1
//-------------------------------------------------------------
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

//-------------------------------------------------------------
//Функция заполнения ячеек новыми значениями
//-------------------------------------------------------------
let fillEmpty = (field) => {
  for (i=0;i<field.length;i++){
    for (j=0;j<field[0].length;j++){
      if (field[i][j] == -1) field[i][j] = getRandom(0,3);
    }
  }
  return field;
}

//-------------------------------------------------------------
//Функция перебора поля и возврата первого найденного кластера
//-------------------------------------------------------------
let findCluster = (field, minClusterSize) => {
  field = copyArray(field);
  let cluster = [];
  if (minClusterSize < 2) return;
  for (let i=0;i<field.length;i++){
    for (let j=0;j<field[i].length;j++){
      cluster = assembleCluster(field,i,j, [[i,j]]);
      if (cluster.length >= minClusterSize) {
        return cluster;
      } else cluster = [];
    }
  }
  return cluster;
}

//-------------------------------------------------------------
//Функция перебора поля и возврата всех найденных кластеров
//-------------------------------------------------------------
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

//-------------------------------------------------------------
//Функция перебора поля и возврата всех найденных кластеров
//с удалением каждого найденного кластера и заполнением пустого
//места
//-------------------------------------------------------------
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