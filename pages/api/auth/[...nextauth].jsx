import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { verifyPassword } from "../../../libs/auth";

let prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "유저 아이디", type: "id", placeholder: "id" },
        password: {
          label: "유저 패스워드",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            id: String(credentials?.id),
          },
          select: {
            id: true,
            name: true,
            address: true,
            password: true,
            user_srl: true,
            profile_url: true,
          },
        });
        const login_log = await prisma.$queryRaw`
        INSERT INTO UserLog (user_srl, date, type) VALUES ((SELECT user_srl FROM User WHERE id=${
          credentials?.id
        }), ${new Date().toISOString().replace("T", " ").replace("Z", "")}, 0);
        `;
        if (!user) {
          throw new Error("유저를 찾을 수 없습니다.");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("비밀번호가 틀렸습니다.");
        }
        return {
          id: user.user_srl,
          email: user.id,
          name: user.name,
          image: user.profile_url,
        };
      },
    }),
  ],

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
