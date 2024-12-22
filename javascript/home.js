const cloudsounds = ['cloudsfx1', 'cloudsfx2'];

function playSound(effect) {
    let selectedSoundId;

    if (effect === 'cloud') {
        const randomIndex = Math.floor(Math.random() * 2);
        selectedSoundId = cloudsounds[randomIndex];
    }
    if (selectedSoundId) {
        const sound = document.getElementById(selectedSoundId);
        sound.play();
    } else {
    }
}

function createStar() {
    const star = document.createElement('img');
    star.src = '../photos/star.gif'; 
    star.style.position = 'absolute';
    star.style.width = '15%'; 
    star.style.height = '15%'; 
    star.style.opacity = Math.random(); 
    star.style.left = `${Math.random() * 100}vw`; 
    star.style.top = `${Math.random() * 100}vh`; 
    star.style.zIndex = `2`;
    document.body.appendChild(star);
    
    setTimeout(() => {
        star.remove();
    }, 2000); 
}

document.addEventListener("DOMContentLoaded", () => {
    const starContainer = document.querySelector('.stars-container');
    let starsCreated = 0; 
    let stopStarCreation = false; 

    function createStar() {
        if (stopStarCreation) return; 

        const star = document.createElement('div');
        star.className = 'star';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        starContainer.appendChild(star);
        starsCreated++;

        setTimeout(() => {
            star.style.animation = 'fadeOut 5s forwards';
            setTimeout(() => {
                star.remove(); 
                starsCreated--;
            }, 3000); 
        }, Math.random() * 10000); 
    }

    const starCreationInterval = setInterval(() => {
        createStar();
    }, 45);

    const seagullContainer = document.querySelector('.seagulls-container');
    let seagullsCreated = 0;
    let startSeagullCreation = false; 

    function createSeagull() {
        if (startSeagullCreation == false) return;

        const seagull = document.createElement('div');
        seagull.className = 'seagull';

        const y = Math.random() * window.innerHeight;

        const size = Math.random() * 30 + 10; 
        seagull.style.width = `${size}%`;
        seagull.style.height = `${size * 0.50}%`;

        seagull.style.left = `0px`;
        seagull.style.top = `${y}px`;
        const duration = Math.random() * 14 + 6; 
        seagull.style.animationDuration = `${duration}s`;
        seagullContainer.appendChild(seagull);

        seagullsCreated++;

        setTimeout(() => {
            seagull.remove();
            seagullsCreated--;
        }, duration * 1000); 
    }

    setInterval(() => {
        createSeagull();
    }, 2500); 

    const seagulls = document.querySelectorAll('.seagull');

    seagulls.forEach(seagull => {
        const randomDirection = Math.random() > 0.5 ? 500 : -500;
        seagull.style.setProperty('--flyY', `${randomDirection}px`);
    });

    const numberOfClouds = 30; 
    const cloudContainer = document.querySelector('.clouds-container'); 
    const clouds = [];
    let clickedClouds = 0; 

    function showSun() {
        stopStarCreation = true; 
        startSeagullCreation = true
        clearInterval(starCreationInterval);

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.animation = 'fadeOut 5s forwards'; 
            setTimeout(() => star.remove(), 5000); 
        });
            const store = document.querySelector('.store');
            store.style.backgroundImage = 'url("../photos/pixelartstore.png")';
            
            const sun = document.getElementById('sun');
            sun.style.display = 'block'; 

            const palmtree = document.getElementById('palmtree');
            palmtree.style.display = 'block'; 

            const palmtree2 = document.getElementById('palmtree2');
            palmtree2.style.display = 'block'; 

            const waves = document.getElementById('waves');
            waves.style.display = 'block'; 

            
            const road = document.querySelector('.road');
            road.style.animation = 'slideInFromTop 1.5s ease-out reverse'
                setTimeout(() => {
                    road.style.display = 'none'; 
                }, 1500)

            const city = document.querySelector('.city');
            city.style.animation = 'slideInFromTop 2.5s ease-out reverse'
                setTimeout(() => {
                    city.style.display = 'none'; 
                }, 2500)
            
            carsStopSpawning = true;
            const cars = document.querySelectorAll('.car');
            cars.forEach(car => {
                car.remove()
            });

            document.body.style.transition = 'background-color 2s ease'; 
            document.body.style.backgroundColor = '#b3e0ff'; 
    }

    for (let i = 0; i < numberOfClouds; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';

        const size = Math.random() * (27 ^ (Math.random())) + 5; 
        cloud.style.width = `${size}%`;
        cloud.style.height = `${size * 0.80}%`; 

        cloud.style.top = `${Math.random() * 15}%`; 
        cloud.style.left = `${Math.random() - 10}%`; 

        const duration = Math.random() * 17 + 20; 
        cloud.style.animationDuration = `${duration}s`;

        clouds.push(cloud);
        cloudContainer.appendChild(cloud);
    }

    document.addEventListener('click', (event) => {
        const { clientX: clickX, clientY: clickY } = event;

        clouds.forEach(cloud => {
            const rect = cloud.getBoundingClientRect();
            const cloudX = rect.left + window.scrollX;
            const cloudY = rect.top + window.scrollY;

            const distanceX = cloudX + rect.width / 2 - clickX;
            const distanceY = cloudY + rect.height / 2 - clickY;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

            if (distance < 100 && !cloud.classList.contains('blown')) {
                cloud.style.position = 'absolute';
                cloud.style.left = `${clickX - cloud.offsetWidth / 2}px`;
                cloud.style.top = `${clickY - cloud.offsetHeight / 2}px`;
                cloud.style.animation = 'none';
                cloud.style.transform = `translate(0, 0)`;
                cloud.style.setProperty('--offset-x', `${distanceX * 1.5}px`);
                cloud.style.setProperty('--offset-y', `${distanceY * 1.5}px`);

                playSound('cloud');
                cloud.classList.add('blown');
                cloud.style.animation = 'blowAway 3s ease forwards';

                setTimeout(() => {
                    cloud.remove();
                    clickedClouds++; 
                    if (clickedClouds === numberOfClouds) {
                        showSun(); 
                    }
                }, 1500); 
            }
        });
    });
});

