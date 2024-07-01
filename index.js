


let bombPlaced = false

function createBoxesForm(type, count){
  const container = document.createElement('div');
  container.setAttribute("id", "container");

  const inside = document.createElement('div');
  inside.classList.add(type)
  // inside.innerText = count

  if (type === "wall"){
    for (let index = 0; index < 3; index++) {
      const block = document.createElement('div');
      if (index === 1) block.classList.add('singleBlock')
      else {
        block.classList.add('doubleBlock')
        const innerBlock1 = document.createElement('div');
        const innerBlock2 = document.createElement('div');
        innerBlock1.classList.add('block')
        innerBlock2.classList.add('block')
        block.appendChild(innerBlock1)
        block.appendChild(innerBlock2)
      }

      inside.appendChild(block)
    }
  }
  container.appendChild(inside)
  const game = document.getElementById('game')
  game.appendChild(container)
  document.body.appendChild(game);
}

function createCanvas({ boardWidth, boardHeigth }){
  let count = 0
  for(var y = 0; y < boardHeigth; y ++){
    for(var x = 0; x < boardWidth; x ++){
      count++
      const borders = y === 0 || x === 0 || x === boardWidth -1 || y === boardHeigth -1
      const evenBlocks = x % 2 === 0 && y % 2 === 0

      if (borders || !borders && evenBlocks) createBoxesForm('concret', count)
      else {
        const oneOrZero = Math.floor(Math.random() * 2)
        const firstBlocks = x === 1 && y === 1 || x === 1 && y === 2 || x === 2 && y === 1
        if(oneOrZero || firstBlocks) createBoxesForm('grass', count)
        else createBoxesForm('wall', count)
        
      }
    }
  }
}

function createCharacter(){
  const bomberman = document.createElement('div');
  bomberman.setAttribute("id", "bomberman");
  bomberman.style.position = 'absolute'
  bomberman.style.left = "60px"
  bomberman.style.top = "60px"

  const game = document.getElementById('game')
  game.appendChild(bomberman)
}

function createEnemy(){
  const availableBlocks = document.getElementsByClassName('grass')

  for (availableBlock of availableBlocks) {
    const { top, left } = availableBlock.getBoundingClientRect()
    const fireMonster = document.createElement('div');
    fireMonster.classList.add("fireMonster");
    fireMonster.style.position = 'absolute'
    fireMonster.style.left = `${left}px`
    fireMonster.style.top = `${top}px`
    const game = document.getElementById('game')
    game.appendChild(fireMonster)

    setInterval(() => {
      const { top } = fireMonster.getBoundingClientRect()
      // fireMonster.style.top = `${top + 1}px`
    }, 100);
  }

}
function move(event){
  const bomberman = document.getElementById('bomberman')
  const rect = bomberman.getBoundingClientRect()
  const previousValues = rect

  switch (event.code) {
    case "Space":
      // Handle "back"
      dropBomb()
      break;
    case "KeyS":
    case "ArrowDown":
      // Handle "back"
      bomberman.setAttribute('style', `position: absolute; left: ${rect.left}px; top: ${rect.top + 5}px;`)
      break;
    case "KeyW":
    case "ArrowUp":
      // Handle "forward"
      bomberman.setAttribute('style', `position: absolute; left: ${rect.left}px; top: ${rect.top - 5}px;`)
      break;
    case "KeyA":
    case "ArrowLeft":
      // Handle "turn left"
      bomberman.setAttribute('style', `position: absolute; left: ${rect.left - 5}px; top: ${rect.top}px;`)
      break;
    case "KeyD":
    case "ArrowRight":
      // Handle "turn right"
      bomberman.setAttribute('style', `position: absolute; left: ${rect.left + 5}px; top: ${rect.top}px;`)
      break;
    default:
      break;
  }

  if(checkColision()) {
    setBombermanPreviousValues(bomberman, previousValues)
  }


}

function setBombermanPreviousValues(bomberman, previousValues) {
  bomberman.classList.add('shake')
  bomberman.setAttribute('style', `position: absolute; left: ${previousValues.left}px; top: ${previousValues.top}px; `)
  setTimeout(() => {
    bomberman.classList.remove('shake')
  }, 30);
}
function dropBomb(){
  const bomberman = document.getElementById('bomberman')
  const rect = bomberman.getBoundingClientRect()
  const bombs = document.getElementsByClassName('bomb')[0];
  
  // if (bombs) return
  const bomb = document.createElement('div');
  bomb.classList.add('bomb')
  bomb.style.position = 'absolute'
  bomb.setAttribute('style', `position: absolute; left: ${rect.left}px; top: ${rect.top}px;`)

  const game = document.getElementById('game')
  game.appendChild(bomb)
  bombPlaced = true
}

