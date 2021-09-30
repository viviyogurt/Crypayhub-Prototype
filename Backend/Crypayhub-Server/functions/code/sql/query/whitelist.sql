-- Sender whitelist

SELECT
    Tx.tx_hash,
    Tx.block_height,
    Tx.block_signed_at,
    SetWhitelistSender.exceptionAddress,
    SetWhitelistSender.transactionFeeRate
FROM
    SetWhitelistSender
        INNER JOIN
    Tx ON Tx.tx_hash = SetWhitelistSender.tx_hash
GROUP BY SetWhitelistSender.exceptionAddress
HAVING MAX(Tx.block_height) = Tx.block_height;

-- Receiver whitelist

SELECT
    Tx.tx_hash,
    Tx.block_height,
    Tx.block_signed_at,
    SetWhitelistReceiver.exceptionAddress,
    SetWhitelistReceiver.transactionFeeRate
FROM
    SetWhitelistReceiver
        INNER JOIN
    Tx ON Tx.tx_hash = SetWhitelistReceiver.tx_hash
GROUP BY SetWhitelistReceiver.exceptionAddress
HAVING MAX(Tx.block_height) = Tx.block_height;