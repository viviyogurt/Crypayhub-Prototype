create database CrypayhubEvent;
use CrypayhubEvent;

create table if not exists `Tx`(
	`tx_hash` varchar(66) not null,
    `block_height` bigint not null,
    `block_signed_at` datetime not null,
    primary key (`tx_hash`)
) engine=InnoDB default charset=utf8;

-- Ownerable
create table if not exists `OwnershipTransferred` (
	`tx_hash` varchar(66) not null,
    `newOwner` varchar(42) null,
    `previousOwner` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

-- ERC20
create table if not exists `Transfer` (
	`tx_hash` varchar(66) not null,
    `from` varchar(42) not null,
    `to` varchar(42) not null,
    `value` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `Approval` (
	`tx_hash` varchar(66) not null,
    `owner` varchar(42) not null,
    `spender` varchar(42) not null,
    `value` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

-- Crypayhub Core
create table if not exists `DeliverCommission` (
	`tx_hash` varchar(66) not null,
    `commissioner` varchar(42) not null,
    `commissionFee` bigint not null,
    `customer` varchar(42) not null,
    `merchant` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `DeliverOneTimeAward` (
	`tx_hash` varchar(66) not null,
    `awardAmount` bigint not null,
    `commissioner` varchar(42) not null,
    `customer` varchar(42) not null,
    `merchant` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `RemoveCommissioner` (
	`tx_hash` varchar(66) not null,
    `account` varchar(42) not null,
    `commissioner` varchar(42) not null,
    `customer` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetCommissioner` (
	`tx_hash` varchar(66) not null,
    `account` varchar(42) not null,
    `customer` varchar(42) not null,
    `commissioner` varchar(42) not null,
    `commissionRate` int not null,
    `oneTimeAward` bigint not null,
    `validPeriod` int not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetMerchant` (
	`tx_hash` varchar(66) not null,
    `awardAmount` bigint not null,
    `merchantAddr` varchar(42) not null,
    `isMerchant` bool not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetProxyContractForTransfer` (
	`tx_hash` varchar(66) not null,
    `proxyContract` varchar(42) not null,
    `isProxyContract` bool not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetServiceCommission` (
	`tx_hash` varchar(66) not null,
    `account` varchar(42) not null,
    `oneTimeAward` bigint not null,
    `rate` int not null,
    `validPeriodDay` int not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `Transfer` (
	`tx_hash` varchar(66) not null,
    `from` varchar(42) not null,
    `to` varchar(42) not null,
    `value` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `TransferPaymentFee` (
	`tx_hash` varchar(66) not null,
    `from` varchar(42) not null,
    `to` varchar(42) not null,
    `value` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetWhitelistSender` (
	`tx_hash` varchar(66) not null,
    `exceptionAddress` varchar(42) not null,
    `transactionFeeRate` int not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `SetWhitelistReceiver` (
	`tx_hash` varchar(66) not null,
    `exceptionAddress` varchar(42) not null,
    `transactionFeeRate` int not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

-- Subscription
create table if not exists `SetService` (
	`tx_hash` varchar(66) not null,
    `serviceProvider` varchar(42) not null,
    `serviceIndex` int not null,
    `serviceName` varchar(256) not null,
    `fee` bigint not null,
    `period` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `DeleteService` (
	`tx_hash` varchar(66) not null,
    `serviceProvider` varchar(42) not null,
    `serviceIndex` int not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `Subscribe` (
	`tx_hash` varchar(66) not null,
    `recipient` varchar(42) not null,
    `customer` varchar(42) not null,
    `serviceIndex` int not null,
    `price` bigint not null,
    `subscriptionTime` bigint not null,
    `expirationTime` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `AutoCharged` (
	`tx_hash` varchar(66) not null,
    `recipient` varchar(42) not null,
    `customer` varchar(42) not null,
    `serviceIndex` int not null,
    `price` bigint not null,
    `newExpirationTime` bigint not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `CancelSubscription` (
	`tx_hash` varchar(66) not null,
    `serviceProvider` varchar(42) not null,
    `serviceIndex` int not null,
    `customer` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

create table if not exists `TerminateSubscription` (
	`tx_hash` varchar(66) not null,
    `serviceProvider` varchar(42) not null,
    `serviceIndex` int not null,
    `customer` varchar(42) not null,
    primary key (`tx_hash`),
    foreign key(`tx_hash`) references Tx(tx_hash)
) engine=InnoDB default charset=utf8;

