import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = "Demo_1";

const Github = async (branchName) => {
  /**
 * Check if a branch exists in the repository
 * @param {string} branchName - The branch name to check
 * @returns {Promise<boolean>} - Returns true if branch exists, false otherwise
 */
const checkBranchExists = async (branchName) => {
    if (!branchName) {
      throw new Error("Branch name is required");
    }
    
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      throw new Error("GitHub configuration is incomplete. Check your environment variables.");
    }
  
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${encodeURIComponent(branchName)}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      });
      
      console.log(`Branch '${branchName}' exists`);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Branch '${branchName}' does not exist`);
        return false;
      }
      
      console.error("Error checking branch:", error.message);
      throw error;
    }
  };
  
  // When running directly as a script
  if (import.meta.url === `file://${process.argv[1]}`) {
    const branchName = process.argv[2];
    
    if (!branchName) {
      console.log("Please provide a branch name as an argument:");
      console.log("  node Github.js main");
    } else {
      checkBranchExists(branchName).catch(err => {
        process.exit(1);
      });
    }
  }
  return checkBranchExists(branchName);
}


export default Github;