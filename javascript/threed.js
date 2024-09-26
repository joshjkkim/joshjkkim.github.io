// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Day/Night background
let time = 0;

const updateBackgroundColor = () => {
  // Calculate the blue component based on time
  const b = Math.floor((Math.sin(time) + 1) * 128); // range from 0 to 255
  const r = 0; // Keep red at 0
  const g = 0; // Keep green at 0

  // Set the background color
  scene.background = new THREE.Color(`rgb(${r}, ${g}, ${b})`);

  // Increment time to update the blue component
  time += 0.005; // Adjust this value to control the speed of the color change
};


// Chunk-based terrain generation
let chunkSize = 250;
const chunks = {};

const createChunk = (x, z) => {
  const terrainGeometry = new THREE.PlaneBufferGeometry(chunkSize, chunkSize, 50, 50);
  const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x004F05, flatShading: true });
  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrain.rotation.x = -Math.PI / 2;
  terrain.position.set(x * chunkSize, 0, z * chunkSize);

  const positionAttribute = terrainGeometry.attributes.position;
  for (let i = 0; i < positionAttribute.count; i++) {
    const height = Math.random() * 3;
    positionAttribute.setZ(i, height);
  }
  positionAttribute.needsUpdate = true;

  scene.add(terrain);
  chunks[`${x},${z}`] = terrain;

  for (let i = 0; i < 1; i++) {
    createRandomSprite();
  }
};

const checkForNewChunks = () => {
  const chunkX = Math.floor(player.position.x / chunkSize);
  const chunkZ = Math.floor(player.position.z / chunkSize);

  for (let x = chunkX - 1; x <= chunkX + 1; x++) {
    for (let z = chunkZ - 1; z <= chunkZ + 1; z++) {
      if (!chunks[`${x},${z}`]) {
        createChunk(x, z);
      }
    }
  }

  for (let key in chunks) {
    const [cx, cz] = key.split(',').map(Number);
    if (Math.abs(cx - chunkX) > 2 || Math.abs(cz - chunkZ) > 2) {
      scene.remove(chunks[key]);
      delete chunks[key];
    }
  }
};

// Transparent Player
// Load the player PNG texture
const textureLoader = new THREE.TextureLoader();
const playerTexture = textureLoader.load('../photos/steveback.png'); // Update path as needed

// Create player sprite material
const playerMaterial = new THREE.SpriteMaterial({ map: playerTexture });

// Create the player sprite
const player = new THREE.Sprite(playerMaterial);

// Set the initial scale of the player
player.scale.set(3, 5, 1); // Adjust as needed

// Set the initial position of the player
player.position.set(2, 5, 0);

// Add the player sprite to the scene
scene.add(player);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 50, 50).normalize();
scene.add(directionalLight);

// Player controls and movement
const controls = { forward: false, backward: false, left: false, right: false, jump: false };
let velocityY = 0;
const gravity = 0.05;
const isOnGround = () => player.position.y <= getTerrainHeight(player.position.x, player.position.z) + 1;

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW': controls.forward = true; break;
    case 'KeyS': controls.backward = true; break;
    case 'KeyA': controls.left = true; break;
    case 'KeyD': controls.right = true; break;
    case 'Space': if (isOnGround()) controls.jump = true; break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW': controls.forward = false; break;
    case 'KeyS': controls.backward = false; break;
    case 'KeyA': controls.left = false; break;
    case 'KeyD': controls.right = false; break;
    case 'Space': controls.jump = false; break;
  }
});

// Function to calculate terrain height using raycasting
const raycaster = new THREE.Raycaster();
const getTerrainHeight = (x, z) => {
  const origin = new THREE.Vector3(x, 50, z);  // Start ray from above the terrain
  const direction = new THREE.Vector3(0, -1, 0);  // Downward direction
  raycaster.set(origin, direction);

  const intersects = raycaster.intersectObjects(Object.values(chunks));
  if (intersects.length > 0) {
    return intersects[0].point.y;
  } else {
    return 0;  // Default to ground level
  }
};

// Player movement and terrain collision
const movePlayer = () => {
  const speed = 0.2;
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  if (controls.forward) {
    player.position.x += direction.x * speed;
    player.position.z += direction.z * speed;
  }
  if (controls.backward) {
    player.position.x -= direction.x * speed;
    player.position.z -= direction.z * speed;
  }
  if (controls.left) {
    player.position.x += direction.z * speed;
    player.position.z -= direction.x * speed;
  }
  if (controls.right) {
    player.position.x -= direction.z * speed;
    player.position.z += direction.x * speed;
  }

  // Gravity and jumping
  const terrainHeight = getTerrainHeight(player.position.x, player.position.z);
  if (controls.jump && isOnGround()) {
    velocityY = 1;
  }

  velocityY -= gravity;
  player.position.y += velocityY;

  if (player.position.y < terrainHeight + 1) {
    player.position.y = terrainHeight + 1;
    velocityY = 0;
  }

  checkForNewChunks();
};

// Camera rotation and mouse controls
let mouseX = 0, mouseY = 0;
let cameraRotationX = 0, cameraRotationY = 0;

// Event listener for mouse movement
window.addEventListener('mousemove', (event) => {
  // Adjust mouse movement scaling as needed
  mouseX += event.movementX * 0.002;
  mouseY += event.movementY * 0.002;
});

const rotateCamera = () => {
  cameraRotationX -= mouseX;
  cameraRotationY -= mouseY;

  cameraRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotationY)); // Prevent flipping

  camera.position.x = player.position.x - Math.sin(cameraRotationX) * 15;
  camera.position.y = player.position.y - Math.sin(cameraRotationY) * 15 + 5;
  camera.position.z = player.position.z - Math.cos(cameraRotationX) * 15;
  
  camera.lookAt(player.position.x, player.position.y, player.position.z);
  
  // Reset mouseX and mouseY to zero after applying to avoid cumulative effect
  mouseX = 0;
  mouseY = 0;
};

const spriteList = [
    
];
    const createRandomSprite = () => {
      const textureLoader = new THREE.TextureLoader();
      const spriteMaterial = new THREE.SpriteMaterial({ map: textureLoader.load('../photos/mcbee.gif') });
      const sprite = new THREE.Sprite(spriteMaterial);

      sprite.position.set(Math.random() * chunkSize - chunkSize / 2, Math.random() * 5 + 1, Math.random() * chunkSize - chunkSize / 2);
      const size = Math.random() * 10
      sprite.scale.set(size, size, 1); // Adjust sprite size
      scene.add(sprite);
      spriteList.push(sprite);
    };

    const moveSprites = () => {
      spriteList.forEach(sprite => {
        sprite.position.x += (Math.random() - 0.5) * 1.5;
        sprite.position.z += (Math.random() - 0.5) * 1.5;
        sprite.position.y = getTerrainHeight(sprite.position.x, sprite.position.z) + 7 + Math.sin(time * 2); // Floating effect
      });
    };

    // Create a few random sprites initially
    for (let i = 0; i < 10; i++) {
      createRandomSprite();
    }

    
// Game loop
function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  rotateCamera();
  updateBackgroundColor();
  moveSprites();

  renderer.render(scene, camera);
}

// Create initial chunks
createChunk(0, 0);

animate();