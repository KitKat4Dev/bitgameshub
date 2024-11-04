// Array of complaints with various humorous themes
const complaints = [
    "Why is there never a good place to put my elbow?",
    "The last piece of pizza is always the worst.",
    "Why do socks always disappear in the wash?",
    "Why do we have to wait for the microwave?",
    "Why is it so hard to find a good pen?",
    "Why does the battery die just when you need it the most?",
    "Why do I always step on a Lego in the dark?",
    "Why is there never enough ketchup for my fries?",
    "Why do all my favorite shows get canceled?",
    "Why does my phone always die at 1%?",
    "Why does the toast always land butter side down?",
    "Why do the cookies break before I get to eat them?",
    "Why do we always get stuck in traffic when we’re late?",
    "Why is the remote always missing during a crucial moment?",
    "Why do I always forget where I put my keys?",
    "Why does every advertisement have to be louder than the show?",
    "Why does it rain when I forget my umbrella?",
    "Why does the Wi-Fi slow down when I’m in the middle of something important?",
    "Why does it always take longer to get ready than I think?",
    "Why are Mondays so much worse than Sundays?"
];

// Function to generate a random complaint
function generateRandomComplaint() {
    const randomIndex = Math.floor(Math.random() * complaints.length);
    return complaints[randomIndex];
}

// Function to display a complaint in the DOM
function displayComplaint() {
    const complaintText = generateRandomComplaint();
    document.getElementById('complaint').textContent = complaintText;
}

// Event listener for the button to generate a complaint
document.getElementById('generateComplaint').addEventListener('click', displayComplaint);

// Function to add a new complaint to the list
function addComplaint() {
    const newComplaint = document.getElementById('newComplaint').value;
    if (newComplaint) {
        complaints.push(newComplaint);
        document.getElementById('newComplaint').value = ''; // Clear input field
        alert("Complaint added successfully!");
    } else {
        alert("Please enter a complaint before adding.");
    }
}

// Event listener for the button to add a new complaint
document.getElementById('addComplaint').addEventListener('click', addComplaint);

// Display initial random complaint on page load
window.onload = displayComplaint;
