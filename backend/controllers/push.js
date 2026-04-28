import fs from "fs/promises";
import path from "path";
import { S3, S3_BUCKET } from "../config/aws-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        });

        await S3.send(command);
      }
    }

    console.log("All commits successfully pushed to S3");

  } catch (e) {
    console.error("Error pushing to S3:", e);
  }
}