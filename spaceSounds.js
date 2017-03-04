exports.handler = (event, context, callback) => {
    try {
        if (event.session.new) {
            console.log("NEW SESSION")
        }

    switch (event.request.type) {
        case "LaunchRequest":
            console.log('LAUNCH REQUEST')
                context.succed(
                    generateResponse(
                        buildSpeechResponse("Some text to say here", true), {}
                    )
                )
            break;

        case "IntentRequest":
            console.log("INTENT REQUEST")
            break;

        case "SessionEndedRequest":
            console.log('SESSION ENDED REQUEST')
            break;

        default:
            context.fail(`INVALID REQUEST TYPE': ${event.request.type}`)
        }

    } catch(error) {context.fail(`Exception: ${error}`)}


};

buildSpeechResponce = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "plainText",
            text: outputText //what the device should say
        },
        shouldEndSession: shouldEndSession //should end the session or leave
        //open for more input
    }
}

//generates the data structure that is returned from the lambda function and
//returned to the amazon alexa service to pass to the device
generateResponse = (sessionAttributes, speechletResponse) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes, //mostly just an empty object
        responce: speechletResponse //generated from buildSpeechResponce function
    }
}
