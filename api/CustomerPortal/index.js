"use strict";
const { authenticate, failure } = require("../shared/portal/access");
const { defender, sentinel } = require("../shared/portal/microsoft");
const { listCases } = require("../shared/portal/cases");
const {
  approvedPackage,
  download,
  platforms,
} = require("../shared/portal/downloads");
const { json } = require("../shared/http");

function createHandler(deps = {}) {
  return async function (context, req) {
    try {
      const access = await (deps.authenticate || authenticate)(req);
      const section = context.bindingData?.section || "profile";
      let result;
      if (section === "profile") {
        result = {
          company: access.tenant.companyName,
          name: access.member.displayName,
          role: access.member.role,
          companyWide: access.companyWide,
          supportUrl: "https://cyproteck.com/support",
          packages: platforms.map((platform) => {
            try {
              approvedPackage(access, platform);
              return { platform, available: true };
            } catch (_) {
              return { platform, available: false };
            }
          }),
          // No credit or protection assertion can be inferred from configuration.
          attribution:
            "Partner association requires verification in Microsoft Partner Center.",
        };
      } else if (section === "defender")
        result = await (deps.defender || defender)(access);
      else if (section === "sentinel")
        result = await (deps.sentinel || sentinel)(access);
      else if (section === "tickets")
        result = await (deps.listCases || listCases)(access);
      else if (section === "downloads") {
        context.res = await (deps.download || download)(
          access,
          context.bindingData?.platform,
        );
        context.log?.("Customer portal download", {
          tenantId: access.tenantId,
          objectId: access.objectId,
          platform: context.bindingData?.platform,
        });
        return;
      } else throw failure(404, "Page not found.");
      context.res = json(200, result, { "Cache-Control": "no-store" });
    } catch (error) {
      // Never return provider payloads, secrets, token fragments, or internal case notes.
      const status = error.statusCode || 502;
      context.log?.warn?.("Customer portal request failed", {
        name: error.name,
        status,
      });
      context.res = json(
        status,
        {
          error: error.statusCode
            ? error.message
            : "This connection is temporarily unavailable. Please retry or contact support.",
        },
        { "Cache-Control": "no-store" },
      );
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
