-- rank service
SELECT
    Service.account AS merchant,
    Service.oneTimeAward,
    Service.rate as commissionRate,
    Service.validPeriodDay,
    Total.totalCommissionDeliver,
    Total2.totalAwardDeliver
FROM
    (SELECT
        Tx.block_height,
            SetServiceCommission.account,
            SetServiceCommission.oneTimeAward,
            SetServiceCommission.rate,
            SetServiceCommission.validPeriodDay
    FROM
        SetServiceCommission
    INNER JOIN Tx ON Tx.tx_hash = SetServiceCommission.tx_hash
    GROUP BY account
    HAVING MAX(block_height) = block_height) AS Service
        LEFT OUTER JOIN
    (SELECT
        SUM(commissionFee) AS totalCommissionDeliver, merchant
    FROM
        DeliverCommission
    GROUP BY merchant) AS Total ON Total.merchant = Service.account

        LEFT OUTER JOIN
    (SELECT
        SUM(awardAmount) AS totalAwardDeliver, merchant
    FROM
        DeliverOneTimeAward
    GROUP BY merchant) AS Total2 ON Total2.merchant = Service.account

    where Service.oneTimeAward > 0 or
    (Service.rate > 0 and Service.validPeriodDay > 0)

    order by ? desc
    limit ?
    offset ?

--     count total service record
SELECT
    count(*) as recordNum
FROM
    (SELECT
        Tx.block_height,
            SetServiceCommission.account,
            SetServiceCommission.oneTimeAward,
            SetServiceCommission.rate,
            SetServiceCommission.validPeriodDay
    FROM
        SetServiceCommission
    INNER JOIN Tx ON Tx.tx_hash = SetServiceCommission.tx_hash
    GROUP BY account
    HAVING MAX(block_height) = block_height) AS Service
    where Service.oneTimeAward > 0 or
    (Service.rate > 0 and Service.validPeriodDay > 0)