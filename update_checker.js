const cp = require("child_process");

function runCommand(cmd) {

    return cp.spawnSync(cmd, {
        shell: true,
        cwd: process.cwd()
    });

}

let gitStatus = runCommand("git status").output.toString("utf-8"),
    statusLines = !!gitStatus ? gitStatus.split("\n") : "",
    currentBranch = "None",
    need_pull = true


for(let i = 0; i < statusLines.length; i++) {
    let line = statusLines[i];

    if(line.startsWith("On branch") || line.startsWith(",On branch")) {

        let brachParts = line.split(" ").splice(2, line.length-2);

        currentBranch = brachParts.join(" ");

    }

    if(line.includes("Your branch is up to date")) {
        need_pull = false;
    }
}

console.log("[UPDATER] > Current branch: "+currentBranch)

if(!need_pull) {
    console.log("[UPDATER] > Up to date with origin");
    process.exit(0)
}

console.log("[UPDATER] > New versión available!")
console.log("[UPDATER] > Updating!")
runCommand("git pull")
process.exit(2)