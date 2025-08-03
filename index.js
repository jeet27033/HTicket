import Jira from './Jira.js';
import checkBranchExists from './Github.js';
import Ai from './Ai.js';

async function HTicket() {
  try {

    // //jira
    // const description = await Jira('CAP-155585');
    // console.log(description);
    
    // // git
    // await checkBranchExists("a1");

    // //ai
    // console.log(await Ai("say love you to the girl just you met recently indirectly"));


  } catch (error) {
    console.error('Error in HTicket:', error);
  }
}

HTicket(); 