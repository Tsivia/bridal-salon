/* Maison Éliane — Supabase wiring.
 *
 * These two values are safe to publish: the publishable key can only do what
 * row-level security allows. On this project that is INSERT into `enquiries`
 * and nothing else — it cannot read a single enquiry back.
 *
 * Reading enquiries goes through the `get_enquiries` database function, which
 * demands the admin password. The password lives in the database, never here.
 */
const SUPABASE_URL = "https://jclvyahmxbxveebzvaqi.supabase.co";
const SUPABASE_KEY = "sb_publishable_F5ghtfOBBNu9bzyR7PIBnw_xssmSwV2";

const SUPABASE_HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

/** Save one enquiry from the public booking form. */
async function submitEnquiry(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
    method: "POST",
    headers: { ...SUPABASE_HEADERS, Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

/** Read every enquiry. Throws "unauthorized" when the password is wrong. */
async function fetchEnquiries(password) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_enquiries`, {
    method: "POST",
    headers: SUPABASE_HEADERS,
    body: JSON.stringify({ p_password: password }),
  });
  if (res.status === 401 || res.status === 403) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}
