-- select account commisisoner's info
SELECT
SetTable.tx_hash,
SetTable.block_height,
SetTable.block_signed_at,
SetTable.account,
SetTable.customer,
SetTable.commissioner,
SetTable.commissionRate,
SetTable.oneTimeAward,
SetTable.validPeriod
FROM
    (SELECT
        Tx.tx_hash,
		Tx.block_height,
		Tx.block_signed_at,
		SetCommissioner.account,
		SetCommissioner.customer,
		SetCommissioner.commissioner,
		SetCommissioner.commissionRate,
		SetCommissioner.oneTimeAward,
		SetCommissioner.validPeriod
    FROM
        SetCommissioner
    INNER JOIN Tx ON Tx.tx_hash = SetCommissioner.tx_hash
    WHERE
        account = ?
    GROUP BY customer , commissioner
    HAVING MAX(Tx.block_height) = Tx.block_height) AS SetTable
        LEFT outer JOIN
    (SELECT
        Tx.block_height,
            RemoveCommissioner.commissioner,
            RemoveCommissioner.customer
    FROM
        RemoveCommissioner
    INNER JOIN Tx ON Tx.tx_hash = RemoveCommissioner.tx_hash
    WHERE
        account = ?
    GROUP BY customer , commissioner
    HAVING MAX(Tx.block_height) = Tx.block_height) AS RemoveTable ON SetTable.customer = RemoveTable.customer
        AND SetTable.commissioner = RemoveTable.commissioner
WHERE
    SetTable.block_height > RemoveTable.block_height
        OR RemoveTable.block_height IS NULL
limit 5
offset 0

-- select total commissioner
SELECT
count(*) as TotalCommisisoner
FROM
    (SELECT
        Tx.tx_hash,
		Tx.block_height,
		Tx.block_signed_at,
		SetCommissioner.account,
		SetCommissioner.customer,
		SetCommissioner.commissioner,
		SetCommissioner.commissionRate,
		SetCommissioner.oneTimeAward,
		SetCommissioner.validPeriod
    FROM
        SetCommissioner
    INNER JOIN Tx ON Tx.tx_hash = SetCommissioner.tx_hash
    WHERE
        account = ?
    GROUP BY customer , commissioner
    HAVING MAX(Tx.block_height) = Tx.block_height) AS SetTable
        LEFT outer JOIN
    (SELECT
        Tx.block_height,
            RemoveCommissioner.commissioner,
            RemoveCommissioner.customer
    FROM
        RemoveCommissioner
    INNER JOIN Tx ON Tx.tx_hash = RemoveCommissioner.tx_hash
    WHERE
        account = ?
    GROUP BY customer , commissioner
    HAVING MAX(Tx.block_height) = Tx.block_height) AS RemoveTable ON SetTable.customer = RemoveTable.customer
        AND SetTable.commissioner = RemoveTable.commissioner
WHERE
    SetTable.block_height > RemoveTable.block_height
        OR RemoveTable.block_height IS NULL