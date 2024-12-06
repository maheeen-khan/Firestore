import {
    db,
    getFirestore,
    collection,
    addDoc,
    getDocs,
    Timestamp,
    query,
    orderBy,
    limit,
    doc, deleteDoc, updateDoc
} from "../public/firebase.js";

let email = document.getElementById('std_email')
let radios = document.getElementsByName('attendence')
let markAttendence = document.getElementById('markAttendence');

let selectedValue = null;

markAttendence.addEventListener('click', () => {

    console.log(email.value);


    // Iterate through each radio button to find the selected one
    radios.forEach((radio) => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });

    if (selectedValue && email.value) {
        console.log(selectedValue);
        addmyDoc()
        displayPosts.innerHTML = ''
        readData();

    } else {
        console.log("No option selected.");
    }

})

async function addmyDoc() {
    // Add a new document with a generated id.

    try {
        const docRef = await addDoc(collection(db, "users",), {

            email: email.value,
            attendence: selectedValue
        });
        email.value = "";
        selectedValue= "";
        alert("Document written with ID: ", docRef.id);
    }

    catch (e) {
        console.log(e);

    }
}

async function readData() {
    let arr = [];
    displayPosts.innerHTML = ""; // Clear posts before rendering new ones

    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), docId: doc.id });
        console.log(doc.id, " => ", doc.data());
    });

    arr.map((item, index) => {
        displayPosts.innerHTML += `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title">${item.email}</h5>
                  <p class="card-text">${item.attendence}</p>
                  <button class="dltBtn btn btn-danger" data-id="${item.docId}">Delete</button>
                  <button class="edtBtn btn btn-warning" data-id="${item.docId}">Edit</button>
                </div>
            </div>`;
    });

    // Attach event listeners to the dynamically created delete buttons
    document.querySelectorAll('.dltBtn').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const docId = e.target.getAttribute("data-id"); // Get document ID from button's data-id attribute
            console.log("Deleting document with ID:", docId);
            try {
                await deleteDoc(doc(db, "users", docId)); // Delete the document
                console.log(`Document ${docId} deleted successfully.`);
                readData(); // Refresh the displayed data
            } catch (err) {
                console.error("Error deleting document:", err);
            }
        });
    });


        // Edit button functionality
        document.querySelectorAll('.edtBtn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const docId = e.target.getAttribute("data-id");
                const card = document.getElementById(`card-${docId}`);
                const item = arr.find((item) => item.docId === docId);
    
                // Show SweetAlert to confirm edit
                Swal.fire({
                    title: 'Edit Attendance',
                    html: `
                        <input type="email" id="edit-email-${docId}" value="${item.email}" class="form-control mb-2">
                        <select id="edit-attendance-${docId}" class="form-control">
                            <option value="leave" ${item.attendence === "leave" ? "selected" : ""}>Leave</option>
                            <option value="present" ${item.attendence === "present" ? "selected" : ""}>Present</option>
                            <option value="absent" ${item.attendence === "absent" ? "selected" : ""}>Absent</option>
                        </select>`,
                    showCancelButton: true,
                    confirmButtonText: 'Save',
                    cancelButtonText: 'Cancel',
                    preConfirm: () => {
                        const updatedEmail = document.getElementById(`edit-email-${docId}`).value;
                        const updatedAttendance = document.getElementById(`edit-attendance-${docId}`).value;
    
                        // Update document in Firestore
                        return updateDoc(doc(db, "users", docId), {
                            email: updatedEmail,
                            attendence: updatedAttendance
                        });
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire('Saved!', 'Your changes have been saved.', 'success');
                        readData(); // Refresh data to reflect changes
                    }
                }).catch((err) => {
                    console.error('Error during edit:', err);
                });
            });
        });
}
