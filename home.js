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
    star.src = 'star.gif'; 
    star.style.position = 'absolute';
    star.style.width = '30px'; 
    star.style.height = '30px'; 
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

        const size = Math.random() * (200 ^ (Math.random() * 10)) + 150; 
        seagull.style.width = `${size}px`;
        seagull.style.height = `${size * 0.50}px`;

        seagull.style.left = `0px`;
        seagull.style.top = `${y}px`;

        seagullContainer.appendChild(seagull);

        seagullsCreated++;

        setTimeout(() => {
            seagull.remove();
            seagullsCreated--;
        }, 10000); 
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
            store.style.backgroundImage = 'url("pixelartstore.png")';
            
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

        const size = Math.random() * (200 ^ (Math.random() * 10)) + 150; 
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.50}px`; 

        cloud.style.top = `${Math.random() * 150}px`; 
        cloud.style.left = `${Math.random() * -300}px`; 

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

            if (distance < 200 && !cloud.classList.contains('blown')) {
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
    coconut.src = 'coconut.png';
    coconut.style.position = 'absolute';
    coconut.style.width = `${Math.random() * 100 + 30}px`;
    coconut.style.height = coconut.style.height;
    coconut.style.display = 'block';
    coconut.style.zIndex = '3';
    const treeRect = palmtree.getBoundingClientRect();
    coconut.style.left = `${treeRect.left + treeRect.width / 2}px`;
    coconut.style.top = `${treeRect.top + 100}px`;
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


const carImages = ['car1.gif', 'car3.gif']; 
const carSize = 200; 
let carsStopSpawning = false;
function spawnCar() {
    
    if (carsStopSpawning == true) return;

    const car = document.createElement('div');
    car.classList.add('car');

    const randomCarImage = carImages[getRandomInt(0, carImages.length - 1)];
    car.style.backgroundImage = `url('${randomCarImage}')`;
    const randomSpeed = getRandomInt(5, 10); 
    car.style.animationDuration = `${randomSpeed}s`;

    const carYPosition = window.innerHeight - carSize - 50; 
    car.style.left = `${window.innerWidth}px`;
    car.style.top = `${carYPosition}px`;

    if(randomCarImage == 'car3.gif') {
        car.style.animation = 'drive 10s reverse linear';
        const randomSpeed = getRandomInt(5, 10); // Between 5 and 10 seconds
        car.style.animationDuration = `${randomSpeed}s`;
        car.style.right = `${window.innerWidth - 100}px`
        car.style.top = `${carYPosition + 150}px`;
        car.style.width = '170px'
    }

    document.body.appendChild(car);


    setTimeout(() => {
        car.remove();
    }, randomSpeed * 1000); 
}

function startCarSpawning() {
    setInterval(() => {
        spawnCar();
    }, getRandomInt(1000, 2500)); 
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

startCarSpawning();
