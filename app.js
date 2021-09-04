let config = {
  rowsCount:5,
  colsCount:5,
  minClusterSize:4
}

let startApp = function() {
  if (config.rowsCount < 2 || config.colsCount < 2 || config.minClusterSize < 2) return;
  const app = document.getElementById('app');
  app.innerHTML = '';

  let field = createField(config.rowsCount,config.colsCount);

  iterate(field,[]);
}

async function iterate(field,cluster){
  let emptyCells=[];
  cluster = findCluster(field, config.minClusterSize);

  if (cluster.length > 0){
    await message('Найден кластер, координаты: '+JSON.stringify(cluster));
    await printField(field, cluster, 0);
    await message('Удаление кластера');
    await printField(field, cluster, 1);
    await message('Верхние ячейки осыпаются');
    field = await deleteCluster(field, cluster);
    field = await dropNums(field, cluster);
    await printField(field, cluster,-1,emptyCells);
    await message('Заполнение пустых значений');
    field = await fillEmpty(field);
    await printField(field, emptyCells,2);

    await new Promise((resolve, reject) => setTimeout(resolve, 1));

    iterate(field, cluster);
  } else {
    message('кластеры не найдены');
    printField(field, cluster);
  }

}

let message = (msg) => {
  const app = document.getElementById('app');
  let divContainer = document.createElement('div');
  divContainer.classList.add("container");

  let text = document.createElement('div');
  let col = document.createElement('div');
  col.classList.add('col');
  text.classList.add('message');
  text.textContent = msg;
  col.append(text);
  divContainer.append(col);
  app.append(divContainer);
}

let printField = (field, cluster=[], mode=0, emptyCells) => {
  const app = document.getElementById('app');
  let divContainer = document.createElement('div');
  divContainer.classList.add("container");
  let cols = [];
  let rows = [];

  for (let i=0;i<field[0].length;i++) {
    cols[i] = document.createElement('div');
    cols[i].classList.add('col');
    for (let j=0;j<field.length;j++) {
      if (field[j][i]==-1) emptyCells.push([j,i]);
      let text = document.createElement('div');
      text.classList.add('text');
      text.textContent = field[j][i];

      rows[j] = document.createElement('div');
      rows[j].classList.add('row');
      rows[j].classList.add((field[j][i]==-1)?'hide':'defautl');

      rows[j].append(text);
      cols[i].append(rows[j]);
    }
    divContainer.append(cols[i]);
  }

  if (cluster.length > 0 && mode>=0){
    cluster.forEach(function(point){
      let cell = cols[point[1]].childNodes[point[0]];
      cell.classList.remove('defautl');
      cell.classList.add((mode==0)?'cluster':(mode==1)?'hide':'fill');
    });
  }
  app.append(divContainer);
}

document.addEventListener("DOMContentLoaded", function(event) {
  const updBtn = document.getElementById('updBtn');

  updBtn.addEventListener('click', function(){
    const app = document.getElementById('app');
    const rowsCount = document.getElementById('RowCount').value;
    const colsCount = document.getElementById('ColCount').value;
    const minClusterSize = document.getElementById('minClusterSize').value;

    if (rowsCount != ''){
      if (rowsCount < 2) {
        alert('Минимальное значение - 2')
      } else {
        config.rowsCount = rowsCount;
      }
    }

    if (colsCount != ''){
      if (colsCount < 2) {
        alert('Минимальное значение - 2')
      } else {
        config.colsCount = colsCount;
      }
    }

    if (minClusterSize != ''){
      if (minClusterSize < 2) {
        alert('Минимальное значение - 2')
      } else {
        config.minClusterSize = minClusterSize;
      }
    }

    startApp();
  });

  startApp();
});