import { UmiApiRequest, UmiApiResponse } from "umi";
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from "@/utils/jwt";

export default async function (req: UmiApiRequest, res: UmiApiResponse) {
  const { email, password, name, avatarUrl } = req.body

  switch (req.method) {
    case 'POST':
      try {
        if (password.length < 8) {
          throw '密码至少8位数'
        }
        const prisma = new PrismaClient();
        if (email) {
          //email唯一查找
          const uniqueEmail = await prisma.user.findUnique({
            where: {
              email: email
            }
          })
          if (uniqueEmail) {
            res.status(400).json({
              message: `邮箱：${email} 数据库已经存在，不能重复！`
            })
            await prisma.$disconnect()
            return
          }
        }

        if (name) {
          //email唯一查找
          const uniqueName = await prisma.user.findUnique({
            where: {
              name: name
            }
          })
          if (uniqueName) {
            res.status(400).json({
              message: `名字：${name} 数据库已经存在，不能重复！`
            })
            await prisma.$disconnect()
            return
          }
        }
        const user = await prisma.user.create({
          data: {
            email: email,
            passwordHash: bcrypt.hashSync(password, 8),
            password: password,
            name: name,
            avatarUrl: avatarUrl
          }
        });
        res.status(201)
          .setCookie('token', await signToken(user.id))
          .json({ ...user })
        await prisma.$disconnect()
      } catch (e: any) {
        console.log(e);

        res.status(500).json({
          result: false,
          message: typeof e.code === 'string' ? 'https://www.prisma.io/docs/reference/api-reference/error-reference#' + e.code.toLowerCase() : e
        })
      }
      break;
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}