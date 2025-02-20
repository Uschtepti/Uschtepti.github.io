function changeContent(id, newContent) {
    document.getElementById(id).textContent = newContent;
}

var stopState = false;

async function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?äöüÄÖÜß';
    //const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * (12 - 4 + 1)) + 4; // Zufällige Länge zwischen 4 und 12
    //const length = 4;
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    var restult = randomString;
    return restult;
}

// Store the original console.log function
const originalConsoleLog = console.log;

// Create a function to capture console output
console.log = function(message) {
    // Call the original console.log function
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


document.getElementById("myButton").addEventListener("click", async function() {
    stopState = false;
    //Variablen Setup
    const inputValue = document.getElementById("myInput").value;
    document.getElementById("output").textContent = "Das Passwort wurde übernommen (Hovere über diesen Text um es dir anzeigen zu lassen)";

    const dropdown = document.getElementById('myDropdown');
    const selectedValue = dropdown.value;
    console.log(selectedValue);
    
    const target = inputValue;
    const charset = "abcdefghijklmnopqrstuvwxyz".split('');
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
                    break;
            }
        
        }     
            
    }

});

document.getElementById("stop").addEventListener("click", function(){
    stopState = true;
    console.log("\n Vorgang gestoppt.")
});




