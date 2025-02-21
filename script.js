var stopState = false;
var passwordShowing = false;
var inputValue = ''; // Global variable

// Global charset variable. Default set to German-order charset.
var globalCharset = "abcdefghijklmnopqrstuvwxyzüöäß";

async function generateRandomString() {
	// Use globalCharset as the characters set for random generation.
	const characters = globalCharset;
	const length = Math.floor(Math.random() * (12 - 4 + 1)) + 4;
	let randomString = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomString += characters[randomIndex];
	}
	return randomString;
}

// Store the original console.log function
const originalConsoleLog = console.log;

// Create a function to capture console output
console.log = function(message) {
	// Call the originalConsole.log function
	//originalConsoleLog(message);

	// Get the console output div
	const consoleOutputDiv = document.getElementById('consoleOutput');

	// Append the message to the div
	consoleOutputDiv.innerHTML += message + '<br>';

	// Scroll to the bottom of the div
	consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
};

// Example usage
console.log('Console is ready to capture messages.');

// Listen for charset dropdown changes to update the globalCharset
document.getElementById('charsetDropdown').addEventListener('change', function() {
    const value = this.value;
    if (value === 'german') {
        globalCharset = "eainrstdhulcgmoßbfkvwpzäüöxyjq";
    } else if (value === 'alphabetical') {
        globalCharset = "abcdefghijklmnopqrstuvwxyz";
    } else if (value === 'alternative') {
        globalCharset = "abcdefghijklmnopqrstuvwxyzüöäß";
    } else if (value === 'characters') {
        globalCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?äöüÄÖÜß";
    } else if (value === 'small_big_characters') {
        globalCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzäöüÄÖÜß";
    } else if (value === 'numbers_small_big_characters') {
        globalCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789äöüÄÖÜß";
    }

    console.log("Charset updated to: " + globalCharset);
});

// Update input attributes when dropdown changes
document.getElementById('myDropdown').addEventListener('change', function() {
    const selectedValue = this.value;
    const inputField = document.getElementById('myInput');
    if (selectedValue === 'Brute_Force') {
        inputField.maxLength = 4;
        inputField.placeholder = 'Enter exactly 4 characters';
    } else if (selectedValue === 'random') {
        inputField.maxLength = 12;
        inputField.placeholder = 'Enter 4 to 12 characters';
    }
});

document.getElementById("myButton").addEventListener("click", async function() {
	stopState = false;
	// Variablen Setup
	inputValue = document.getElementById("myInput").value;
	const dropdown = document.getElementById('myDropdown');
	const selectedValue = dropdown.value;
	
	// Use errorOutput for error messages
	const errorEl = document.getElementById("errorOutput");
	errorEl.textContent = "";
	errorEl.classList.remove('error');
	
	// Prevent the user from starting without selecting a method.
	if (!selectedValue || selectedValue === "default") {
	    errorEl.textContent = "Please select a method.";
	    errorEl.classList.add("error");
	    return;
	}
	
	if (selectedValue === 'Brute_Force' && inputValue.length !== 4) {
		errorEl.textContent = 'Please enter exactly 4 characters for Brute Force.';
		errorEl.classList.add('error');
		return;
	}
	if (selectedValue === 'random' && (inputValue.length < 4 || inputValue.length > 12)) {
		errorEl.textContent = 'Please enter between 4 and 12 characters for Random.';
		errorEl.classList.add('error');
		return;
	}
	
	// Start real-time timer with minutes and seconds
	const timerEl = document.getElementById("timer");
	let startTime = Date.now();
	if(window.timerInterval) clearInterval(window.timerInterval);
	window.timerInterval = setInterval(() => {
		const elapsed = (Date.now() - startTime) / 1000;
		const minutes = Math.floor(elapsed / 60);
		const seconds = (elapsed % 60).toFixed(2);
		timerEl.textContent = "Timer: " + minutes + " minutes, " + seconds + " seconds";
	}, 100);
	
	// Set output confirmation message
	const outputEl = document.getElementById("output");
	outputEl.textContent = "Das Passwort wurde übernommen (Klicke, um dir dein eigegebenes Passwort anzeigen zu lassen)";
	
	console.log(selectedValue);
	
	const target = inputValue;
	// Use globalCharset as source, split into an array.
	const charset = globalCharset.split('');
	const maxLength = 12;

	let attempts = 0;
	let found = false;

	//Brute Force
	if(selectedValue == 'Brute_Force'){
		console.log("Starting brute-force attack...");

		for (let length = 4; length <= maxLength; length++) {
			const total = Math.pow(charset.length, length);
			for (let i = 0; i < total; i++) {
				let current = '';
				let num = i;
				for (let pos = 0; pos < length; pos++) {
					const index = num % charset.length;
					current = charset[index] + current;
					num = Math.floor(num / charset.length);
				}
				attempts++;

				if(attempts % 500 == 0){
					console.clear();
	
					const consoleOutputDiv = document.getElementById('consoleOutput');
					consoleOutputDiv.innerHTML = '--- Console cleared ---' + '<br>';
					consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
				}

				console.log(`Attempt #${attempts}: Trying "${current}"`);
				
				// Yield to the event loop to allow UI updates
				await new Promise(resolve => setTimeout(resolve, 0));
				
				if (current === target) {
					console.log(`\nSUCCESS! Password found: "${current}"`);
					found = true;
					// Clear the timer and update the timer message with elapsed minutes and seconds.
					clearInterval(window.timerInterval);
					const elapsed = (Date.now() - startTime) / 1000;
					const minutes = Math.floor(elapsed / 60);
					const seconds = (elapsed % 60).toFixed(2);
					timerEl.textContent = "Password was found in " + minutes + " minutes, " + seconds + " seconds after " + attempts + " attempts.";
					break;
				}
				if(stopState == true){
					break;
				}
			}

			if (found) break;

			if(stopState == true){
				break;
			}
		}
	}

	if(selectedValue == 'random'){
		var equalityCheck = false;
		console.log("Starting random attack...");

		while(equalityCheck == false && stopState == false){
			
			var randomString = (await generateRandomString()).toString();

			attempts++;

			if(attempts % 500 == 0){
				//console.clear();

				const consoleOutputDiv = document.getElementById('consoleOutput');
				consoleOutputDiv.innerHTML = '--- Console cleared --- ' + '<br>';
				consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
			}

			console.log(`Attempt #${attempts}: Trying "${randomString}"`);
				
			// Yield to the event loop to allow UI updates
			await new Promise(resolve => setTimeout(resolve, 0));
				
			if (randomString === inputValue) {
					console.log(`\nSUCCESS! Password found: "${randomString}"`);
					found = true;
					// Clear timer and update message with elapsed minutes and seconds.
					clearInterval(window.timerInterval);
					const elapsed = (Date.now() - startTime) / 1000;
					const minutes = Math.floor(elapsed / 60);
					const seconds = (elapsed % 60).toFixed(2);
					timerEl.textContent = "Password was found in " + minutes + " minutes, " + seconds + " seconds";
					break;
			}
		
		}     
			
	}

});

document.getElementById("stop").addEventListener("click", function(){
	stopState = true;
	if(window.timerInterval) clearInterval(window.timerInterval);
	console.log("\n Vorgang gestoppt.")
});

function changeContent(id, newContent) {
	
	if(passwordShowing == false){
		document.getElementById(id).textContent = inputValue;
		passwordShowing = true;
	}
	else{
		document.getElementById(id).textContent = "Das Passwort wurde übernommen (Klicke, um dir dein eigegebenes Passwort anzeigen zu lassen)";
		passwordShowing = false;
	}
}




