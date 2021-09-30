const dbUtil = require('../util/dbUtil');

const insert = {
    /**
     *
     * @param obj {eventName:string, tx:{}, eventParams:{}}
     * @returns {Promise<*boolean>}
     */
    batchWriteEvents : async (obj) => {
        let DBConn=new dbUtil.DBUnity(await dbUtil.getConnection());
        try {
            await DBConn.beginTransaction();
            for (let i = 0; i < obj.length; i++) {
                console.log("Event Name:", obj[i].eventName, "Event Param", obj[i].eventParams, "tx", obj[i].tx);
                let insertTx = await DBConn.query('insert ignore into Tx set ?', obj[i].tx);
                if (!insertTx.success) {
                    await DBConn.rollback();
                    return true;
                }
                let insertEvent = await DBConn.query(`insert ignore into ${obj[i].eventName} set ?`, obj[i].eventParams);
                if (!insertEvent.success) {
                    await DBConn.rollback();
                    return false;
                }
            }
            await DBConn.commit();
        }catch (e) {
            console.error(e);
            await DBConn.rollback();
        }
        return null;
    }
}

module.exports = insert;