-- Todo: update query to take account on the removed subscription service

SELECT
    serviceProvider, serviceIndex, serviceName, fee, period, block_signed_at as publishTime
FROM
    SetService
        INNER JOIN
    Tx ON Tx.tx_hash = SetService.tx_hash
WHERE
    serviceProvider = ?
    order by Tx.block_signed_at

-- Todo: update the query to take account on remove and autocharge's
SELECT
    recipient as serviceProvider, customer, serviceIndex, price, subscriptionTime, expirationTime
FROM
    Subscribe
        INNER JOIN
    Tx ON Tx.tx_hash = Subscribe.tx_hash
WHERE
    customer = ?
    order by subscriptionTime