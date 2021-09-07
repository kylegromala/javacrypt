const Account = require("../models/account");

module.exports = {};

module.exports.create = (account, user) => {
    account.userId = user._id;
    return Account.create(account);
}

module.exports.getUserAccounts = async (user) => {
    try {
        if (user.roles.includes("admin")) {
            return await Account.find().lean();
        } else {
            return await Account.find({ userId: user._id }).lean();
        }
    } catch {
        throw new Error("get accounts failed");
    }
}

module.exports.getAccountById = async (user, account_id) => {
    try {
        const userAccount = await Account.findOne({ _id: account_id }).lean();
        if (user.roles.includes("admin")) {
            return userAccount;
        } else if (user._id.toString() === userAccount.userId.toString()) {
            return userAccount;
        } else {
            throw new Error("unauthorized")
        }
    } catch {
        throw new Error("get account failed");
    }
}

module.exports.updateAccountById = (id, newData, user) => {
    return Account.findOneAndUpdate({ _id: id, userId: user._id }, newData, { new: true });
}

module.exports.removeAccountById = (id) => {
    return Account.findOneAndDelete({ _id: id })
}
