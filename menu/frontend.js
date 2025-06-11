

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
        let response;

        if(diningHall == "example") {
            response = await fetch(`https://kimjoshua.com/menu/example.json`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            menuItems = await response.json();
            displayMenu(menuItems);
            isRandomMenuDisplayed = false; 
        }

        response = await fetch(`https://dumdum.work/menu?diningHall=${diningHall}&${queryString}`);

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

        const filteredItems = items.filter(item => 
            item.food !== 'Unknown' && 
            item.traits.length > 0 &&
            isItemSelected(item)
        );

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

            foodItemDiv.addEventListener('click', () => addToCurrentlyAte(item));

            container.appendChild(foodItemDiv);
        });

        container.classList.remove('fade');
        container.classList.add('fade-in');
        setTimeout(() => {
            container.classList.remove('fade-in');
        }, 500);
    }, 500);
}

function isItemSelected(item) {
    const halalChecked = document.getElementById('halal').checked;
    const veganChecked = document.getElementById('vegan').checked;
    const vegetarianChecked = document.getElementById('vegetarian').checked;
    const kosherChecked = document.getElementById('kosher').checked;
    const glutenFreeChecked = document.getElementById('gluten-free').checked;

    if (halalChecked && !item.traits.includes('Halal')) {
        return false; 
    }

    if (veganChecked && !item.traits.includes('Vegan')) {
        return false; 
    }

    if (vegetarianChecked && !item.traits.includes('Vegetarian')) {
        return false; 
    }

    if (kosherChecked && !item.traits.includes('Kosher')) {
        return false; 
    }

    if (glutenFreeChecked && !item.traits.includes('Gluten Free')) {
        return false; 
    }

    return true; 
}


