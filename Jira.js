import axios from "axios";
import dotenv from "dotenv";


dotenv.config();
const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

const Jira = async (ticketId) => {
  if (!ticketId) {
    throw new Error("Ticket ID is required");
  }
  
  const url = `https://${JIRA_DOMAIN}/rest/api/2/issue/${ticketId}?expand=attachment,comment`;
  const auth = { username: JIRA_USERNAME, password: JIRA_TOKEN };
  
  try {
    console.log(`Fetching details for ticket: ${ticketId}...`);
    const response = await axios.get(url, { auth: auth });
    const ticket = response.data;
    
    // Extract all the required information
    const result = {
      Ticket_id: ticket?.key,
      Title: ticket?.fields?.summary,
      Description: ticket?.fields?.description || "No description available",
      Status: ticket?.fields?.status?.name || "Unknown",
      Attachments: ticket?.fields?.attachment || [],
      Comments: ticket?.fields?.comment?.comments || []
    };
    
    if (import.meta.url === `file://${process.argv[1]}`) {
      // When running directly, print full ticket info
      console.log(`\nTicket: ${result.Ticket_id} - ${result.Title}`);
      console.log(`Status: ${result.Status}`);
      console.log(`\nDescription:\n${result.Description}`);
      
      // Print attachments
      console.log("\nAttachments:");
      if (result.Attachments.length === 0) {
        console.log("  No attachments found");
      } else {
        result.Attachments.forEach((attachment, index) => {
          console.log(`  ${index + 1}. ${attachment.filename} (${attachment.mimeType})`);
          console.log(`     URL: ${attachment.content}`);
          if (attachment.thumbnail) {
            console.log(`     Thumbnail: ${attachment.thumbnail}`);
          }
        });
      }
      
      // Print comments
      console.log("\nComments:");
      if (result.Comments.length === 0) {
        console.log("  No comments found");
      } else {
        result.Comments.forEach((comment, index) => {
          console.log(`  ${index + 1}. By ${comment.author.displayName} on ${new Date(comment.created).toLocaleString()}`);
          console.log(`     ${comment.body.replace(/\n/g, "\n     ")}`);
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error fetching Jira ticket ${ticketId}:`, error.message);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ticketId = process.argv[2];
  if (!ticketId) {
    console.log("Please provide a ticket ID as an argument:");
    console.log("  node Jira.js TICKET-123");
  } else {
    Jira(ticketId).catch(err => {
      process.exit(1);
    });
  }
}

export default Jira;