const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

function getAdbPath() {
  const sdkRoot =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");

  const adbName = process.platform === "win32" ? "adb.exe" : "adb";
  return path.join(sdkRoot, "platform-tools", adbName);
}

const adb = getAdbPath();

if (!fs.existsSync(adb)) {
  console.warn(
    "[adb-reverse] adb not found. Add Android SDK platform-tools to PATH."
  );
  process.exit(0);
}

const ports = [8081, 8082, 19000, 19001];

console.log('platform: '+ process.platform);
console.log('adb: '+ adb);

for (const port of ports) {
  try {
    execSync(`"${adb}" reverse tcp:${port} tcp:${port}`, { stdio: "ignore" });
    console.log(`[adb-reverse] tcp:${port} -> tcp:${port}`);
  } catch {
    // Ignore if emulator is offline or port already mapped.
  }
}
