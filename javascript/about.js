const fireImages = ['../photos/fire.gif']; 
const blockSize = 100; 

function spawnFireInGrid() {
    const columns = Math.floor(window.innerWidth / blockSize); 

    const randomColumn = getRandomInt(0, columns - 1);
    const fireBlock = document.createElement('div');
    fireBlock.classList.add('fire-block');

    const randomX = randomColumn * blockSize;
    const randomY = window.innerHeight - blockSize; 

    const randomImage = fireImages[getRandomInt(0, fireImages.length - 1)];

    fireBlock.style.backgroundImage = `url('${randomImage}')`;
    fireBlock.style.position = 'absolute';
    fireBlock.style.width = `${blockSize}px`;
    fireBlock.style.height = `${blockSize}px`;
    fireBlock.style.left = `${randomX}px`;
    fireBlock.style.top = `${randomY}px`;
    fireBlock.style.zIndex = '5'; 

    document.body.appendChild(fireBlock);
    setTimeout(() => {
        fireBlock.remove();
    }, getRandomInt(2000, 7000)); 
}

function startGridFireSpawning() {
    setInterval(() => {
        spawnFireInGrid();
    }, getRandomInt(250, 750)); 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
startGridFireSpawning();

const beeContainer = document.querySelector('.bees-container');
let beesCreated = 0;

function createBee() {

    const bee = document.createElement('div');
    bee.className = 'bee';

    const y = Math.random() * window.innerHeight;

    const size = Math.random() * (200 ^ (Math.random() * 10)) + 200; 
    const speed = Math.random() * 10 + 3;
    bee.style.animationDuration = `${speed}s`;
    bee.style.width = `${size}px`;
    bee.style.height = `${size * 0.50}px`;

    bee.style.left = `100%`;
    bee.style.top = `${y + 150}px`;

    beeContainer.appendChild(bee);

    beesCreated++;

    setTimeout(() => {
        bee.remove();
        beesCreated--;
    }, speed * 1000); 
}

setInterval(() => {
    createBee();
}, 2500); 