function createExplosion(bomb){

  const bombPositon = bomb.getBoundingClientRect()

  const explosionContainer = document.createElement('div');
  explosionContainer.setAttribute("id", `explosionContainer`);
  explosionContainer.style.position = 'absolute'
  explosionContainer.style.top = `${bombPositon.top}px`
  explosionContainer.style.left = `${bombPositon.left}px`

  // const explosionContainer2 = document.createElement('div');
  // explosionContainer2.setAttribute("id", `explosionContainer`);
  // explosionContainer2.style.position = 'absolute'
  // explosionContainer2.style.top = `${bombPositon.top}px`
  // explosionContainer2.style.left = `${bombPositon.left - 45}px`

  const explosionBlock = document.createElement('div');
  explosionBlock.classList.add('explosionBlock');
  explosionContainer.appendChild(explosionBlock)
  // explosionContainer2.appendChild(explosionBlock)

  const game = document.getElementById('game')
  game.appendChild(explosionContainer)
  // game.appendChild(explosionContainer2)

  setTimeout(() => {
    removeExplosion()
  }, 1000);

}

function removeExplosion(){
  const explosion = document.getElementById('explosionContainer')
  explosion.remove()
}

function checkColision(){
  let colidiu = false
  const concret = document.getElementsByClassName('concret') 
  const wall = document.getElementsByClassName('wall')
  const obstacles = [concret, wall]
  const bomberman = document.getElementById('bomberman')

  let { 
    top: bombTop, 
    left: bombLeft, 
    right: bombRight, 
    bottom: bombBottom, 
  } = bomberman.getBoundingClientRect()

  for (obs of obstacles){
    for (let obstacle of obs){
      let { 
        top: obsTop, 
        left: obsLeft, 
        right: obsRight, 
        bottom: obsBottom, 
      } = obstacle.getBoundingClientRect()
  
      colision = obsLeft < bombRight &&
        obsRight > bombLeft &&
        obsTop < bombBottom &&
        obsBottom > bombTop
  
      if (colision) return true
    }
  }

  return colidiu
  
}

function checkExistentBombs(){
  const bombs = document.getElementsByClassName('bomb');
  if (bombs.length && bombPlaced){

    setTimeout(() => {
      setTimeout(() => {
        createExplosion(bombs[0])
        destroyObjects(bombs[0])
        bombs[0].remove()
      }, 500)
    }, 3000)

    setTimeout(() => {
      bombs[0].classList.remove('timeBomb1')
      bombs[0].classList.add('timeBomb2')
    }, 1000)

    setTimeout(() => {
      bombs[0].classList.remove('timeBomb2')
      bombs[0].classList.add('timeBomb3')
    }, 2500)

    bombPlaced = false
  }
}

function destroyObjects(bomb){
  const walls = document.getElementsByClassName('wall')
  const bomberMan = document.getElementById('bomberman')


  const nearByWalls = Array.from(walls).filter((wall) => {
    return wasInExplosionArea(wall, bomb)
  })

  for (wall of nearByWalls){
    const parentDiv = wall.parentNode
    const explosionBlock = document.createElement('div');
    explosionBlock.classList.add('explosionBlock')
    const grassElement = document.createElement('div');
    grassElement.classList.add('grass')

    wall.remove()

    parentDiv.appendChild(explosionBlock)
    setTimeout(() => {
      parentDiv.appendChild(grassElement)
    }, 1000);

  }
}

function wasInExplosionArea(object, bomb){
  const { 
    top: bombTop, 
    left: bombLeft, 
    right: bombRight, 
    bottom: bombBottom,
    height: bombHeight,
    width: bombWidth
  } = bomb.getBoundingClientRect()

  const { top, left, right, bottom } = object.getBoundingClientRect()

  const horizontalZone = left * 1.1 >= bombLeft && right * 0.9 <= bombRight
  const verticalZone = top * 1.1 >= bombTop && bottom * 0.9 <= bombBottom
  const atTop = bottom > bombTop - bombHeight && bottom < bombTop && horizontalZone
  const atBoottom = top < bombBottom + bombHeight && top > bombBottom && horizontalZone
  const atLeft = right > bombLeft - bombWidth && right < bombLeft && verticalZone
  const atRigth = left < bombRight + bombWidth && left > bombRight && verticalZone


  return  atTop || atBoottom || atLeft || atRigth
}


(function initGame(){
  addEventListener("keydown", (event) => move(event));
  createCanvas({ boardWidth: 15, boardHeigth: 11 })
  createCharacter()
  createEnemy()
  setInterval(() => {
    checkExistentBombs()
  }, 100);
})()