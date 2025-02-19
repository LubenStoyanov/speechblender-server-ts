import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
export const createPodcast = async (req, res) => {
    try {
        const { title } = req.body;
        const token = req.cookies.token;
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (user) {
            const podcast = await prisma.podcast.create({
                data: { title: title, authorId: userId },
            });
            return res.status(200).json({
                success: true,
                title,
                username: user.name,
                podcastId: podcast.id,
            });
        }
        else {
            return res
                .status(403)
                .json({ success: false, message: "User doesn't exist." });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
        });
    }
};
//# sourceMappingURL=create.js.map