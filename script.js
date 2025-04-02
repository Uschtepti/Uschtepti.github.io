var stopState = false;
var passwordShowing = false;
var inputValue = ''; // Global variable

// Global charset variable. Default set to German-order charset.
var globalCharset = "abcdefghijklmnopqrstuvwxyzüöäß";

let loggingEnabled = true;

document.getElementById("loggingToggle").addEventListener("click", function(){
    loggingEnabled = !loggingEnabled;
    if(loggingEnabled) {
        this.style.backgroundColor = "#45a049";
        this.innerText = "Logging: On";
    } else {
        this.style.backgroundColor = "#BE2727";
        this.innerText = "Logging: Off";
    }
});

async function generateRandomString() {
    const characters = globalCharset;
    const fixedLength = document.getElementById('lengthInput').value;
    const length = fixedLength ? parseInt(fixedLength) : Math.floor(Math.random() * (12 - 4 + 1)) + 4;
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
console.log('Console is ready to capture messages.' + '<br>');

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
    } else if (value === 'numbers') {
        globalCharset = "0123456789";
    } else if (value === 'big_characters') {
        globalCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ";
    }  // Added missing closing brace

    console.log("Charset updated to: " + globalCharset + "<br>");
    
    // Check if current password matches new charset
    const currentPassword = document.getElementById('myInput').value;
    const errorEl = document.getElementById('errorOutput');
    
    if (currentPassword && !validateCharset(currentPassword)) {
        errorEl.textContent = "Current password contains characters not present in the selected charset";
        errorEl.classList.add('error');
    } else {
        errorEl.textContent = '';
        errorEl.classList.remove('error');
    }
});

// Update input attributes when dropdown changes
document.getElementById('myDropdown').addEventListener('change', function() {
    const selectedValue = this.value;
    const inputField = document.getElementById('myInput');
    const lengthInput = document.getElementById('lengthInput');
    
    if (selectedValue === 'Brute_Force') {
        inputField.maxLength = 4;
        inputField.placeholder = 'Enter exactly 4 characters';
        lengthInput.style.display = 'none';
    } else if (selectedValue === 'random') {
        inputField.maxLength = 12;
        inputField.placeholder = 'Enter 4 to 12 characters';
        lengthInput.style.display = 'inline-block';
        lengthInput.value = ''; // Clear the input
        lengthInput.placeholder = 'Optional: Set fixed length';
    } else {
        lengthInput.style.display = 'none';
    }
});

document.getElementById('lengthInput').addEventListener('input', validateLength);
document.getElementById('myInput').addEventListener('input', function() {
    validateLength();
    const errorEl = document.getElementById("errorOutput");
    if (!validateCharset(this.value) && this.value.length > 0) {
        errorEl.textContent = "Password contains invalid characters for selected charset";
        errorEl.classList.add("error");
    }
});

function validateLength() {
    const lengthInput = document.getElementById('lengthInput');
    const passwordInput = document.getElementById('myInput');
    const errorEl = document.getElementById('errorOutput');
    
    if (lengthInput.value) {
        const fixedLength = parseInt(lengthInput.value);
        if (passwordInput.value.length !== fixedLength) {
            errorEl.textContent = `Password must be exactly ${fixedLength} characters long`;
            errorEl.classList.add('error');
            return false;
        } else {
            errorEl.textContent = '';
            errorEl.classList.remove('error');
            return true;
        }
    } else {
        // If no fixed length is set, just check if it's within 4-12 range
        if (passwordInput.value.length > 0 && (passwordInput.value.length < 4 || passwordInput.value.length > 12)) {
            errorEl.textContent = 'Password must be between 4 and 12 characters';
            errorEl.classList.add('error');
            return false;
        } else {
            errorEl.textContent = '';
            errorEl.classList.remove('error');
            return true;
        }
    }
}

function validateCharset(password) {
    const charset = new Set(globalCharset.split(''));
    for (let char of password) {
        if (!charset.has(char)) {
            return false;
        }
    }
    return true;
}

document.getElementById("myButton").addEventListener("click", async function() {
    // If there's already a process running, stop it first
    if (!stopState) {
        stopState = true;
        console.log("Stopping current process before starting new one...<br>");
        // Give the current process time to stop
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    stopState = false;
    inputValue = document.getElementById("myInput").value;
    const dropdown = document.getElementById('myDropdown');
    const selectedValue = dropdown.value;
    
    const errorEl = document.getElementById("errorOutput");
    errorEl.textContent = "";
    errorEl.classList.remove('error');
    
    // All validations
    if (!validateCharset(inputValue)) {
        errorEl.textContent = "Password contains characters not present in the selected charset";
        errorEl.classList.add("error");
        return;
    }

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
    if (selectedValue === 'random') {
        const fixedLength = document.getElementById('lengthInput').value;
        if (fixedLength && inputValue.length !== parseInt(fixedLength)) {
            errorEl.textContent = `When using fixed length, password must be exactly ${fixedLength} characters long.`;
            errorEl.classList.add('error');
            return;
        }
        if (inputValue.length < 4 || inputValue.length > 12) {
            errorEl.textContent = 'Password must be between 4 and 12 characters.';
            errorEl.classList.add('error');
            return;
        }
    }
    
    // Clear password only after all validations pass
    document.getElementById("myInput").value = '';
    
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
                    consoleOutputDiv.innerHTML = '--- Console cleared ---<br>';
                    consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
                }

                logTry(`Attempt #${attempts}: Trying [${current}]`);
                
                // Yield to the event loop to allow UI updates
                await new Promise(resolve => setTimeout(resolve, 0));
                
                if (current === target) {
                    logTry(`\nSUCCESS! Password found: [${current}]`);
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
                consoleOutputDiv.innerHTML = '--- Console cleared ---<br>';
                consoleOutputDiv.scrollTop = consoleOutputDiv.scrollHeight;
            }

            logTry(`Attempt #${attempts}: Trying [${randomString}]`);
                
            // Yield to the event loop to allow UI updates
            await new Promise(resolve => setTimeout(resolve, 0));
                
            if (randomString === inputValue) {
                    logTry(`\nSUCCESS! Password found: [${randomString}]`);
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
	console.log("\nVorgang gestoppt.<br>")
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

function logTry(message) {
    if(loggingEnabled) {
        // Escape special characters in the message
        message = message.replace(/"/g, '\\"');  // Escape quotes
        message = message.replace(/</g, '&lt;'); // Escape < for HTML
        message = message.replace(/>/g, '&gt;'); // Escape > for HTML
        console.log(message); // Don't add br tag here since it's part of the HTML template
    }
}




