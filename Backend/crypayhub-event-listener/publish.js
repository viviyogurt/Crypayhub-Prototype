const {PubSub} = require('@google-cloud/pubsub');

// const topicName = 'Crypayhub-Dev-Events';
// const data = JSON.stringify({event: 'test event'});

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(data,topicName) {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer = Buffer.from(data);
    let retry = 0;
    while (retry <= 3) {
        if (retry>0){
            await sleep(retry*500);
        }
        try {
            console.log("try to publish")
            const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
            console.log(`Message ${messageId} published.`);
            break;
        } catch (error) {
            console.error(`Received error while publishing: ${error.message}, Retry: ${retry}`);
            retry++;
        }
    }
    if (retry > 3){
        throw "Fail to publish the message";
    }
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = {publishMessage};