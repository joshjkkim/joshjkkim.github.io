const fireImages = ['/photos/fire.gif']; 
const blockSize = Math.floor(Math.random() * 80) + 50; 

function spawnFireInGrid() {
    const columns = Math.floor(window.innerWidth / blockSize); 

    const randomColumn = getRandomInt(0, columns - 1);
    const fireBlock = document.createElement('div');
    fireBlock.classList.add('fire-block');

    const randomX = randomColumn * blockSize;
    const randomY = window.innerHeight - blockSize; // Adjusting the Y position for the bottom

    const randomImage = fireImages[getRandomInt(0, fireImages.length - 1)];

    fireBlock.style.backgroundImage = `url('${randomImage}')`;
    fireBlock.style.position = 'fixed'; // Position it fixed at the bottom
    fireBlock.style.width = `${blockSize}px`;
    fireBlock.style.height = `${blockSize}px`;
    fireBlock.style.left = `${randomX}px`;
    fireBlock.style.bottom = '0px'; // Keep fire blocks at the bottom of the screen
    fireBlock.style.zIndex = '5'; 

    document.body.appendChild(fireBlock);

    setTimeout(() => {
        fireBlock.remove();
    }, getRandomInt(2000, 7000)); 
}

function startGridFireSpawning() {
    setInterval(() => {
        spawnFireInGrid();
    }, getRandomInt(300, 1000)); 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

startGridFireSpawning();
