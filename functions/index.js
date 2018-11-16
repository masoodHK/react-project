const functions = require('firebase-functions');
const admin = require('firebase-admin').initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});
exports.sendMeetingRequest = functions.firestore.document('user/{userID}/meetings/{meetingID}').onCreate((snapshot, context) => {
    const data = snapshot.data();
    const userID = data.userID;
    const requestSentBy = data.setBy;
    
    const meeting = admin.firestore().collection('user').doc(userID).collection('requests');
    meeting.add({
        requestSentBy,
        senderID: data.setterID,
        date: data.date,
        time: data.time,
        location: data.location,
        status: data.status,
    })
})