require("dotenv").config();
const supabase = require("./src/config/supabase-client");

(async () => {
  const { data, error } = await supabase.storage.createBucket("users-files", {
    fileSizeLimit: process.env.UPLOAD_LIMIT,
  });
  console.log(data || error);
})();
