import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { z } from "zod";
import {
    createUserWithEmailAndPasswordInputModel,
    createUserWithEmailAndPasswordOutputModel,
    signInUserWithEmailAndPasswordInputModel,
    signInUserWithEmailAndPasswordOutputModel,
    getLoggedInUserInfoInputModel,
    getLoggedInUserInfoOutputModel,
} from "./model";

import { userService } from "../../services";

import { generatePath } from "../../utils/path-generator";
const getPath = generatePath("/authentication");
const TAGS = ["Authentication"];

const isProd = process.env.NODE_ENV === "production" || (process.env.NODE_ENV as string) === "prod";

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/createUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(createUserWithEmailAndPasswordInputModel)
        .output(createUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { fullName, email, password } = input;

            const { id, token } = await userService.createUserWithEmailAndPassword({
                fullName,
                email,
                password,
            });

            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return {
                id,
            };
        }),
    signInUserWithEmailAndPassword: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signInUserWithEmailAndPassword"),
                tags: TAGS,
            },
        })
        .input(signInUserWithEmailAndPasswordInputModel)
        .output(signInUserWithEmailAndPasswordOutputModel)
        .mutation(async ({ input, ctx }) => {
            const { email, password } = input;

            const { id, token } = await userService.signInUserWithEmailAndPassword({
                email,
                password,
            });

            ctx.setCookie("token", token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "strict",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            return {
                id,
            };
        }),
    getLoggedInUserInfo: authenticatedProcedure
        .meta({
            openapi: {
                method: "GET",
                path: getPath("/getLoggedInUserInfo"),
                tags: TAGS,
            },
        })
        .input(getLoggedInUserInfoInputModel)
        .output(getLoggedInUserInfoOutputModel)
        .query(async ({ ctx }) => {
            const { id, fullName, email } = await userService.getUserInfoById(ctx.user.id);

            return {
                id,
                fullName,
                email,
            };
        }),
    signout: publicProcedure
        .meta({
            openapi: {
                method: "POST",
                path: getPath("/signout"),
                tags: TAGS,
            },
        })
        .input(z.void())
        .output(z.boolean())
        .mutation(async ({ ctx }) => {
            ctx.setCookie("token", "", {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "strict",
                maxAge: 0,
            });
            return true;
        }),
});
