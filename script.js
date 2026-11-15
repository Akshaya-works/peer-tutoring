// ==========================================================================
// 1. BROWSE PAGE (browse.html) - Search, Filter & Request Session
// ==========================================================================
const tutorSearchForm = document.getElementById("tutorSearchForm");

if (tutorSearchForm) {
    const searchInput = document.getElementById("searchInput");
    const domainFilter = document.getElementById("domainFilter");
    const availabilityFilter = document.getElementById("availabilityFilter");
    const tutorArticles = document.querySelectorAll("main section article");

    function filterTutors(event) {
        if (event) event.preventDefault(); // Page reload hone se rokta hai

        const searchText = searchInput.value.toLowerCase().trim();
        const selectedDomain = domainFilter.value.toLowerCase();
        const selectedAvailability = availabilityFilter.value.toLowerCase();

        tutorArticles.forEach(function (article) {
            const cardText = article.innerText.toLowerCase();

            // Check Name or Skill
            const matchesSearch = cardText.includes(searchText);

            // Check Domain
            const matchesDomain =
                selectedDomain === "all" ||
                cardText.includes("teaching domain: " + selectedDomain);

            // Check Availability
            const matchesAvailability =
                selectedAvailability === "all" ||
                cardText.includes("availability: " + selectedAvailability);

            // Show or Hide Tutor Article
            if (matchesSearch && matchesDomain && matchesAvailability) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    }

    // Form submit aur live typing/dropdown change dono par filter chalega
    tutorSearchForm.addEventListener("submit", filterTutors);
    searchInput.addEventListener("input", filterTutors);
    domainFilter.addEventListener("change", filterTutors);
    availabilityFilter.addEventListener("change", filterTutors);

    // "Request Session" Buttons Functionality
    const requestButtons = document.querySelectorAll("article button");
    requestButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const tutorArticle = btn.closest("article");
            const tutorName = tutorArticle.querySelector("h3").innerText;
            const domainText = tutorArticle.querySelectorAll("p")[2].innerText.replace("Teaching Domain: ", "");

            const topic = prompt("Enter the topic you want to learn from " + tutorName + ":", domainText);

            if (topic) {
                // LocalStorage mein naya session save karna taaki sessions.html par dikhe
                const savedSessions = JSON.parse(localStorage.getItem("peerPulseSessions")) || [];
                savedSessions.push({
                    subject: topic,
                    tutorName: tutorName,
                    date: "18 November 2026",
                    time: "5:00 PM - 6:00 PM",
                    status: "Pending"
                });
                localStorage.setItem("peerPulseSessions", JSON.stringify(savedSessions));

                alert("Session request sent to " + tutorName + " for " + topic + "!");
                btn.innerText = "Request Sent ✓";
                btn.disabled = true;
            }
        });
    });
}

// ==========================================================================
// 2. REGISTRATION PAGE (registration.html) - Image Preview, Role Toggle & Save
// ==========================================================================
const profilePicInput = document.getElementById("profile");
const displayImg = document.getElementById("display");
const studentRadio = document.getElementById("student");
const tutorRadio = document.getElementById("tutor");

// A. Profile Picture Live Preview
if (profilePicInput && displayImg) {
    profilePicInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                displayImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// B. Student vs Tutor Role Selection (Fieldset Show/Hide)
if (studentRadio && tutorRadio) {
    const fieldsets = document.querySelectorAll("form fieldset");
    // Index 2 = Learning Information, Index 3 = Teaching Information
    const learningFieldset = fieldsets[2];
    const teachingFieldset = fieldsets[3];

    function updateRoleSections() {
        if (studentRadio.checked) {
            learningFieldset.style.display = "block";
            teachingFieldset.style.display = "none";
        } else if (tutorRadio.checked) {
            learningFieldset.style.display = "none";
            teachingFieldset.style.display = "block";
        }
    }

    studentRadio.addEventListener("change", updateRoleSections);
    tutorRadio.addEventListener("change", updateRoleSections);

    // Registration Form Submit
    const regForm = document.querySelector("form");
    regForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const userData = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            email: document.getElementById("email").value,
            mobile: document.getElementById("mobile").value,
            qualification: document.getElementById("qualification").value || "B.Tech CSE"
        };

        // User data save karna taaki Profile page par update ho sake
        localStorage.setItem("peerPulseUser", JSON.stringify(userData));

        alert("Welcome to PeerPulse, " + userData.name + "! Your account has been created.");
        window.location.href = "profile.html";
    });
}

