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
// startGridFireSpawning();

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

// setInterval(() => {
//    createBee();
// }, 10000); 

const blockImages = [
    '../photos/grassblock.webp',
    '../photos/coalore.webp',
    '../photos/cobblestone.webp',
    '../photos/diamondore.webp',
    '../photos/dirtblock.jpeg',
    '../photos/glowstone.webp',
    '../photos/goldore.webp',
    '../photos/gravel.webp',
    '../photos/ironore.webp',
    '../photos/obsidian.webp',
    '../photos/sandblock.webp',
    '../photos/stone.webp',
    '../photos/birchlog.webp',
    '../photos/birchplanks.webp',
    '../photos/bricks.webp',
    '../photos/chest.webp',
    '../photos/coalblock.webp',
    '../photos/craftingtable.webp',
    '../photos/diamondblock.webp',
    '../photos/emeraldblock.webp',
    '../photos/emeraldore.webp',
    '../photos/enderchest.webp',
    '../photos/furnace.webp',
    '../photos/glass.webp',
    '../photos/goldblock.webp',
    '../photos/haybale.webp',
    '../photos/ironblock.webp',
    '../photos/junglelog.webp',
    '../photos/lapisblock.webp',
    '../photos/lapisore.webp',
    '../photos/mossycobble.webp',
    '../photos/mossystonebrick.webp',
    '../photos/netherrite.webp',
    '../photos/oaklog.webp',
    '../photos/oakplanks.webp',
    '../photos/piston.webp',
    '../photos/pumpkin.webp',
    '../photos/quartzblock.webp',
    '../photos/redstoneblock.webp',
    '../photos/redstoneore.webp',
    '../photos/sandstone.webp',
    '../photos/soulsand.webp',
    '../photos/sprucelog.webp',
    '../photos/spruceplanks.webp',
    '../photos/stonebrick.webp',
    '../photos/wool.webp'
];

function fillBackgroundGrid() {
    const grid = document.querySelector('.background-grid');
    const blockSize = 60; 
    const rows = Math.ceil(window.innerHeight / blockSize);
    const columns = Math.ceil(window.innerWidth / blockSize);

    grid.style.gridTemplateRows = `repeat(${rows}, ${blockSize}px)`;
    grid.style.gridTemplateColumns = `repeat(${columns}, ${blockSize}px)`;

    for (let i = 0; i < rows * columns; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        
        const randomImage = blockImages[Math.floor(Math.random() * blockImages.length)];
        block.style.backgroundImage = `url(${randomImage})`;

        block.style.animationDelay = `${Math.random() * 4}s`;

        block.addEventListener('click', () => {
            block.style.animation = 'breakBlock 1s ease forwards';  
            setTimeout(() => {
                block.style.animation = '';  
                block.style.backgroundImage = `url('${blockImages[getRandomInt(0, blockImages.length - 1)]}')`;  
            }, 1000);  
        });

        grid.appendChild(block);
    }
}

window.onload = fillBackgroundGrid;

const lever = document.querySelector('.lever');
const netherportal = document.querySelector('.netherportal');
const video = document.querySelector('.video');
const painting = document.querySelector('.painting');
const signPortal = document.querySelector('.signPortal');
const signLever = document.querySelector('.signLever');
const signBG = document.querySelector('.signBG');

let leverOn = false;  

lever.addEventListener('click', () => {
    leverOn = !leverOn;

    if (leverOn) {
        lever.style.backgroundImage = "url('../photos/leverOn.png')";

        netherportal.style.animation = "none";
        signPortal.style.animation = "none";
        signBG.style.animation = "none";
        signLever.style.animation = "none";
        setTimeout(() => {
            netherportal.style.animation = "slideInFromTop 2s ease-out reverse";
        signPortal.style.animation = "slideInFromTop 2s ease-out reverse";
        signBG.style.animation = "slideInFromTop 2s ease-out reverse";
        signLever.style.animation = "slideInFromTop 2s ease-out reverse";
        }, 100); 
        
        setTimeout(() => {
            netherportal.style.display = 'none';
            signPortal.style.display = 'none';
            signBG.style.display = 'none';
            signLever.style.display = 'none';
            video.style.animation = 'slideOutFromTop 5s ease-out forwards';
            painting.style.animation = 'slideOutFromTop 5s ease-out forwards';
            painting.style.display = 'block'
            video.style.display = 'block';
        }, 2100); 
        video.style.pointerEvents = "auto";  
    } else {
        lever.style.backgroundImage = "url('../photos/leverOff.png')";

    painting.style.animation = "slideInFromTop 3s ease-in reverse";
    video.style.animation = "slideInFromTop 3s ease-in reverse";
    netherportal.style.animation = "slideInFromTop 2s ease-out forwards";
    signPortal.style.animation = "slideInFromTop 2s ease-out forwards";
    signBG.style.animation = "slideInFromTop 2s ease-out forwards";
    signLever.style.animation = "slideInFromTop 2s ease-out forwards";
    setTimeout(() => {
        video.style.display = 'none';
        painting.style.display = 'none'
        netherportal.style.display = 'block';
        signPortal.style.display = 'block';
        signBG.style.display = 'block';
        signLever.style.display = 'block';
        console.log('hi')
    }, 2000); 
    }
});

