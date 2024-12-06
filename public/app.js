import {
    app, auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup, provider, GoogleAuthProvider, deleteUser
}
    from './firebase.js'
  
  //Auth//
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user);
    if (user) {
        
      // User is signed in
      const uid = user.uid;
      console.log("user exists", user);
      console.log("user id ",uid);

      localStorage.setItem('user id', user.uid)
      localStorage.setItem('email', user.email);
      localStorage.setItem('name', user.
        displayName)
      
    } else {
      // User is signed out
      console.log("user does not exist", user);
    }
  });
let user_id = localStorage.getItem('user id');
let user_email = localStorage.getItem('email');
let user_name = localStorage.getItem('name');

  document.addEventListener("DOMContentLoaded", () => {
    //////Register///////////
    let registerBtn = document.getElementById('register');
  
    if (registerBtn) {
      try {
        let registerFunc = () => {
          let email = document.getElementById('email');
          let password = document.getElementById('password');
  
          createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
              // Signed up
              const user = userCredential.user;
              console.log("User registered");
              // alert("User registered");
  
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Registration Successful!",
                text: 'Thank you for registering. Welcome aboard!',
                showConfirmButton: false,
                timer: 2000
              });
              
              if(user_email === 'maheeenkhan4@gmail.com'){
                window.location.href = './adminPage.html'
              }
              else{

              setTimeout(() => {
                window.location.href = "./home.html";
              }, 2000);
            }
  
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log("User registration failed");
              console.log(errorMessage);
            });
        };
  
        registerBtn.addEventListener('click', registerFunc);
      } catch (e) {
        console.error("Register button not found in the DOM.", e);
      }
    }
});


/////google authentication


let googleBtn = document.getElementById('google');

document.addEventListener("DOMContentLoaded", () => {

if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider)
      .then((result) => {

        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;
        console.log(token);
        console.log(user);

        if(user_email === 'maheeenkhan4@gmail.com'){
          window.location.href = './adminPage.html'
        }
        else{

        setTimeout(() => {
          window.location.href = "./home.html";
        }, 2000);
      }

      }).catch((error) => {
    
        
        const errorMessage = error.message;
        console.log(errorMessage);

        const credential = GoogleAuthProvider.credentialFromError(error);

      });

  })
}
});

///////Login/////////////
let loginBtn = document.getElementById('login');

if (loginBtn) {
  try {

    loginBtn.addEventListener("click", () => {
      let loginEmail = document.getElementById('login-email');
      let loginPassword = document.getElementById('login-password');

      signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // alert("Login Successfully!");

          Swal.fire({
            title: "Login Successfully!",
            showClass: {
              popup: `
                          animate__animated
                          animate__fadeInUp
                          animate__faster
                        `
            },
            hideClass: {
              popup: `
                          animate__animated
                          animate__fadeOutDown
                          animate__faster
                        `
            }
          });

          let newuser = user.email.split('@')[0];  // Get part before '@'
          let nameOnly = newuser.replace(/[0-9]/g, ""); // Remove numbers from the name part
  
          // Store name in localStorage
          localStorage.setItem('name', nameOnly);
  
          localStorage.setItem('email', loginEmail.value)

          setTimeout(() => {
            window.location.href = "./home.html";
          }, 2000);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // alert("Invalid Information!")
        });
    });
  } catch (e) {
    console.error("Login button not found in the DOM.", e);
  }
}