function generateRandomMenu(calorieTarget) {
    const targetRange = [calorieTarget - 20, calorieTarget];
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

    // Get selected dietary traits
    const selectedTraits = [];
    if (document.getElementById('halal').checked) selectedTraits.push('Halal');
    if (document.getElementById('vegan').checked) selectedTraits.push('Vegan');
    if (document.getElementById('vegetarian').checked) selectedTraits.push('Vegetarian');
    if (document.getElementById('kosher').checked) selectedTraits.push('Kosher');
    if (document.getElementById('gluten-free').checked) selectedTraits.push('Gluten Free');

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

        // Check if the item matches the selected traits
        const itemTraits = randomItem.traits || []; // Assuming traits are stored in `randomItem.traits`
        const matchesTraits = selectedTraits.length === 0 || selectedTraits.every(trait => itemTraits.includes(trait));

        if (
            newCalories <= targetRange[1] &&
            (totalSodium + itemSodium) <= maxSodium &&
            (totalCholesterol + itemCholesterol) <= maxCholesterol &&
            (totalSugars + itemSugars) <= maxSugars &&
            (totalProtein + itemProtein) >= minProtein &&
            (totalFat + itemTotalFat) <= maxTotalFat &&
            matchesTraits // Ensure the item matches the selected traits
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
    const r = Math.floor(Math.random() * 56) + 200; // Red between 200-255
    const g = Math.floor(Math.random() * 56) + 200; // Green between 200-255
    const b = Math.floor(Math.random() * 56) + 200; // Blue between 200-255
    return `rgb(${r}, ${g}, ${b})`;
}


document.getElementById('food-button').addEventListener('click', () => {
    const searchTerm = document.getElementById('food-searcher').value.toLowerCase();

    if (searchTerm) {
        const filteredItems = menuItems.filter(item => item.food.toLowerCase().includes(searchTerm));

        if (filteredItems.length > 0) {
            displayMenu(filteredItems);
        } else {
            document.getElementById('menu-container').innerHTML = '<p>No items found matching the search term.</p>';
        }
    } else {
        document.getElementById('menu-container').innerHTML = '<p>Please enter a food name to search.</p>';
    }
});


let currentlyAteItems = [];
let totalAteNutrition = {
    calories: 0,
    sodium: 0,
    cholesterol: 0,
    sugars: 0,
    protein: 0,
    fat: 0
};

function updateTotalAteNutrition() {
    document.getElementById('total-ate-calories').textContent = `Calories: ${totalAteNutrition.calories}`;
    document.getElementById('total-ate-sodium').textContent = `Sodium: ${totalAteNutrition.sodium}mg`;
    document.getElementById('total-ate-cholesterol').textContent = `Cholesterol: ${totalAteNutrition.cholesterol}mg`;
    document.getElementById('total-ate-sugars').textContent = `Sugars: ${totalAteNutrition.sugars}g`;
    document.getElementById('total-ate-protein').textContent = `Protein: ${totalAteNutrition.protein}g`;
    document.getElementById('total-ate-fat').textContent = `Total Fat: ${totalAteNutrition.fat}g`;
}

function addToCurrentlyAte(item) {

    currentlyAteItems.push(item);

    totalAteNutrition.calories += parseInt(item.calories);
    totalAteNutrition.sodium += parseInt(item.sodium);
    totalAteNutrition.cholesterol += parseInt(item.cholesterol);
    totalAteNutrition.sugars += parseInt(item.sugars);
    totalAteNutrition.protein += parseInt(item.protein);
    totalAteNutrition.fat += parseInt(item.totalFat);

    const currentlyAteContainer = document.getElementById('currently-ate-items');
    const ateItemDiv = document.createElement('label');
    ateItemDiv.classList.add('ate-item');
    ateItemDiv.textContent = item.food;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button')
    removeButton.addEventListener('click', () => removeFromCurrentlyAte(item, removeButton));

    currentlyAteContainer.append(removeButton);
    removeButton.appendChild(ateItemDiv);
    

    updateTotalAteNutrition();
}

function removeFromCurrentlyAte(item, element) {
    const itemIndex = currentlyAteItems.indexOf(item);
    if (itemIndex > -1) {
        currentlyAteItems.splice(itemIndex, 1);

        totalAteNutrition.calories -= parseInt(item.calories);
        totalAteNutrition.sodium -= parseInt(item.sodium);
        totalAteNutrition.cholesterol -= parseInt(item.cholesterol);
        totalAteNutrition.sugars -= parseInt(item.sugars);
        totalAteNutrition.protein -= parseInt(item.protein);
        totalAteNutrition.fat -= parseInt(item.totalFat);

        element.remove();

        updateTotalAteNutrition();
    }
}

document.querySelectorAll('.hide-button').forEach(hideButton => {
    hideButton.addEventListener('click', () => {
        const parent = hideButton.parentNode;

        

        parent.classList.add('fade');
        setTimeout(() => {
            parent.classList.remove('fade');
            parent.style.display = 'none';
            parent.parentNode.insertBefore(showButton, parent.nextSibling);
        }, 500);

        const showButton = document.createElement('button');
        showButton.textContent = 'Show Category';
        showButton.classList.add('show-button');

        

        showButton.addEventListener('click', () => {
    
            parent.style.display = 'block';  
            showButton.remove(); 
        });
    });
});

document.querySelectorAll('#nutrition-input, #nutrition-facts, #currently-ate, #filter-list').forEach(div => {
    div.style.backgroundColor = getRandomColor();
 })

 function showDiningHallOptions() {
    const diningHallSelect = document.getElementById('dining-hall-select');
    const selectedValue = diningHallSelect.value;
    const diningHallOptions = document.getElementById('dining-hall-options');
    
    if (selectedValue) {
        document.querySelectorAll('.dining-hall-option').forEach(option => {
            option.style.display = 'none';
        });
        
        document.getElementById(selectedValue).style.display = 'block';
        diningHallOptions.style.display = 'block';
        diningHallOptions.classList.remove('hide');
        diningHallOptions.classList.add('fade-out');
        setTimeout(() => {
            diningHallOptions.classList.remove('fade-out')
            diningHallOptions.style.display = 'none';
        }, 5000);
    }
}

document.querySelectorAll('#dietary-traits input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (!isRandomMenuDisplayed) {
            fetchMenuData();
        } else {
            // If a random menu is displayed, you may want to refresh it based on the selected filters
            generateRandomMenu(parseInt(document.getElementById('calorie-input').value));
        }
    });
});