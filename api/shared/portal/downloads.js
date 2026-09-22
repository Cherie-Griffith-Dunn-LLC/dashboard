"use strict";

const { failure } = require("./access");
const platforms = ["windows", "macos", "linux"];
function approvedPackage(access, platform) {
  const pkg = access.tenant.onboarding?.[platform];
  if (
    !platforms.includes(platform) ||
    !pkg ||
    pkg.approved !== true ||
    pkg.tenantId !== access.tenantId ||
    !pkg.blobName?.startsWith(`${access.tenantId}/`) ||
    pkg.blobName.includes("..") ||
    !/^[a-f0-9]{64}$/i.test(pkg.sha256 || "")
  ) {
    throw failure(
      404,
      "An approved onboarding package is not available for your company yet.",
    );
  }
  if (
    !pkg.expiresAt ||
    !Number.isFinite(Date.parse(pkg.expiresAt)) ||
    Date.parse(pkg.expiresAt) <= Date.now()
  ) {
    throw failure(
      404,
      "Your onboarding package needs to be refreshed by support.",
    );
  }
  return pkg;
}

async function download(access, platform, env = process.env) {
  const pkg = approvedPackage(access, platform);
  if (
    !/^[a-z0-9]{3,24}$/.test(env.PORTAL_DOWNLOAD_STORAGE_ACCOUNT || "") ||
    !/^[a-z0-9-]{3,63}$/.test(env.PORTAL_DOWNLOAD_CONTAINER || "")
  ) {
    throw failure(503, "Device setup downloads are awaiting configuration.");
  }
  const { DefaultAzureCredential } = require("@azure/identity");
  const { BlobServiceClient } = require("@azure/storage-blob");
  const service = new BlobServiceClient(
    `https://${env.PORTAL_DOWNLOAD_STORAGE_ACCOUNT}.blob.core.windows.net`,
    new DefaultAzureCredential(),
  );
  const blob = service
    .getContainerClient(env.PORTAL_DOWNLOAD_CONTAINER)
    .getBlobClient(pkg.blobName);
  const response = await blob.download(0, undefined, {
    abortSignal: AbortSignal.timeout(20000),
  });
  const chunks = [];
  let size = 0;
  if (!response.readableStreamBody)
    throw failure(502, "Package download failed.");
  for await (const chunk of response.readableStreamBody) {
    size += chunk.length;
    if (size > 20 * 1024 * 1024) {
      response.readableStreamBody.destroy();
      throw failure(502, "Package is too large. Contact support.");
    }
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  if (
    require("crypto").createHash("sha256").update(body).digest("hex") !==
    pkg.sha256.toLowerCase()
  ) {
    throw failure(
      502,
      "Package integrity could not be verified. Contact support.",
    );
  }
  return {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `attachment; filename="CyproSecure-${platform}-onboarding.zip"`,
    },
    body,
    isRaw: true,
  };
}
module.exports = { approvedPackage, download, platforms };
