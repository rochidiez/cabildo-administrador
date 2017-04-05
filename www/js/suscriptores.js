
firebase.auth().createUserWithEmailAndPassword('ay@gmail.com', '4yn0td34d').then(function(user) {
    // [END createwithemail]
    // callSomeFunction(); Optional
    // var user = firebase.auth().currentUser;
    user.updateProfile({
        displayName: 'AY Not Dead',
        photoURL: 'http://www.cordobashopping.com.ar/img/locales/logos/1452183858_aynot.jpg'
    }).then(function() {
        // Update successful.
    }, function(error) {
        // An error happened.
    });        
}, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
    } else {
        console.error(error);
    }
    // [END_EXCLUDE]
});	