// ==========================================================================
// 3. LOGIN PAGE (login.html) - Basic Login Validation
// ==========================================================================
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (emailInput && passwordInput && !document.getElementById("name")) {
    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Login Successful! Redirecting to your profile...");
        window.location.href = "profile.html";
    });
}

// ==========================================================================
// 4. PROFILE PAGE (profile.html) - Edit Info & Edit Skills
// ==========================================================================
const img3 = document.getElementById("img3");

if (img3) {
    const profileSection = img3.parentElement;
    const paragraphs = profileSection.querySelectorAll("p");
    const editProfileBtn = profileSection.querySelector("button");

    // Agar user ne Registration form bhara tha toh wahi naam/details dikhao
    const savedUser = JSON.parse(localStorage.getItem("peerPulseUser"));
    if (savedUser && paragraphs.length >= 5) {
        paragraphs[0].innerHTML = "<b>Name:</b> " + savedUser.name;
        paragraphs[1].innerHTML = "<b>Age:</b> " + savedUser.age;
        paragraphs[2].innerHTML = "<b>Email:</b> " + savedUser.email;
        paragraphs[3].innerHTML = "<b>Mobile Number:</b> " + savedUser.mobile;
        paragraphs[4].innerHTML = "<b>Qualification:</b> " + savedUser.qualification;
    }

    // "Edit Personal Information" Button
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            const newName = prompt("Enter your Name:", "Rahul Sharma");
            const newEmail = prompt("Enter your Email:", "rahul@example.com");
            const newMobile = prompt("Enter your Mobile Number:", "+91 9876543210");

            if (newName) paragraphs[0].innerHTML = "<b>Name:</b> " + newName;
            if (newEmail) paragraphs[2].innerHTML = "<b>Email:</b> " + newEmail;
            if (newMobile) paragraphs[3].innerHTML = "<b>Mobile Number:</b> " + newMobile;

            alert("Personal Information Updated!");
        });
    }

    // "Edit Learning Information" Button (Nayi Skill Add Karna)
    const allButtons = document.querySelectorAll("main section button");
    if (allButtons.length > 1) {
        const editSkillsBtn = allButtons[1];
        const skillsList = editSkillsBtn.parentElement.querySelector("ul");

        editSkillsBtn.addEventListener("click", function () {
            const newSkill = prompt("Enter a new skill you want to learn:");
            if (newSkill && newSkill.trim() !== "") {
                const li = document.createElement("li");
                li.textContent = newSkill.trim();
                skillsList.appendChild(li);
            }
        });
    }
}

// ==========================================================================
// 5. SESSIONS PAGE (sessions.html) - Accept/Reject & View Details
// ==========================================================================
const sessionSections = document.querySelectorAll("main section");

if (document.title.includes("My Sessions")) {
    // A. Browse page se book kiye gaye naye sessions dikhana
    const savedSessions = JSON.parse(localStorage.getItem("peerPulseSessions")) || [];
    if (savedSessions.length > 0 && sessionSections.length > 0) {
        const learningSection = sessionSections[0];

        savedSessions.forEach(function (s) {
            const newArticle = document.createElement("article");
            newArticle.innerHTML = `
                <hr>
                <h3>${s.subject}</h3>
                <p>Role: Student</p>
                <p>Tutor Name: ${s.tutorName}</p>
                <p>Subject: ${s.subject}</p>
                <p>Date: ${s.date}</p>
                <p>Time: ${s.time}</p>
                <p>Status: <b>${s.status}</b></p>
                <button type="button" class="details-btn">View Details</button>
            `;
            learningSection.appendChild(newArticle);
        });
    }

    // B. View Details, Accept Request, Reject Request Buttons
    const allSessionBtns = document.querySelectorAll("article button");
    allSessionBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const article = btn.closest("article");
            const heading = article.querySelector("h3").innerText;

            if (btn.innerText.includes("View Details")) {
                alert("Session Details for " + heading + ":\nMeeting Mode: Online (Google Meet)\nPlease join 5 minutes early!");
            } else if (btn.innerText.includes("Accept Request")) {
                const paragraphs = article.querySelectorAll("p");
                paragraphs.forEach(function (p) {
                    if (p.innerText.includes("Status:")) {
                        p.innerHTML = "Status: <b style='color: green;'>Accepted</b>";
                    }
                });
                alert("You have ACCEPTED the session request for " + heading + "!");
            } else if (btn.innerText.includes("Reject Request")) {
                const paragraphs = article.querySelectorAll("p");
                paragraphs.forEach(function (p) {
                    if (p.innerText.includes("Status:")) {
                        p.innerHTML = "Status: <b style='color: red;'>Rejected</b>";
                    }
                });
                alert("You have REJECTED the session request for " + heading + ".");
            }
        });
    });
}