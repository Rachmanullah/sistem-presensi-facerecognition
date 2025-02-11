const prisma = require("../lib/prismaClient");
const bcrypt = require("bcryptjs");


const findAllUser = async () => {
    try {
        const data = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
            }
        });
        return data;
    } catch (error) {
        throw error;
    }
};

const findUserByID = async (id) => {
    try {
        const data = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                role: true,
            }
        });
        return data;
    } catch (error) {
        throw error;
    }
}

const createUser = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: data.role,
            },
        });
        return newUser;
    } catch (error) {
        throw error;
    }
};

const updateUser = async (id, data) => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username: data.username,
                role: data.role,
            },
        });
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

const destroyUser = async (id) => {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        return deletedUser;
    } catch (error) {
        throw error;
    }
}

const authenticateUser = async (username, password) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        });

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }

        return user;
    } catch (error) {
        throw error;
    }
}

const updateTokenUser = async (userID, token) => {
    try {
        const updatedToken = await prisma.user.update({
            where: { id: userID },
            data: {
                token: token
            },
        });
        return updatedToken;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllUser,
    findUserByID,
    createUser,
    updateUser,
    destroyUser,
    authenticateUser,
    updateTokenUser
}