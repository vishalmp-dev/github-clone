import fs from "fs/promises";
import path from "path";
import { S3, S3_BUCKET } from "../config/aws-config.js";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 1. Get all objects from S3
    const command = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });

    const data = await S3.send(command);
    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      // 2. Create commit folder
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop()
      );

      await fs.mkdir(commitDir, { recursive: true });

      // 3. Get file from S3
      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      const response = await S3.send(getCommand);

      //  convert stream → buffer
      const fileContent = await response.Body.transformToByteArray();

      // 4. Save file locally
      const filePath = path.join(repoPath, key);
      await fs.writeFile(filePath, fileContent);
    }

    console.log("All commits pulled from S3 ");

  } catch (e) {
    console.error("Unable to pull commits from S3...", e);
  }
}