 import fs from "fs/promises"
 import path from "path" 
 import {v4 as uuid} from "uuid"

export async function commitRepo(message) {

    const repoPath = path.resolve(process.cwd(),".myGit");
     const stagingPath = path.join(repoPath,"staging");
       const commitsPath = path.join(repoPath,"commits");

       try{
        const commitID = uuid();
        const commitDir = path.join(commitsPath,commitID);
        await fs.mkdir(commitDir,{recursive:true});

        const files = await fs.readdir(stagingPath);
        for(const file of files) {
        await fs.copyFile(
          path.join(stagingPath,file),
          path.join(commitDir,file)
        );
      }
         await fs.writeFile(
              path.join(commitDir,"commit.json"),
              JSON.stringify({message,date:new Date().toISOString})
            );
            console.log(`Commit ${commitID}  created successfully with message ${message}`)


       }catch(e){
        console.error("cannot commit due to Error:",e);
       }
  
}


