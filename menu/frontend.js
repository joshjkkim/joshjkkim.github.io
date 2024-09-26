let menuItems = []; 
let isRandomMenuDisplayed = false; 

async function fetchMenuData() {
    const diningHall = document.getElementById('dining-hall-select').value; 
    const maxSodium = document.getElementById('max-sodium').value;
    const maxCholesterol = document.getElementById('max-cholesterol').value;
    const maxSugars = document.getElementById('max-sugars').value;
    const minProtein = document.getElementById('min-protein').value;
    const maxTotalFat = document.getElementById('max-total-fat').value;

    const queryString = new URLSearchParams({
        maxSodium,
        maxCholesterol,
        maxSugars,
        minProtein,
        maxTotalFat
    }).toString();

    try {
        const response = await fetch(`https://dumdum9000.serveo.net/menu?diningHall=${diningHall}&${queryString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        menuItems = await response.json();
        displayMenu(menuItems);
        isRandomMenuDisplayed = false; 
    } catch (error) {
        console.error('Error fetching menu data:', error);
    }
}

document.getElementById('dining-hall-select').addEventListener('change', fetchMenuData);

document.getElementById('generate-button').addEventListener('click', () => {
    const calorieTarget = parseInt(document.getElementById('calorie-input').value);
    if (!isNaN(calorieTarget)) {
        generateRandomMenu(calorieTarget); 
        isRandomMenuDisplayed = true; 
    }
});

function displayMenu(items) {
    const container = document.getElementById('menu-container');

    container.classList.add('fade');

    setTimeout(() => {
        container.innerHTML = '';

        const filteredItems = items.filter(item => item.food !== 'Unknown' && item.traits.length > 0);

        filteredItems.forEach(item => {
            const foodItemDiv = document.createElement('div');
            const foodName = document.createElement('h4');
            const traitsList = document.createElement('ul');
            const caloriesInfo = document.createElement('p');
            const containsInfo = document.createElement('p');
            const nutritionInfo = document.createElement('p'); 

            foodName.textContent = item.food;

            item.traits.forEach(trait => {
                const traitItem = document.createElement('li');
                traitItem.textContent = trait;
                traitsList.appendChild(traitItem);
            });

            caloriesInfo.innerHTML = `<strong>Calories:</strong> ${item.calories}`;

            containsInfo.innerHTML = `<strong>Contains:</strong> ${item.contains.join(', ')}`;

            nutritionInfo.innerHTML = `
                <strong>Nutrition Facts:</strong> Sodium: ${item.sodium}mg, Cholesterol: ${item.cholesterol}mg, 
                Sugars: ${item.sugars}g, Protein: ${item.protein}g, Total Fat: ${item.totalFat}g
            `;

            foodItemDiv.classList.add('food-item');
            foodItemDiv.style.backgroundColor = getRandomColor();

            foodItemDiv.appendChild(foodName);
            foodItemDiv.appendChild(traitsList);
            foodItemDiv.appendChild(caloriesInfo);
            foodItemDiv.appendChild(containsInfo);
            foodItemDiv.appendChild(nutritionInfo); 

            container.appendChild(foodItemDiv);
        });

        container.classList.remove('fade');
        container.classList.add('fade-in');

        setTimeout(() => {
            container.classList.remove('fade-in');
        }, 500); 
    }, 500); 
}


function generateRandomMenu(calorieTarget) {
    const targetRange = [calorieTarget - 100, calorieTarget + 100];
    const selectedItems = [];
    let totalCalories = 0;
    let totalSodium = 0;
    let totalCholesterol = 0;
    let totalSugars = 0;
    let totalProtein = 0;
    let totalFat = 0;

    const maxSodium = parseInt(document.getElementById('max-sodium').value) || Infinity;
    const maxCholesterol = parseInt(document.getElementById('max-cholesterol').value) || Infinity;
    const maxSugars = parseInt(document.getElementById('max-sugars').value) || Infinity;
    const minProtein = parseInt(document.getElementById('min-protein').value) || 0;
    const maxTotalFat = parseInt(document.getElementById('max-total-fat').value) || Infinity;

    const usedIndices = new Set();
    let attempts = 0;

    while (totalCalories < targetRange[1] && attempts < 100) {

        const randomIndex = Math.floor(Math.random() * menuItems.length);

        if (usedIndices.has(randomIndex)) {
            attempts++;
            continue;
        }

        usedIndices.add(randomIndex);
        attempts = 0; 

        const randomItem = menuItems[randomIndex];

        const itemCalories = parseInt(randomItem.calories);
        const itemSodium = parseInt(randomItem.sodium);
        const itemCholesterol = parseInt(randomItem.cholesterol);
        const itemSugars = parseInt(randomItem.sugars);
        const itemProtein = parseInt(randomItem.protein);
        const itemTotalFat = parseInt(randomItem.totalFat);

        const newCalories = totalCalories + itemCalories;

        if (
            newCalories <= targetRange[1] &&
            (totalSodium + itemSodium) <= maxSodium &&
            (totalCholesterol + itemCholesterol) <= maxCholesterol &&
            (totalSugars + itemSugars) <= maxSugars &&
            (totalProtein + itemProtein) >= minProtein &&
            (totalFat + itemTotalFat) <= maxTotalFat
        ) {
            selectedItems.push(randomItem);
            totalCalories = newCalories;
            totalSodium += itemSodium;
            totalCholesterol += itemCholesterol;
            totalSugars += itemSugars;
            totalProtein += itemProtein;
            totalFat += itemTotalFat;
        }
    }

    document.getElementById('total-calories').textContent = totalCalories; 
    document.getElementById('total-sodium').textContent = totalSodium;
    document.getElementById('total-cholesterol').textContent = totalCholesterol;
    document.getElementById('total-sugars').textContent = totalSugars;
    document.getElementById('total-protein').textContent = totalProtein;
    document.getElementById('total-fat').textContent = totalFat;

    if (selectedItems.length > 0) {
        displayGeneratedMenu(selectedItems);
    } else {
        document.getElementById('menu-container').innerHTML = '<p>No items meet the criteria.</p>';
    }
}


function displayGeneratedMenu(selectedItems) {
    const container = document.getElementById('menu-container');

    container.innerHTML = '';

    selectedItems.forEach(item => {
        const foodItemDiv = document.createElement('div');
        const foodName = document.createElement('h4');
        const traitsList = document.createElement('ul');
        const caloriesInfo = document.createElement('p');
        const containsInfo = document.createElement('p');
        const nutritionInfo = document.createElement('p'); 

        foodName.textContent = item.food;

        item.traits.forEach(trait => {
            const traitItem = document.createElement('li');
            traitItem.textContent = trait;
            traitsList.appendChild(traitItem);
        });

        caloriesInfo.innerHTML = `<strong>Calories:</strong> ${item.calories}`;

        containsInfo.innerHTML = `<strong>Contains:</strong> ${item.contains.join(', ')}`;
        nutritionInfo.innerHTML = `
            <strong>Nutrition Facts:</strong> Sodium: ${item.sodium}mg, Cholesterol: ${item.cholesterol}mg, 
            Sugars: ${item.sugars}g, Protein: ${item.protein}g, Total Fat: ${item.totalFat}g
        `;

        foodItemDiv.classList.add('food-item');
        foodItemDiv.style.backgroundColor = getRandomColor();

        foodItemDiv.appendChild(foodName);
        foodItemDiv.appendChild(traitsList);
        foodItemDiv.appendChild(caloriesInfo);
        foodItemDiv.appendChild(containsInfo);
        foodItemDiv.appendChild(nutritionInfo);

        container.appendChild(foodItemDiv);
    });
}
fetchMenuData();

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
