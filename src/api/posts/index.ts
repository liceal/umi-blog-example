import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  let prisma: PrismaClient;
  let authorId: number | undefined;
  switch (req.method) {
    case "GET":
      if (!req.cookies?.token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      authorId = (await verifyToken(req.cookies.token)).id;

      prisma = new PrismaClient();
      const allPosts = await prisma.post.findMany({
        where: {
          authorId,
        },
        include: { author: true },
      });
      res.status(200).json(allPosts);
      await prisma.$disconnect();
      break;

    case "POST":
      if (!req.cookies?.token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      authorId = (await verifyToken(req.cookies.token)).id;
      prisma = new PrismaClient();
      const newPost = await prisma.post.create({
        data: {
          title: req.body.title,
          content: req.body.content,
          createdAt: new Date(),
          authorId,
          tags: req.body.tags.join(","),
          imageUrl: req.body.imageUrl,
        },
      });
      res.status(200).json(newPost);
      await prisma.$disconnect();
      break;
    case "PUT":
      if (!req.cookies?.token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      prisma = new PrismaClient();
      const putPost = await prisma.post.update({
        where: { id: Number(req.body.id) },
        data: {
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags.join(","),
          imageUrl: req.body.imageUrl,
        },
      });
      res.status(200).json(putPost);
      await prisma.$disconnect();
      break;
    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
