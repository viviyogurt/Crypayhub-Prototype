const config = require('./config');
const admin = require('firebase-admin');

const dbQuery = {
    eventLatestRecordsQuery: async(event) => {
        console.log(`event ${event}`)
        let res = [];
        let tempDoc = null;
        let eventsRef = admin.firestore().collection('events').doc(event)
            .collection('eventRecords');

        let eventRecordDocs = await eventsRef
            .orderBy(config.eventField.block_signed_at, config.order.desc)
            .orderBy("tx_hash")
            .limit(config.cacheRecordsNum[event])
            .get();

        eventRecordDocs.forEach(doc => {
            tempDoc = doc.data();
            res.push(tempDoc);
        });
        console.log(`[${res.length}] [${event}] event latest records retrieved from DB`);
        return res;
    },

    eventFilterQuery: async(event, filterField, filterValue) => {
        console.log(`type of filter value ${typeof filterValue} ${filterValue.size}`)
        let res = [];
        let tempDoc = null;
        let eventsRef = admin.firestore().collection('events').doc(event)
            .collection('eventRecords');

        let eventRecordDocs = await eventsRef
            .where(filterField, '==', filterValue)
            .orderBy(config.eventField.block_signed_at, config.order.desc)
            .orderBy("tx_hash")
            .limit(config.queryActivityRecordNum[event])
            .get();

        eventRecordDocs.forEach(doc => {
            tempDoc = doc.data();
            res.push(tempDoc);
        });
        console.log(`[${res.length}] [${event}] event records retrieved from DB filter by ${filterField} with filterValue ${filterValue}`);
        return res;
    }
}

module.exports = dbQuery;