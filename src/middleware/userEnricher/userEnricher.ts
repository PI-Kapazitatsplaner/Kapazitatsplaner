import express from "express";
import prisma, { getTestUserSub } from "../../prisma/client";

export default async function enrichUser(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let content;
  if (process.env.NODE_ENV === "test" || process.env.mockKeycloak === "true") {
    console.log("Mocking Userenricher");
    content = {
      sub: getTestUserSub(),
      name: "mock",
      preferred_username: "mtm",
      given_name: "test",
      family_name: "mock",
      email: "test@mock.ch",
    };
  } else {
    if (req.kauth.grant === undefined) {
      res.status(500).send("Error in Keycloak middleware");
    }
    content = req.kauth.grant.access_token.content;
  }

  const user =
    (await prisma.user.findUnique({ where: { sub: content.sub } })) ||
    (await prisma.user.create({
      data: { sub: content.sub,
              firstname: content.name,
              lastname: content.family_name,
              standardAbwesenheiten: [0, 6] },
    }));

  req.user = {
    sub: content.sub,
    name: content.name,
    preferredUsername: content.preferred_username,
    givenName: content.given_name,
    familyName: content.family_name,
    email: content.email,
    prefersWhiteMode: user.preferencesWhiteMode,
    standardAbwesenheiten: user.standardAbwesenheiten,
  }
  next();
}
