module.exports = async function (context, req) {
  // Parse the JWT claims from X-MS-CLIENT-PRINCIPAL header
  const principal = req.headers['x-ms-client-principal'];
  if (!principal) {
    context.res = { status: 401, body: { allowedRoles: [] } };
    return;
  }

  const decoded = JSON.parse(Buffer.from(principal, 'base64').toString());
  // Example: extract tenantId or email claim
  const tenantIdClaim = decoded.claims.find(
    (c) => c.typ === 'http://schemas.microsoft.com/identity/claims/tenantid'
  );
  const emailClaim = decoded.claims.find((c) => c.typ === 'preferred_username');

  const tenantId = tenantIdClaim ? tenantIdClaim.val : null;
  const email = emailClaim ? emailClaim.val : null;

  let allowedRoles = ['Employee']; // default role

  // TODO: replace these with your own logic or environment variables
  const owners = process.env.OWNER_EMAILS
    ? process.env.OWNER_EMAILS.split(',')
    : [];
  const businessOwners = process.env.BUSINESS_OWNER_EMAILS
    ? process.env.BUSINESS_OWNER_EMAILS.split(',')
    : [];

  if (email && owners.includes(email)) {
    allowedRoles = ['Owner'];
  } else if (email && businessOwners.includes(email)) {
    allowedRoles = ['BusinessOwner'];
  }

  context.res = {
    status: 200,
    body: { allowedRoles },
  };
};
