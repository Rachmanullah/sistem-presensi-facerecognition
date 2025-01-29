const prisma = require("../lib/prismaClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam
        const tokenPayload = {
            userId: user.id,
            username: user.username,
            role: user.role,
            expiresAt,
        };

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET,
            { algorithm: 'HS256' }
        );

        await prisma.user.update({
            where: { id: user.id },
            data: { token },
        });

        const dataAuth = {
            ...user,
            token
        }

        console.log('[Service] Token created and saved to database'); // Debug log
        return dataAuth;
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
}