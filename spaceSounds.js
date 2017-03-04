var https = require('https')

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
            var endpoint = "http://marsweather.ingenology.com/v1/latest/"
            var body = ""
            https.get(endpoint, (response) => {
                response.on(data, (chunk) => {body += chunk})
                response.on(end, () => {
                    var data = JSON.parse(body)
                    var marsAtmo = data.report.atmo_opacity
                    var marsHigh = data.report.max_temp_fahrenheit
                    var marsLow = data.report.min_temp_fahrenheit
                    context.succeed(
                        generateResponse(
                            buildSpeechResponse(`The weather on Mars today is ${MarsAtmo} with a high of ${marsHigh} and a low of ${MarsLow}`)
                        )
                    )
                })
            })
            break;

        case "SessionEndedRequest":
            console.log('SESSION ENDED REQUEST')
            break;

        default:
            context.fail(`INVALID REQUEST TYPE': ${event.request.type}`)
        }

    } catch(error) {context.fail(`Exception: ${error}`)}


};

buildSpeechResponse = (outputText, shouldEndSession) => {
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