function createCoconut(palmtree) {
    const coconut = document.createElement('img');
    coconut.src = '../photos/coconut.png';
    coconut.style.position = 'absolute';
    coconut.style.width = `${Math.random() * 15}%`;
    coconut.style.height = coconut.style.height;
    coconut.style.display = 'block';
    coconut.style.zIndex = '4';
    const treeRect = palmtree.getBoundingClientRect();
    coconut.style.left = `${treeRect.left + treeRect.width / 2}px`;
    coconut.style.top = `${treeRect.top + 50}px`;
    document.body.appendChild(coconut);
    coconut.style.transition = 'top 1.3s ease-in';
    setTimeout(() => {
        coconut.style.top = `${window.innerHeight}px`;
    }, 10);
    setTimeout(() => {
        coconut.remove();
    }, 1300);
}

const palmTrees = document.querySelectorAll('#palmtree, #palmtree2');
palmTrees.forEach(palmtree => {
    palmtree.addEventListener('click', function() {
        this.style.animation = 'bounce 0.5s alternate infinite ease-in-out';
        setTimeout(() => {
            this.style.animation = 'none';
                createCoconut(this);

        }, 1000);
    });
});


const carSize = 200; 
let carsStopSpawning = false;
const carImages = ['../photos/car1.gif', '../photos/car3.gif'];
const road = document.querySelector('.road');

function spawnCar() {
    if (carsStopSpawning) return;


    const roadRect = road.getBoundingClientRect();
    const laneHeight = roadRect.height / 2; // Two lanes

    const car = document.createElement('div');
    car.classList.add('car');

    const randomCarImage = carImages[Math.floor(Math.random() * carImages.length)];
    car.style.backgroundImage = `url('${randomCarImage}')`;

    const isReversed = randomCarImage.includes('car3');

    // Adjust car size and positioning relative to the road
    const carHeight = roadRect.height * 0.4; // Adjusted size
    const carWidth = carHeight * 2; // Maintain aspect ratio

    Object.assign(car.style, {
        left: isReversed ? `${window.innerWidth}px` : `${window.innerWidth}px`, // Start offscreen
        top: `${roadRect.top + (isReversed ? laneHeight + 15 : -30)}px`, // Slight downward adjustment
        width: isReversed ? `${carWidth}px` : `${carWidth * 2.3}px`,
        height: isReversed ? `${carHeight}px` : `${carHeight * 2.3}px`,
        animation: isReversed ? 'drive 12s reverse linear' : 'drive 12s linear'
    });

    document.body.appendChild(car);
    setTimeout(() => car.remove(), 12000); // Match animation duration
}


function startCarSpawning() {
    setInterval(() => {
        spawnCar();
    }, getRandomInt(2000, 4000)); 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

startCarSpawning();

